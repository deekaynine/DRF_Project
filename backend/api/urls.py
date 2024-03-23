from django.urls import path

from users import views as user_views
from store import views as store_views


urlpatterns = [   
    path('user/token/', user_views.MyTokenObtainPairView.as_view()),
    path('user/register/', user_views.RegisterView.as_view())
]
