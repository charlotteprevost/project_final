from django.contrib import admin

# Register your models here.

from .models import Event, ShowDownUser

admin.site.register(Event)
admin.site.register(ShowDownUser)