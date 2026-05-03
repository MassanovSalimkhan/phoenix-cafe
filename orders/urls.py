from django.urls import path
from .views import OrderListCreateView, OrderDetailView, popular_dishes, hall_load

urlpatterns = [
    path('', OrderListCreateView.as_view(), name='orders'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('reports/popular-dishes/', popular_dishes, name='popular-dishes'),
    path('reports/hall-load/', hall_load, name='hall-load'),
]