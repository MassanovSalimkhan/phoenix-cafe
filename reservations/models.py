from django.db import models
from users.models import User

class Zone(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    def __str__(self):
        return self.name

class Table(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name='tables')
    number = models.CharField(max_length=10)
    capacity = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    def __str__(self):
        return f"{self.zone.name} - Стол {self.number}"

class Reservation(models.Model):
    STATUS_CHOICES = (
        ('New', 'Новая'),
        ('Confirmed', 'Подтверждена'),
        ('Canceled', 'Отменена'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    table = models.ForeignKey(Table, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    guests = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New')
    comment = models.TextField(blank=True)
    def __str__(self):
        return f"{self.user.phone} - {self.table} - {self.date}"