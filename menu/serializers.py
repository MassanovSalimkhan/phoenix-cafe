from rest_framework import serializers
from .models import Category, Dish

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'description', 'sort_order')

class DishSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    class Meta:
        model = Dish
        fields = ('id', 'category', 'category_name', 'name', 'description', 'price', 'weight', 'image_url', 'is_available')