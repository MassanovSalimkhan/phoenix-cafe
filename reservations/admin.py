from django.contrib import admin
from .models import Zone, Table, Reservation

admin.site.register(Zone)
admin.site.register(Table)
admin.site.register(Reservation)