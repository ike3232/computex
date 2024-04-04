from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

from .models import CustomUser

User = get_user_model()


class CustomUserTests(APITestCase):
    def test_create_user(self):
        """
        Test, czy można utworzyć nowego użytkownika za pomocą API
        """
        url = reverse("create_user")
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "User",
            "delivery_address": "123 Test St, Test City, Test Country",
            "payment_details": "VISA 1234-5678-9101-1121",
        }
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, "testuser")

    def test_user_login(self):
        """
        Test, czy istniejący użytkownik może się zalogować i otrzymać tokeny
        """
        user = CustomUser.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            first_name="Test",
            last_name="User",
            delivery_address="123 Test St, Test City, Test Country",
            payment_details="VISA 1234-5678-9101-1121",
        )
        url = reverse("user_login")
        print(url)
        data = {
            "username": "testuser",
            "password": "testpass123",
        }
        response = self.client.post(url, data, format="json")
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue("access" in response.data)
        self.assertTrue("refresh" in response.data)
