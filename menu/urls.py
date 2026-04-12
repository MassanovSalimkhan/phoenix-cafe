from django.urls import path
from .views import CategoryListView, DishListView, DishDetailView

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('dishes/', DishListView.as_view(), name='dishes'),
    path('dishes/<int:pk>/', DishDetailView.as_view(), name='dish-detail'),
]