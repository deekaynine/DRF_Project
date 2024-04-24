from django.shortcuts import render

from store.models import Product, Category
from store.serializers import ProductFaqSerializer, CategorySerializer

from rest_framework import generics

# Create your views here.

class CategoryListAPIView(generics.ListAPIView):
    