from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    dish_name = serializers.ReadOnlyField(source='dish.name')
    class Meta:
        model = OrderItem
        fields = ('id', 'dish', 'dish_name', 'quantity', 'price_at_time')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ('id', 'user', 'created_at', 'total_amount', 'status', 'delivery_type', 'delivery_address', 'comment', 'items', 'user_order_number')
        read_only_fields = ('id', 'user', 'created_at', 'total_amount', 'delivery_type', 'delivery_address', 'comment', 'items')