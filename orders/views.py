from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer
from menu.models import Dish

class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['manager', 'admin']:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        items_data = request.data.get('items', [])
        delivery_type = request.data.get('delivery_type')
        delivery_address = request.data.get('delivery_address', '')
        comment = request.data.get('comment', '')

        if not items_data:
            return Response({'error': 'Корзина пуста'}, status=status.HTTP_400_BAD_REQUEST)

        total = 0
        order_items = []
        for item in items_data:
            try:
                dish = Dish.objects.get(id=item['id'], is_available=True)
            except Dish.DoesNotExist:
                return Response({'error': f'Блюдо id={item["id"]} не найдено'}, status=status.HTTP_400_BAD_REQUEST)
            quantity = item['quantity']
            price = dish.price
            total += price * quantity
            order_items.append({'dish': dish, 'quantity': quantity, 'price_at_time': price})

        order = Order.objects.create(
            user=request.user,
            total_amount=total,
            delivery_type=delivery_type,
            delivery_address=delivery_address,
            comment=comment,
            status='New'
        )
        for oi in order_items:
            OrderItem.objects.create(
                order=order,
                dish=oi['dish'],
                quantity=oi['quantity'],
                price_at_time=oi['price_at_time']
            )
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

class OrderDetailView(generics.RetrieveUpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['manager', 'admin']:
            return Order.objects.all()
        return Order.objects.filter(user=user)