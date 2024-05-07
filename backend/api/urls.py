from django.urls import path

from users import views as user_views
from store import views as store_views

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [   
    path('user/token/', user_views.MyTokenObtainPairView.as_view()),
    path('user/token/refresh/', TokenRefreshView.as_view()),
    path('user/register/', user_views.RegisterView.as_view()),
    path('user/password-reset/<email>/', user_views.PasswordResetView.as_view()),
    path('user/password-change/', user_views.PasswordChangeView.as_view()),
    # Store Endpoints

    path('category/', store_views.CategoryListAPIView.as_view() ),
    path('products/', store_views.ProductListAPIView.as_view()),
    path('product/<slug>/', store_views.ProductDetailAPIView.as_view()),
    path('cart/', store_views.CartApiView.as_view()),
    path('cart-list/<str:cart_id>/<int:user_id>/', store_views.CartListView.as_view()),
    path('cart-list/<str:cart_id>/', store_views.CartListView.as_view()),

]
