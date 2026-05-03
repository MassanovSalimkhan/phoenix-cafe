from rest_framework import serializers
from .models import Zone, Table, Reservation

class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = ('id', 'name', 'description')

class TableSerializer(serializers.ModelSerializer):
    zone_name = serializers.ReadOnlyField(source='zone.name')
    class Meta:
        model = Table
        fields = ('id', 'zone', 'zone_name', 'number', 'capacity', 'is_active')

class ReservationSerializer(serializers.ModelSerializer):
    table_number = serializers.ReadOnlyField(source='table.number')
    zone_name = serializers.ReadOnlyField(source='table.zone.name')
    class Meta:
        model = Reservation
        fields = ('id', 'user', 'table', 'table_number', 'zone_name', 'date', 'start_time', 'end_time', 'guests', 'status', 'comment')
        read_only_fields = ('id', 'user')