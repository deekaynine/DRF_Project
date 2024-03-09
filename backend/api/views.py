from django.shortcuts import render
from django.http import JsonResponse
from django.forms.models import model_to_dict

from rest_framework.decorators import api_view
from rest_framework.response import Response

from products.models import Product
from products.serializers import ProductSerializer

# Create your views here.

# non DRF way
# def api_home(request, *args, **kwargs):
#     model_data = Product.objects.all().order_by("?").first()
#     data = {}
#     if model_data:
#         data = model_to_dict(model_data, fields=['id','title', 'price'])
#     return JsonResponse(data)

@api_view(['GET'])
def api_home(request, *args, **kwargs):
     product_queryset = Product.objects.all().order_by("?").first()
     data = {}
     if product_queryset:
        # data = model_to_dict(model_data, fields=['id','title', 'price'])
          data = ProductSerializer(product_queryset).data
          print(data)
     return Response(data)

@api_view(['POST'])
def api_create(request, *args, **kwargs):
     serializer = ProductSerializer(data=request.data)
     if serializer.is_valid(raise_exception=True):
         instance = serializer.save()
         print(serializer.data)
         return Response(serializer.data)
    
    