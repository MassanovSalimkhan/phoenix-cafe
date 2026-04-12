from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q
from .models import Zone, Table, Reservation
from .serializers import ZoneSerializer, TableSerializer, ReservationSerializer

class ZoneListView(generics.ListAPIView):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer
    permission_classes = [permissions.AllowAny]

class TableListView(generics.ListAPIView):
    serializer_class = TableSerializer
    permission_classes = [permissions.AllowAny]
    def get_queryset(self):
        zone_id = self.request.query_params.get('zone_id')
        if zone_id:
            return Table.objects.filter(zone_id=zone_id, is_active=True)
        return Table.objects.filter(is_active=True)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def check_availability(request):
    table_id = request.query_params.get('table_id')
    date = request.query_params.get('date')
    start_time = request.query_params.get('start_time')
    if not all([table_id, date, start_time]):
        return Response({'error': 'Не хватает параметров'}, status=400)
    # Проверяем пересечение бронирований (длительность 2 часа)
    from datetime import datetime, timedelta
    start = datetime.strptime(start_time, '%H:%M')
    end = start + timedelta(hours=2)
    end_time = end.strftime('%H:%M')
    overlapping = Reservation.objects.filter(
        table_id=table_id,
        date=date,
        status__in=['New', 'Confirmed'],
        start_time__lt=end_time,
        end_time__gt=start_time
    ).exists()
    return Response({'available': not overlapping})

class ReservationListCreateView(generics.ListCreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.role in ['manager', 'admin']:
            return Reservation.objects.all().order_by('-date', '-start_time')
        return Reservation.objects.filter(user=user).order_by('-date', '-start_time')
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReservationDetailView(generics.RetrieveUpdateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.role in ['manager', 'admin']:
            return Reservation.objects.all()
        return Reservation.objects.filter(user=user)