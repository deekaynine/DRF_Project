from django.shortcuts import render

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from users.models import User, Profile
from users.serializers import MyTokenObtainPairSerializer, RegisterSerializer, UserSerializer

import shortuuid

def generate_otp():
    uuid_key = shortuuid.uuid()
    unique_key = uuid_key[:6]
    return unique_key

# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class= MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = ([AllowAny])
    serializer_class = RegisterSerializer

class PasswordRestView(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def get_object(self):
        email = self.kwargs['email']
        user = User.objects.get(email=email)

        print(user)

        if user:
            user.otp =  generate_otp()
            user.save()

        uidb64 = user.pk
        otp = user.otp

        link = f"http://localhost:5173/create-new-password?otp={otp}&uidb64={uidb64}"

        # Send Email

        return user