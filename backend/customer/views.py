from django.shortcuts import render
from django.shortcuts import render, redirect
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from store.models import Category, Product, Gallery, Color, Specification, CartItem, Order, OrderItem,ProductFaq, Wishlist, Notification, Coupon, Size, Review, Tax
from users.models import User

from store.serializers import ProductSerializer, CategorySerializer, CartItemSerializer, OrderSerializer, OrderItemSerializer, CouponSerializer, ReviewSerializer, WishlistSerializer, NotificationSerializer
from store.pagination import ProductPagination, ReviewPagination

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from decimal import Decimal
import stripe
import requests

# Create your views here.

class OrdersApiView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)

        orders = Order.objects.filter(buyer=user)

        return orders
    
class OrderDetailApiView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        user_id = self.kwargs['user_id']
        order_oid = self.kwargs['order_oid']

        user = User.objects.get(id=user_id)

        order = Order.objects.get(buyer=user, oid=order_oid)

        return order
    
class WishlistAPIView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        user = User.objects.get(id=user_id)
        wishlists = Wishlist.objects.filter(user=user)

        return wishlists
    
    def create(self,request):
        payload = request.data 

        product_id = payload['product_id']
        user_id = payload['user_id']

        product = Product.objects.get(id=product_id)
        user = User.objects.get(id=user_id)

        wishlist = Wishlist.objects.filter(product=product, user=user)
        if wishlist:
            wishlist.delete()
            return Response({"message":"Item Removed From Wishlist"}, status=status.HTTP_200_OK)
        else:
            Wishlist.objects.create(product=product, user=user)
            return Response({"message":"Item Successfully Added to Wishlist"}, status=status.HTTP_201_CREATED)

class CustomerNotificationView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = (AllowAny, )

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        return Notification.objects.filter(user=user)

class MarkNotificationAsSeenView(generics.RetrieveAPIView):
    serializer_class = NotificationSerializer
    permission_classes = (AllowAny, )

    def get_object(self):
        user_id = self.kwargs['user_id']
        notif_id = self.kwargs['notif_id']

        user = User.objects.get(id=user_id)
        notif = Notification.objects.get(id=notif_id)

        if notif.seen != True:
            notif.seen =True
            notif.save()
            return notif

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        return Notification.objects.filter(user=user)

# class CustomerUpdateView(generics.RetrieveUpdateAPIView):
#     queryset = Profile.objects.all()
#     serializer_class = ProfileSerializer
#     permission_classes = (AllowAny, )