from django.urls import path

from users import views as user_views
from store import views as store_views
from customer import views as customer_views
from vendor import views as vendor_views

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [   
    path('user/token/', user_views.MyTokenObtainPairView.as_view()),
    path('user/token/refresh/', TokenRefreshView.as_view()),
    path('user/register/', user_views.RegisterView.as_view()),
    path('user/password-reset/<email>/', user_views.PasswordResetView.as_view()),
    path('user/password-change/', user_views.PasswordChangeView.as_view()),
    path('user/profile/<user_id>/', user_views.UserProfileView.as_view()),
    
    # Store Endpoints
    path('category/', store_views.CategoryListAPIView.as_view() ),
    path('products/', store_views.ProductListAPIView.as_view()),
    path('product/<slug>/', store_views.ProductDetailAPIView.as_view()),
    path('cart/', store_views.CartApiView.as_view()),
    path('cart-list/<str:cart_id>/<int:user_id>/', store_views.CartListView.as_view()),
    path('cart-list/<str:cart_id>/', store_views.CartListView.as_view()),
    path('cart-details/<str:cart_id>/', store_views.CartDetailView.as_view()),
    path('cart-details/<str:cart_id>/<int:user_id>/', store_views.CartDetailView.as_view()),
    path('cart-delete/<str:cart_id>/<int:item_id>/<int:user_id>/',store_views.CartItemDeleteView.as_view()),
    path('cart-delete/<str:cart_id>/<int:item_id>/',store_views.CartItemDeleteView.as_view()),
    path('create-order/',store_views.CreateOrderView.as_view()),
    path('checkout/<order_oid>/',store_views.CheckoutView.as_view()),
    path('coupon/',store_views.CouponApiView.as_view()),
    path('reviews/<product_id>/',store_views.ReviewListAPIView.as_view()),
    path('search/', store_views.SearchProductApiView.as_view()),

    # Payment Endpoints
    path('stripe-checkout/<order_oid>/',store_views.StripeCheckoutView.as_view()),
    path('payment-success/',store_views.PaymentSuccessView.as_view()),

    # Customer Endpoints
    path('customer/orders/<user_id>/',customer_views.OrdersApiView.as_view()),
    path('customer/orders/<user_id>/<order_oid>/',customer_views.OrderDetailApiView.as_view()),
    path('customer/wishlist/<user_id>/',customer_views.WishlistAPIView.as_view()),
    path('customer/notifications/<user_id>/',customer_views.CustomerNotificationView.as_view()),
    path('customer/notifications/<user_id>/<notif_id>',customer_views.MarkNotificationAsSeenView.as_view()),

    # Customer Endpoints
    path('vendor/stats/<vendor_id>/',vendor_views.DashboardStatsAPIView.as_view()),
    path('vendor-orders-chart/<vendor_id>/',vendor_views.MonthlyOrderCartAPIView),
    path('vendor-products-chart/<vendor_id>/',vendor_views.MonthlyProductChartAPIView),
    path('vendor/products/<vendor_id>/',vendor_views.ProductsAPIView.as_view()),
    path('vendor/orders/<vendor_id>/',vendor_views.OrdersAPIView.as_view()),
    path('vendor/orders/<vendor_id>/<order_oid>/',vendor_views.OrderDetailAPIView.as_view()),
    path('vendor/revenue/<vendor_id>/',vendor_views.RevenueAPIView.as_view()),
    path('vendor/product-filter/<vendor_id>/', vendor_views.FilterProductsAPIView().as_view()),
    path('vendor-monthly-earning/<vendor_id>/', vendor_views.MonthlyEarningTracker, name='vendor-product-filter'),
    path('vendor-reviews/<vendor_id>/', vendor_views.ReviewsListAPIView.as_view(), name='vendor-reviews'),
    path('vendor-reviews/<vendor_id>/<review_id>/', vendor_views.ReviewsDetailAPIView.as_view(), name='vendor-review-detail'),
    path('vendor-coupon-list/<vendor_id>/', vendor_views.CouponListAPIView.as_view(), name='vendor-coupon-list'),
    path('vendor-coupon-stats/<vendor_id>/', vendor_views.CouponStatsAPIView.as_view(), name='vendor-coupon-stats'),
    path('vendor-coupon-detail/<vendor_id>/<coupon_id>/', vendor_views.CouponDetailAPIView.as_view(), name='vendor-coupon-detail'),

]
