from django.shortcuts import render

from rest_framework import generics, mixins, permissions, authentication

from .models import Product
from .serializers import ProductSerializer

from api.authentication import TokenAuthenticatoin

# Create your views here.

class ProductDetailAPIView(generics.RetrieveAPIView):
    queryset= Product.objects.all()
    serializer_class = ProductSerializer
    #lookup_field = 'pk'

class ProductUpdateAPIView(generics.UpdateAPIView):
    queryset= Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'pk'

    def perform_update(self,serializer):
        instance = serializer.save()
        if not instance.content:
            instance.content = instance.title

class ProductDestroyAPIView(generics.DestroyAPIView):
    queryset= Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        super().perform_destroy(instance)


class ProductListCreateAPIView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes=[authentication.SessionAuthentication, TokenAuthenticatoin]
    permission_classes=[permissions.IsAdminUser, permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # serializer.save(user=self.request.user)
        print(serializer.validated_data)
        title = serializer.validated_data.get('title') 
        content = serializer.validated_data.get('content') or None
        if content is None:
            content=title
        serializer.save(content=content)

class ProductCreateAPIView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        # serializer.save(user=self.request.user)
        print(serializer.validated_data)
        title = serializer.validated_data.get('title') 
        content = serializer.validated_data.get('content') or None
        if content is None:
            content=title
        serializer.save(content=content)

