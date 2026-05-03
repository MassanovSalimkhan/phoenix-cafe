from django.db import models
from users.models import User
from menu.models import Dish

class Order(models.Model):
    STATUS_CHOICES = (
        ('New', 'Новый'),
        ('Preparing', 'Готовится'),
        ('Ready', 'Готов'),
        ('Delivered', 'Доставлен'),
        ('Canceled', 'Отменён'),
    )
    DELIVERY_CHOICES = (
        ('Delivery', 'Доставка'),
        ('Pickup', 'Самовывоз'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New')
    delivery_type = models.CharField(max_length=20, choices=DELIVERY_CHOICES)
    delivery_address = models.TextField(blank=True)
    comment = models.TextField(blank=True)
    user_order_number = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Order {self.id} by {self.user.phone}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_at_time = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.dish.name}"