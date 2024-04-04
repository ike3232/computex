from django.contrib import admin
from .models import Cart, CartItem, CustomUser, GraphicsCard, Laptop, Monitor, Processor


admin.site.register(Processor)
admin.site.register(GraphicsCard)
admin.site.register(Cart)
admin.site.register(CartItem)


@admin.register(Laptop)
class LaptopAdmin(admin.ModelAdmin):
    list_display = ["name", "price", "ram", "processor"]


@admin.register(Monitor)
class MonitorAdmin(admin.ModelAdmin):
    list_display = ["name", "price", "screen_size", "resolution"]


# For more advanced configurations or customizations, you can create an admin class:


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "first_name", "last_name")
    search_fields = ("username", "email")
    ordering = ("username",)


admin.site.register(CustomUser, CustomUserAdmin)
