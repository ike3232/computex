from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

# Utwórz router i zarejestruj  widok
router = DefaultRouter()

router.register(r"users", views.UserViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("token/", views.MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("user/create/", views.CustomUserCreate.as_view(), name="create_user"),
    path("user/login/", views.CustomUserLogin.as_view(), name="user_login"),
    path("products/", views.ProductView.as_view(), name="product-list"),
    path("cart/", views.CartAPIView.as_view(), name="cart"),
    path("cart/add-quantity/<int:item_id>/", views.add_quantity, name="add-quantity"),
    path(
        "cart/subtract-quantity/<int:item_id>/",
        views.subtract_quantity,
        name="subtract-quantity",
    ),
    path("cart/remove-item/<int:item_id>/", views.remove_item, name="remove-item"),
    path("cart/buy/", views.buy, name="buy"),
]
