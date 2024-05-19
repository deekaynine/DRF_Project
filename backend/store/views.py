from django.shortcuts import render, redirect
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from store.models import Category, Product, Gallery, Color, Specification, Cart, CartOrder, CartOrderItem,ProductFaq, Wishlist, Notification, Coupon, Size, Review, Tax
from users.models import User

from store.serializers import ProductSerializer, CategorySerializer, CartSerializer, CartOrderSerializer, CartOrderItemSerializer, CouponSerializer, ReviewSerializer

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from decimal import Decimal
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY

def send_notification(user=None, vendor=None, order=None, order_item=None):
    Notification.objects.create(
        user=user,
        vendor=vendor,
        order=order,
        order_item=order_item,
    )


# Create your views here.

class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny,]

class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny,]

class ProductDetailAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny,]

    def get_object(self):
        slug = self.kwargs['slug']
        return Product.objects.get(slug=slug)
    
# To do: create vendor default shipping amount and product shipping amount if vendor gets product from a third party
class CartApiView(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [AllowAny,]

    def create(self, request, *args, **kwargs):
        payload = request.data

        product_id = payload['product_id']
        user_id = payload['user_id']
        qty = payload['qty']
        price = payload['price']
        shipping_amount = payload['shipping_amount']
        country = payload['country']
        size = payload['size']
        color = payload['color']
        cart_id = payload['cart_id']

        product = Product.objects.get(id=product_id)

        if user_id != "undefined":
            user = User.objects.get(id=user_id)
        else:
            user = None    

        tax = Tax.objects.filter(country=country).first()
        if tax:
            tax_rate = tax.rate / 100
        else:
            tax_rate = 0

        cart = Cart.objects.filter(cart_id = cart_id, product=product).first()
        
        if cart:
            cart.product = product
            cart.user = user
            cart.qty = qty
            cart.price = price 
            cart.sub_total = Decimal(price) * int(qty)
            cart.shipping_amount = Decimal(shipping_amount) * int(qty)
            cart.tax_fee = Decimal(cart.sub_total) * Decimal(tax_rate)
            cart.color = color
            cart.size = size
            cart.country = country
            cart.cart_id = cart_id

            service_fee_percentage = 10 / 100
            cart.service_fee = Decimal(service_fee_percentage) * cart.sub_total

            cart.total = cart.sub_total + cart.shipping_amount + cart.service_fee + cart.tax_fee
            cart.save() 

            return Response({'message' : 'Cart Updated Successfully'}, status=status.HTTP_200_OK)
       
        else:
            cart = Cart()
            cart.product = product
            cart.user = user
            cart.qty = qty
            cart.price = price 
            cart.sub_total = Decimal(price) * int(qty)
            cart.shipping_amount = Decimal(shipping_amount) * int(qty)
            cart.tax_fee = Decimal(cart.sub_total) * Decimal(tax_rate)
            cart.color = color
            cart.size = size
            cart.country = country
            cart.cart_id = cart_id

            service_fee_percentage = 10 / 100
            cart.service_fee = Decimal(service_fee_percentage) * cart.sub_total

            cart.total = cart.sub_total + cart.shipping_amount + cart.service_fee + cart.tax_fee
            cart.save() 

            return Response({'message' : 'Cart Created Successfully'}, status=status.HTTP_201_CREATED)

# Grab all Cart Items from a specific Cart
class CartListView(generics.ListAPIView):
    serializer_class = CartSerializer
    queryset = Cart.objects.all()
    permission_classes = [AllowAny,]

    def get_queryset(self,*args, **kwarg):
        
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id')

        if user_id is not None:
            user = User.objects.get(id=user_id)
            queryset = Cart.objects.filter(user=user, cart_id=cart_id)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)

        return queryset

# Grab Cart Items from a specific Cart and get total details
class CartDetailView(generics.RetrieveAPIView):
    serializer_class= CartSerializer
    permission_classes = [AllowAny,]
    lookup_field = "cart_id"

    def get_queryset(self):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id')

        if user_id is not None:
            user = User.objects.get(id=user_id)
            queryset = Cart.objects.filter(user=user, cart_id=cart_id)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)

        return queryset
    
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        total_shipping = 0.0
        total_tax = 0.0
        total_service_fee = 0.0
        total_sub_total = 0.0
        total_total = 0.0

        for cart_item in queryset:
            total_shipping += float(cart_item.shipping_amount)
            total_tax += float(cart_item.tax_fee)
            total_service_fee += float(cart_item.service_fee)
            total_sub_total += float(cart_item.sub_total)
            total_total += float(cart_item.total)


        data = {
            'shipping' : total_shipping,
            'tax' : total_tax,
            'service_fee' : total_service_fee,
            'sub_total' : total_sub_total,
            'total' : total_total,
        }

        return Response(data)
    
class CartItemDeleteView(generics.DestroyAPIView):
    serializer_class = CartSerializer
    lookup_field = 'cart_id'

    def get_object(self):
        cart_id = self.kwargs['cart_id']
        item_id = self.kwargs['item_id'] # throws an error if not exist
        user_id = self.kwargs.get('user_id') # returns none if not exist

        if user_id:
            user = User.objects.get(id=user_id)
            cart = Cart.objects.get(id=item_id, cart_id=cart_id, user=user)
        else:
            cart= Cart.objects.get(id=item_id, cart_id=cart_id)

        return cart
    
class CreateOrderView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    queryset = CartOrder.objects.all()
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        payload = request.data

        full_name = payload['full_name']
        email = payload['email']
        mobile = payload['mobile']
        address = payload['address']
        city = payload['city']
        state = payload['state']
        country = payload['country']
        cart_id = payload['cart_id']
        user_id = payload['user_id']

        print("user_id ===============", user_id)

        if user_id != 0:
            user = User.objects.filter(id=user_id).first()
        else:
            user = None

        cart_items = Cart.objects.filter(cart_id=cart_id)

        total_shipping = Decimal(0.0)
        total_tax = Decimal(0.0)
        total_service_fee = Decimal(0.0)
        total_sub_total = Decimal(0.0)
        total_initial_total = Decimal(0.0)
        total_total = Decimal(0.0)


        order = CartOrder.objects.create(
            # sub_total=total_sub_total,
            # shipping_amount=total_shipping,
            # tax_fee=total_tax,
            # service_fee=total_service_fee,
            buyer=user,
            # payment_status="processing",
            full_name=full_name,
            email=email,
            mobile=mobile,
            address=address,
            city=city,
            state=state,
            country=country
        )

        for item in cart_items:
            CartOrderItem.objects.create(
                order=order,
                product=item.product,
                qty=item.qty,
                color=item.color,
                size=item.size,
                price=item.price,
                sub_total=item.sub_total,
                shipping_amount=item.shipping_amount,
                tax_fee=item.tax_fee,
                service_fee=item.service_fee,
                total=item.total,
                initial_total=item.total,
                vendor=item.product.vendor
            )

            total_shipping += Decimal(item.shipping_amount)
            total_tax += Decimal(item.tax_fee)
            total_service_fee += Decimal(item.service_fee)
            total_sub_total += Decimal(item.sub_total)
            total_initial_total += Decimal(item.total)
            total_total += Decimal(item.total)

            order.vendor.add(item.product.vendor)

                

            order.sub_total=total_sub_total
            order.shipping_amount=total_shipping
            order.tax_fee=total_tax
            order.service_fee=total_service_fee
            order.initial_total=total_initial_total
            order.total=total_total

            
            order.save()

        return Response( {"message": "Order Created Successfully", 'order_oid':order.oid}, status=status.HTTP_201_CREATED)

class CheckoutView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializer
    lookup_field = 'order_oid'
    permission_classes=[AllowAny]

    def get_object(self):
        order_oid = self.kwargs['order_oid']
        order = CartOrder.objects.get(oid=order_oid)
        return order
    
class CouponApiView(generics.CreateAPIView):
    serializer_class= CouponSerializer
    queryset = Coupon.objects.all()
    permission_classes=[AllowAny]

    def create(self, request):
        payload = request.data

        order_oid = payload['order_oid']
        coupon_code = payload['coupon_code']

        order= CartOrder.objects.get(oid=order_oid)
        coupon = Coupon.objects.filter(code=coupon_code).first()

        if coupon:
            order_items = CartOrderItem.objects.filter(order=order, vendor=coupon.vendor)
            if order_items:
                for item in order_items:
                    if not coupon in item.coupon.all():
                        discount = item.total * coupon.discount/100

                        item.total -= discount
                        item.sub_total -= discount
                        item.coupon.add(coupon)
                        item.saved += discount

                        order.total -= discount
                        order.sub_total -= discount
                        order.saved += discount

                        item.save()
                        order.save() 

                        return Response({"message": "Coupon Activated", "icon":"success"}, status=status.HTTP_200_OK)
                    else:
                        return Response({"message": "Coupon Already Activated", "icon":"warning"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Coupon Not Applicable to Current Items", "icon":"error"}, status=status.HTTP_200_OK)
       
        else:
            return Response({"message": "Invalid Coupon Code", "icon":"error"}, status=status.HTTP_200_OK)

class StripeCheckoutView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny,]
    queryset = CartOrder.objects.all()

    def create(self,*args, **kwargs):
        order_oid = self.kwargs['order_oid']
        order = CartOrder.objects.get(oid=order_oid)

        if not order:
            return Response({"message":"Order not found"}, status=status.HTTP_404_NOT_FOUND)
        try:      
            checkout_session = stripe.checkout.Session.create(
                customer_email=order.email,
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data':{
                            'currency' : 'usd',
                            'product_data':{
                                'name': order.full_name,
                            },
                            'unit_amount': int(order.total * 100)
                        },
                        'quantity':1,

                    }
                ],
                mode='payment',
                success_url='http://localhost:5173/payment-success/' + order.oid + '?session_id={CHECKOUT_SESSION_ID}',
                cancel_url='http://localhost:5713/payment-failed/?session_id={CHECKOUT_SESSION_ID}',
            )

            order.stripe_session_id = checkout_session.id
            order.save()

            return redirect(checkout_session.url)
        except stripe.error.StripeError as e:
            return Response({"error": f"Something went wrong while creating the checkout session {str(e)}"})

class PaymentSuccessView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny,]
    queryset = CartOrder.objects.all()

    def create(self,request,*args,**kwargs):
        payload = request.data
        order_oid = payload['order_oid']
        session_id = payload['session_id']

        order = CartOrder.objects.get(oid=order_oid)
        order_items = CartOrderItem.objects.filter(order=order)

        if session_id != 'null':
            session= stripe.checkout.Session.retrieve(session_id)

            if session.payment_status == 'paid':
                if order.payment_status == "pending":
                    order.payment_status == "paid"
                    order.save()

                    # Send Notificatons To Customer
                    if order.buyer !=None:
                        send_notification(user=order.buyer,order=order)

                    # Send Email To Customer
                    customer_data = {
                        'order' : order,
                        'order_items': order_items,
                    }
                    subject =  "Order Placed Succuessfully"
                    text_body = render_to_string("email/customer_order_confirmation.txt", customer_data)
                    html_body = render_to_string("email/customer_order_confirmation.html", customer_data)

                    msg = EmailMultiAlternatives(
                        subject=subject,
                        from_email=settings.FROM_EMAIL,
                        to=[order.email],
                        body=text_body
                    )
                    msg.attach_alternative(html_body, "text/html")
                    msg.send()

                    # Send Notificatons To Vendors
                    for item in order_items:
                        send_notification(vendor=item.vendor, order=order, order_item=item)
                    
                        # Send Email To Vendor
                        vendor_data = {
                            'order' : order,
                            'order_items': order_items,
                            'vendor' : item.vendor
                        }
                        subject =  "You've Made a Sale!"
                        text_body = render_to_string("email/vendor_sale.txt", vendor_data)
                        html_body = render_to_string("email/vendor_sale.html", vendor_data)

                        msg = EmailMultiAlternatives(
                            subject=subject,
                            from_email=settings.FROM_EMAIL,
                            to=[order.email],
                            body=text_body
                        )
                        msg.attach_alternative(html_body, "text/html")
                        msg.send()

                    return Response ({"message":"Payment Successful"})
                else:
                    return Response ({"message":"Already Paid"})
            elif session.payment_status == 'unpaid':
                return Response({"message":"Your Invoice is Unpaid"})
            elif session.payment_status == 'cancelled':
                return Response({"message":"Your Invoice is cancelled"})
            else:
                return Response({"message":"An Error has Occured, Please Try Again..."})
        else:
            session = None

class ReviewListAPIView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes=[AllowAny,]

    def get_queryset(self, *args, **kwargs):
        product_id = self.kwargs['product_id']

        product = Product.objects.get(id=product_id)
        reviews = Review.objects.filter(product=product)

        return reviews
    


        