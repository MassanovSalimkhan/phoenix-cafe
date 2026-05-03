from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count, Sum
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
from .serializers import OrderSerializer
from menu.models import Dish
from reservations.models import Reservation
from datetime import datetime

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

        last_order = Order.objects.filter(user=request.user).order_by('-user_order_number').first()
        next_number = (last_order.user_order_number + 1) if last_order else 1

        order = Order.objects.create(
            user=request.user,
            total_amount=total,
            delivery_type=delivery_type,
            delivery_address=delivery_address,
            comment=comment,
            user_order_number=next_number,
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

    def update(self, request, *args, **kwargs):
        order = self.get_object()
        if request.data.get('status') == 'Canceled':
            time_limit = order.created_at + timedelta(minutes=5)
            if timezone.now() > time_limit:
                return Response(
                    {'error': 'Отмена заказа доступна только в течение 5 минут после оформления'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return super().update(request, *args, **kwargs)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def popular_dishes(request):
    days = request.query_params.get('days', 30)
    start_date = datetime.now() - timedelta(days=int(days))
    popular = OrderItem.objects.filter(
        order__created_at__gte=start_date
    ).values('dish__name', 'dish_id').annotate(
        total_quantity=Sum('quantity')
    ).order_by('-total_quantity')[:10]
    return Response(list(popular))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def hall_load(request):
    days = request.query_params.get('days', 7)
    start_date = datetime.now() - timedelta(days=int(days))
    data = Reservation.objects.filter(
        date__gte=start_date.date(),
        status__in=['New', 'Confirmed']
    ).values('table__zone__name').annotate(
        count=Count('id')
    ).order_by('-count')
    return Response(list(data))