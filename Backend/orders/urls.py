from django.urls import path
from .views import (
    OrderFromCartView,
    OrderFromMenuView,
    OrderListView,
    OrderListByRoleView,
    OrderDetailView,
    OrderStatusUpdateView,
)

urlpatterns = [
    path('orders/', OrderListView.as_view(), name='order-list'),
    path("orders/by-role/", OrderListByRoleView.as_view(), name="order-list-by-role"),
    path('orders/from-cart/', OrderFromCartView.as_view(), name='order-from-cart'),
    path('orders/from-menu/', OrderFromMenuView.as_view(), name='order-from-menu'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('orders/<int:pk>/status/', OrderStatusUpdateView.as_view(), name='order-status-update'),
]