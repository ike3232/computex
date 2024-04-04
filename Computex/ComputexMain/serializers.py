from email.headerregistry import ContentTypeHeader
from rest_framework import serializers
from .models import (
    Cart,
    CartItem,
    CustomUser,
    GraphicsCard,
    Laptop,
    Monitor,
    Processor,
    Product,
)
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password
from django.contrib.contenttypes.models import ContentType


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True
    )  # Field for password, which will be write-only

    class Meta:
        model = CustomUser
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "delivery_address",
            "payment_details",
            "password",  # Including the password field
        )

    # Note: You don't necessarily need the validate_password function unless you want to add extra validation logic.
    # The set_password method will handle the hashing for you.

    def create(self, validated_data):
        # Pop the password from the validated data
        password = validated_data.pop("password")

        # Create the user instance
        user = super(UserSerializer, self).create(validated_data)

        # Set the password for the user instance
        user.set_password(password)
        user.save()

        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Dodaj niestandardowe pola do tokena
        token["username"] = user.username

        return token

    def validate(self, attrs):
        try:
            data = super(MyTokenObtainPairSerializer, self).validate(attrs)

            print(data)
        except Exception as e:
            print("Error during authentication:", str(e))
            raise e

        data["user"] = self.user
        return data


class LaptopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Laptop
        fields = "__all__"


class MonitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Monitor
        fields = "__all__"


class GraphicsCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = GraphicsCard
        fields = "__all__"


class ProcessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Processor
        fields = "__all__"


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = "__all__"


class CartSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = "__all__"
