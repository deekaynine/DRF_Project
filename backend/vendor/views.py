# Django Packages
import datetime
from django.shortcuts import get_object_or_404, redirect, render
from django.http import JsonResponse, HttpResponseNotFound, HttpResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.db import models
from django.db import transaction
from django.urls import reverse
from django.conf import settings
from django.db.models.functions import ExtractMonth
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string

# Restframework Packages
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

# Serializers
from users.serializers import MyTokenObtainPairSerializer, ProfileSerializer, RegisterSerializer
from store.serializers import  NotificationSerializer, SummarySerializer, OrderItemSerializer, EarningSummarySerializer,  ProductSerializer,  CategorySerializer, OrderSerializer, GallerySerializer,  ProductFaqSerializer, ReviewSerializer,  SpecificationSerializer, CouponSerializer, ColorSerializer, SizeSerializer, WishlistSerializer, VendorSerializer,CouponSummarySerializer

# Models
from users.models import Profile, User
from store.models import  Notification, OrderItem,  Product,  Category , Order, Gallery,  ProductFaq, Review,  Specification, Coupon, Color, Size, Wishlist
from vendor.models import Vendor

class DashboardStatsAPIView(generics.ListAPIView):
    serializer_class = SummarySerializer

    def get_queryset(self):

        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        # Calculate summary values
        product_count = Product.objects.filter(vendor=vendor).count()
        order_count = Order.objects.filter(
            vendor=vendor, payment_status="paid").count()
        revenue = OrderItem.objects.filter(vendor=vendor, order__payment_status="paid").aggregate(
            total_revenue=models.Sum(models.F('sub_total') + models.F('shipping_amount')))['total_revenue'] or 0

        # Return a dummy list as we only need one summary object
        return [{
            'products': product_count,
            'orders': order_count,
            'revenue': revenue
        }]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

@api_view(['GET',])
def MonthlyOrderCartAPIView(request, vendor_id):
    vendor = Vendor.objects.get(id=vendor_id)
    orders = Order.objects.filter(vendor=vendor, payment_status="paid")
    orders_by_month = orders.annotate(month=ExtractMonth("date")).values("month").annotate(orders=models.Count("id")).order_by("month")
    return Response(orders_by_month)

@api_view(['GET',])
def MonthlyProductChartAPIView(request, vendor_id):
    vendor = Vendor.objects.get(id=vendor_id)
    products = Product.objects.filter(vendor=vendor)
    products_by_month = products.annotate(month=ExtractMonth("date")).values("month").annotate(products=models.Count("id")).order_by("month")
    return Response(products_by_month)

class ProductsAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        products = Product.objects.filter(vendor=vendor)
        return products


class OrdersAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        orders = Order.objects.filter(vendor=vendor, payment_status="paid")
        return orders
    
class OrderDetailAPIView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        order_oid = self.kwargs['order_oid']

        vendor = Vendor.objects.get(id=vendor_id)
        order = Order.objects.get(
            vendor=vendor, payment_status="paid", oid=order_oid)
        return order


class RevenueAPIView(generics.ListAPIView):
    serializer_class = OrderItemSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        revenue = OrderItem.objects.filter(vendor=vendor, order__payment_status="paid").aggregate(
            total_revenue=models.Sum(models.F('sub_total') + models.F('shipping_amount')))['total_revenue'] or 0
        return revenue
    
class FilterProductsAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        filter = self.request.GET.get('filter')

        print("filter =======", filter)

        vendor = Vendor.objects.get(id=vendor_id)
        if filter == "published":
            products = Product.objects.filter(
                vendor=vendor, status="published")
        elif filter == "draft":
            products = Product.objects.filter(vendor=vendor, status="draft")
        elif filter == "disabled":
            products = Product.objects.filter(vendor=vendor, status="disabled")
        elif filter == "in-review":
            products = Product.objects.filter(
                vendor=vendor, status="in-review")
        elif filter == "latest":
            products = Product.objects.filter(vendor=vendor).order_by('-id')
        elif filter == "oldest":
            products = Product.objects.filter(vendor=vendor).order_by('id')
        else:
            products = Product.objects.filter(vendor=vendor)
        return products
    
class Earning(generics.ListAPIView):
    serializer_class = EarningSummarySerializer

    def get_queryset(self):

        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        one_month_ago = datetime.today() - datetime.timedelta(days=28)
        monthly_revenue = OrderItem.objects.filter(vendor=vendor, order__payment_status="paid", date__gte=one_month_ago).aggregate(
            total_revenue=models.Sum(models.F('sub_total') + models.F('shipping_amount')))['total_revenue'] or 0
        total_revenue = OrderItem.objects.filter(vendor=vendor, order__payment_status="paid").aggregate(
            total_revenue=models.Sum(models.F('sub_total') + models.F('shipping_amount')))['total_revenue'] or 0

        return [{
            'monthly_revenue': monthly_revenue,
            'total_revenue': total_revenue,
        }]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
@api_view(('GET',))
def MonthlyEarningTracker(request, vendor_id):
    vendor = Vendor.objects.get(id=vendor_id)
    monthly_earning_tracker = (
        OrderItem.objects
        .filter(vendor=vendor, order__payment_status="paid")
        .annotate(
            month=ExtractMonth("date")
        )
        .values("month")
        .annotate(
            sales_count=models.Sum("qty"),
            total_earning=models.Sum(
                models.F('sub_total') + models.F('shipping_amount'))
        )
        .order_by("-month")
    )
    return Response(monthly_earning_tracker)

class ReviewsListAPIView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        reviews = Review.objects.filter(product__vendor=vendor)
        return reviews
    
class ReviewsDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        review_id = self.kwargs['review_id']

        vendor = Vendor.objects.get(id=vendor_id)
        review = Review.objects.get(product__vendor=vendor, id=review_id)
        
        return review
    
class CouponListAPIView(generics.ListCreateAPIView):
    serializer_class = CouponSerializer
    queryset = Coupon.objects.all()
    permission_classes = (AllowAny, )

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        coupon = Coupon.objects.filter(vendor=vendor)
        return coupon

    def create(self, request, *args, **kwargs):
        payload = request.data

        vendor_id = payload['vendor_id']
        code = payload['code']
        discount = payload['discount']
        active = payload['active']

        print("vendor_id ======", vendor_id)
        print("code ======", code)
        print("discount ======", discount)
        print("active ======", active)

        vendor = Vendor.objects.get(id=vendor_id)
        Coupon.objects.create(
            vendor=vendor,
            code=code,
            discount=discount,
            active=(active.lower() == "true")
        )

        return Response({"message": "Coupon Created Successfully."}, status=status.HTTP_201_CREATED)


class CouponDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CouponSerializer
    permission_classes = (AllowAny, )

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        coupon_id = self.kwargs['coupon_id']

        vendor = Vendor.objects.get(id=vendor_id)

        coupon = Coupon.objects.get(vendor=vendor, id=coupon_id)
        return coupon


class CouponStatsAPIView(generics.ListAPIView):
    serializer_class = CouponSummarySerializer
    permission_classes = [AllowAny,]

    def get_queryset(self):

        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        total_coupons = Coupon.objects.filter(vendor=vendor).count()
        active_coupons = Coupon.objects.filter(
            vendor=vendor, active=True).count()

        return [{
            'total_coupons': total_coupons,
            'active_coupons': active_coupons,
        }]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)