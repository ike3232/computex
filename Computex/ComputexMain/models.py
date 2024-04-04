from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext as _
from polymorphic.models import PolymorphicModel
from rest_framework.permissions import IsAuthenticated


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    delivery_address = models.TextField()
    payment_details = models.TextField()

    groups = models.ManyToManyField(
        "auth.Group",
        verbose_name=_("groups"),
        blank=True,
        related_name="customuser_set",
        related_query_name="user",
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        verbose_name=_("user permissions"),
        blank=True,
        related_name="customuser_set",
        related_query_name="user",
    )


class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=0)  # ilość dostępnych sztuk
    is_on_sale = models.BooleanField(default=False)  # czy jest na promocji

    class Meta:
        abstract = True


class Laptop(Product):
    type = models.CharField(max_length=50, default="laptop")
    ram = models.CharField(max_length=50, default="8GB")
    processor = models.CharField(max_length=100, default="Intel Core i5")
    storage = models.CharField(max_length=50, default="256GB SSD")  # przestrzeń dyskowa
    graphics_card = models.CharField(
        max_length=100, default="Integrated Graphics"
    )  # karta graficzna
    screen_resolution = models.CharField(
        max_length=50, default="1920x1080"
    )  # rozdzielczość ekranu
    operating_system = models.CharField(
        max_length=50, default="Windows 10"
    )  # system operacyjny


class Monitor(Product):
    type = models.CharField(max_length=50, default="monitor")
    screen_size = models.DecimalField(
        max_digits=4, decimal_places=2, default=24.0
    )  # rozmiar ekranu w calach
    resolution = models.CharField(max_length=50, default="1920x1080")
    panel_type = models.CharField(
        max_length=50, default="IPS"
    )  # rodzaj panelu (np. IPS, TN, OLED)
    refresh_rate = models.PositiveIntegerField(
        default=60
    )  # częstotliwość odświeżania w Hz


class GraphicsCard(Product):
    type = models.CharField(max_length=50, default="graphicscard")
    memory = models.CharField(max_length=50, default="4GB GDDR6")
    chipset = models.CharField(max_length=100, default="NVIDIA GeForce GTX 1650")
    interface = models.CharField(max_length=50, default="PCI Express 3.0 x16")


class Processor(Product):
    type = models.CharField(max_length=50, default="processor")
    cores = models.PositiveIntegerField(default=4)
    threads = models.PositiveIntegerField(default=8)
    base_frequency = models.DecimalField(
        max_digits=4, decimal_places=2, default=3.6
    )  # w GHz
    boost_frequency = models.DecimalField(
        max_digits=4, decimal_places=2, default=4.2
    )  # w GHz
    socket = models.CharField(max_length=50, default="LGA1151")


class Cart(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name="cart"
    )
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def update_total_price(self):
        self.total_price = sum(item.total_item_price for item in self.cart_items.all())
        self.save()


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="cart_items")
    product_name = models.CharField(max_length=255)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    @property
    def total_item_price(self):
        return self.product_price * self.quantity
