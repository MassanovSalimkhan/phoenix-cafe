from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('phone', 'full_name', 'role', 'date_joined', 'is_active')
    list_filter = ('role', 'is_active')
    search_fields = ('phone', 'full_name')
    ordering = ('-date_joined',)