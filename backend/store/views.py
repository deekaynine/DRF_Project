from django.shortcuts import render

from store.models import Category, Product, Gallery, Color, Specification, Cart, CartOrder, CartOrderItem,ProductFaq, Wishlist, Notification, Coupon, Size, Review, Tax
from users.models import User

from store.serializers import ProductSerializer, CategorySerializer, CartSerializer, CartOrderSerializer, CartOrderItemSerializer

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from decimal import Decimal

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

        cart = Cart.objects.filter(cart_id = cart_id).first()
        
        if cart:
            cart.product = product
            cart.user = user
            cart.qty = qty
            cart.price = price 
            cart.sub_total = Decimal(price) * int(qty)
            cart.shipping_amount = Decimal(shipping_amount) * int(qty)
            cart.tax_fee = int(qty) * Decimal(tax_rate)
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
            cart.tax_fee = int(qty) * Decimal(tax_rate)
            cart.color = color
            cart.size = size
            cart.country = country
            cart.cart_id = cart_id

            service_fee_percentage = 10 / 100
            cart.service_fee = Decimal(service_fee_percentage) * cart.sub_total

            cart.total = cart.sub_total + cart.shipping_amount + cart.service_fee + cart.tax_fee
            cart.save() 

            return Response({'message' : 'Cart Created Successfully'}, status=status.HTTP_201_CREATED)
        
class CartListView(generics.ListAPIView):
    serializer_class = CartSerializer
    queryset = Cart.objects.all()
    permission_classes = [AllowAny,]

    # Get single cart based on id
    def get_queryset(self):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs['user_id']

        if user_id is not None:
            user = User.objects.filter(id=user_id)
            queryset = Cart.objects.filter(user=user, cart_id=cart_id)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)

    