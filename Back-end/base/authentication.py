from datetime import datetime, timezone

import django.db.utils
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Customer
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh['username'] = user.username
    refresh['is_staff'] = user.customer.is_airline_management_staff

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class MyTokenObtainPairView(APIView):
    """
        Class for handling token issue after user authentication.
    """
    model = User

    def post(self, request):
        if request.data.get("email") and request.data.get("password"):
            try:
                user = self.model.objects.get(email=request.data.get("email"))
                if not user.is_active:
                    return Response({"message": "Account Closed"}, status=status.HTTP_406_NOT_ACCEPTABLE)
                if user.customer.verified:
                    user = authenticate(request, username=user.username, password=request.data.get("password"))
                    if user:
                        return Response(get_tokens_for_user(user), status=status.HTTP_200_OK)
                    return Response({"message": "Wrong credentials"}, status=status.HTTP_401_UNAUTHORIZED)
                else:
                    return Response({"message": "Email verification pending"}, status=status.HTTP_401_UNAUTHORIZED)
            except self.model.DoesNotExist:
                return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "Email or password not supplied"}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    """
        Class for handling user registration.
    """
    model = User

    def post(self, request):
        email = request.data.get("email")
        if email:
            try:
                user = self.model.objects.get(email=email)
                if user.customer.verified:
                    return Response({"message": "Already registered, login"}, status=status.HTTP_307_TEMPORARY_REDIRECT)
                return Response({"message": "Email verification pending"}, status=status.HTTP_401_UNAUTHORIZED)
            except self.model.DoesNotExist:
                if request.data.get("password") == request.data.get("password_confirmation"):
                    try:
                        user = self.model.objects.create_user(
                            username=request.data.get("username"),
                            email=email,
                            password=request.data.get("password")
                        )
                        Customer.objects.create(
                            user=user,
                            verified=True
                        )
                    except django.db.utils.IntegrityError:
                        return Response({"message": "Username already taken"}, status=status.HTTP_409_CONFLICT)
                    return Response({"message": "Account Created"}, status=status.HTTP_201_CREATED)
                else:
                    return Response({"message": "Passwords does not match"}, status=status.HTTP_400_BAD_REQUEST)


class AccountSettingView(APIView):
    """
        Class for handling user data management.
    """
    permission_classes = IsAuthenticated,
    meta_attributes = ["address", "pincode", "country", "city"]
    serializer = UserSerializer

    def get(self, request):
        serializer = self.serializer(request.user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        request.user.first_name = request.data.get("first_name")
        request.user.last_name = request.data.get("last_name")
        request.user.save()
        meta = request.user.customer.meta
        for attribute in self.meta_attributes:
            if request.data.get(attribute):
                setattr(meta, attribute, request.data.get(attribute))
        meta.save()
        serializer = self.serializer(request.user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
