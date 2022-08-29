from django.db import models
from django.db.models import Q
from django.db.models.functions import Now
from django.contrib.auth.models import User


class Customer(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    verified = models.BooleanField(default=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    address = models.CharField(max_length=50, null=True, blank=True)
    phone_no = models.CharField(max_length=50, null=True, blank=True)
    credit_card_no = models.CharField(max_length=50, null=True, blank=True)
    create_time = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=True)
    airlines_managed = models.ManyToManyField("AirlineCompany")

    @property
    def is_airline_management_staff(self):
        return self.airlines_managed.exists()

    def __str__(self):
        return self.user.email


class Country(models.Model):
    name = models.CharField(max_length=50, null=True, blank=True)
    code = models.CharField(max_length=3, primary_key=True)

    def __str__(self):
        return self.name


class AirlineCompany(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    status = models.BooleanField(default=True)
    name = models.CharField(max_length=50, null=True, blank=True)
    create_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Flight(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    status = models.BooleanField(default=True)
    airline_company = models.ForeignKey(AirlineCompany,
                                        related_name='airline_company', on_delete=models.SET_NULL, null=True)
    origin_country = models.ForeignKey(Country, related_name='origin_country', on_delete=models.SET_NULL, null=True)
    destination_country = models.ForeignKey(Country,
                                            related_name='destination_country', on_delete=models.SET_NULL, null=True)
    departure_time = models.TimeField()
    landing_time = models.TimeField()
    total_seats = models.IntegerField(null=True, blank=True)
    create_time = models.DateTimeField(auto_now_add=True)
    rate = models.FloatField(default=0)
    day = models.ForeignKey("Day", on_delete=models.CASCADE, related_name="flights_scheduled")

    def __str__(self):
        return f"{self.airline_company.name} - {self.id} :" \
               f"{self.origin_country.code} - {self.destination_country.code}"


class Ticket(models.Model):
    status = models.BooleanField(default=True)
    flight = models.ForeignKey(Flight, related_name='all_tickets', on_delete=models.SET_NULL, null=True)
    customer = models.ForeignKey(Customer, related_name='tickets', on_delete=models.SET_NULL, null=True)
    create_time = models.DateTimeField(auto_now_add=True)
    total_rate = models.FloatField(default=0)
    id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return f"{self.customer.user.username} : " \
               f"{self.flight.origin_country.code} - {self.flight.destination_country.code}"


class Day(models.Model):
    """
        Day instance for scheduling flights.
        Administrator can add more day instances allowing the
        airline management staff to schedule flights for those days.
    """
    date = models.DateField(primary_key=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(date__gt=Now()),
                name="Day must be greated than today. Flights can only be scheduled and booked for upcoming days"
            )
        ]

    @property
    def formated_date(self):
        return self.date.strftime("%d-%m-%Y")

    def sheduled_airline_flights(self, airline_id):
        return [{"id": flight.id, "dp": flight.departure_time,
                 "ar": flight.landing_time,
                 "or": flight.origin_country.code,
                 "dt": flight.destination_country.code
                 } for flight in self.flights_scheduled.filter(airline_company_id=airline_id)]

    def __str__(self):
        return self.date.strftime("%Y-%m-%d")
