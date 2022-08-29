from django.contrib.auth.models import User
from rest_framework import serializers
from base.models import AirlineCompany, Flight, Customer, Country, Ticket, Day


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('id', 'first_name', 'last_name', 'address', 'phone_no', 'credit_card_no', 'user_id', 'createdTime')


class CountriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ('name', 'code')


class AirlineCompaniesSerializer(serializers.ModelSerializer):
    class Meta:
        model = AirlineCompany
        fields = ('id', 'status', 'name', 'create_time')

      
class FlightsSerializer(serializers.ModelSerializer):
    airline_company = AirlineCompaniesSerializer()

    class Meta:
        model = Flight
        fields = "__all__"


class TicketsSerializer(serializers.ModelSerializer):
    flight = FlightsSerializer()

    class Meta:
        model = Ticket
        fields = "__all__"


class DaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Day
        fields = ["date", "formated_date"]