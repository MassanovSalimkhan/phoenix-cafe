from django.urls import path
from .views import ZoneListView, TableListView, check_availability, ReservationListCreateView, ReservationDetailView

urlpatterns = [
    path('zones/', ZoneListView.as_view(), name='zones'),
    path('tables/', TableListView.as_view(), name='tables'),
    path('availability/', check_availability, name='availability'),
    path('reservations/', ReservationListCreateView.as_view(), name='reservations'),
    path('reservations/<int:pk>/', ReservationDetailView.as_view(), name='reservation-detail'),
]