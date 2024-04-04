from django import apps
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from itertools import chain
import random
from .models import Cart, CartItem, GraphicsCard, Laptop, Monitor, Processor, Product
from .serializers import (
    CartItemSerializer,
    CartSerializer,
    GraphicsCardSerializer,
    LaptopSerializer,
    MonitorSerializer,
    MyTokenObtainPairSerializer,
    ProcessorSerializer,
    UserSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.contenttypes.models import ContentType


class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class CustomUserCreate(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format="json"):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                refresh = RefreshToken.for_user(user)
                json["refresh"] = str(refresh)
                json["access"] = str(refresh.access_token)

                return Response(json, status=status.HTTP_201_CREATED)
        print(serializer.errors)  # Dodajemy tę linię, aby wydrukować błędy walidacji
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomUserLogin(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = MyTokenObtainPairSerializer(data=request.data)

        # Explicitly call is_valid to get a boolean response
        if not serializer.is_valid():
            print("Serializer is not valid:", serializer.errors)
            raise AuthenticationFailed(detail=serializer.errors)

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "username": user.username,
                "email": user.email,
            },
            status=status.HTTP_200_OK,
        )


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class ProductView(APIView):
    # Mapowanie modeli do ich serializatorów
    serializers_map = {
        "laptop": LaptopSerializer,
        "monitor": MonitorSerializer,
        "graphicscard": GraphicsCardSerializer,
        "processor": ProcessorSerializer,
    }

    def get(self, request):
        product_type = request.query_params.get("type", None)

        if product_type:
            # Uzyskanie klasy modelu na podstawie nazwy
            try:
                model_class = apps.get_model("ComputexMain", product_type)
                serializer_class = self.serializers_map.get(product_type)

                if not serializer_class:
                    raise ValueError(
                        "No serializer found for the provided product type"
                    )

                products = model_class.objects.all()
                serializer = serializer_class(products, many=True)
                return Response(serializer.data)

            except LookupError:
                return Response(
                    {"error": f"No product type found for {product_type}"}, status=400
                )

        else:
            # Jeśli typ produktu nie został podany, zwróć mieszane produkty (jak w Twoim pierwotnym kodzie)
            all_products = [
                model.objects.all()
                for model in [Laptop, Monitor, GraphicsCard, Processor]
            ]
            combined_products = list(chain(*all_products))
            random.shuffle(combined_products)

            serialized_data = []
            for index, product in enumerate(combined_products, start=1):
                product_type = product.__class__.__name__.lower()
                serializer_class = self.serializers_map.get(product_type)

                if serializer_class:  # Upewnij się, że mamy odpowiedni serializator
                    serializer = serializer_class(product)
                    product_data = serializer.data
                    product_data["id"] = index
                    serialized_data.append(product_data)
                else:
                    # Możesz dodać logowanie błędu, jeśli chcesz wiedzieć, dla jakiego produktu brakuje serializatora
                    pass

            return Response(serialized_data)


def get_all_products():
    all_products = [
        model.objects.all() for model in [Laptop, Monitor, GraphicsCard, Processor]
    ]
    combined_products = list(chain(*all_products))
    return combined_products


class CartAPIView(APIView):
    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        request.data["cart"] = cart.id
        serializer = CartItemSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            cart.update_total_price()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_quantity(request, item_id):
    try:
        item = CartItem.objects.get(id=item_id)
        item.quantity += 1
        item.save()
        item.cart.update_total_price()
        return Response({"message": "Quantity updated"}, status=status.HTTP_200_OK)
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def subtract_quantity(request, item_id):
    try:
        item = CartItem.objects.get(id=item_id)
        if item.quantity > 1:
            item.quantity -= 1
            item.save()
            item.cart.update_total_price()
        return Response({"message": "Quantity updated"}, status=status.HTTP_200_OK)
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_item(request, item_id):
    try:
        item = CartItem.objects.get(id=item_id)
        item.delete()
        item.cart.update_total_price()
        return Response({"message": "Item removed"}, status=status.HTTP_200_OK)
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def buy(request):
    cart = request.user.cart
    # In a real scenario, you'd handle payment and order creation here.
    # For this simulation, we will just clear the cart.
    cart.cart_items.all().delete()
    cart.update_total_price()
    return Response(
        {"message": "Purchase successful! Cart cleared."}, status=status.HTTP_200_OK
    )
