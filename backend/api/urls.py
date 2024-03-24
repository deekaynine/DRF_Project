from django.urls import path

from users import views as user_views
from store import views as store_views

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [   
    path('user/token/', user_views.MyTokenObtainPairView.as_view()),
    path('user/token/refresh/', TokenRefreshView.as_view()),
    path('user/register/', user_views.RegisterView.as_view()),
    path('user/password-reset/<email>/', user_views.PasswordRestView.as_view())
]
