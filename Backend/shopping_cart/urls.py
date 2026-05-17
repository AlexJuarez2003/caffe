from django.urls import path
from .views import (
    ShoppingCartAPIView,
    ShoppingCartItemCreateAPIView,
    ShoppingCartItemUpdateAPIView,
    ShoppingCartItemDestroyAPIView
)

urlpatterns = [
    path('my-cart/', ShoppingCartAPIView.as_view()),
    path('my-cart/items/', ShoppingCartItemCreateAPIView.as_view()),
    path('my-cart/items/<int:pk>/', ShoppingCartItemUpdateAPIView.as_view()),
    path('my-cart/items/<int:pk>/delete/', ShoppingCartItemDestroyAPIView.as_view()),
]