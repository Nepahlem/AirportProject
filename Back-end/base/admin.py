from django.contrib import admin
from .models import Customer, Country, AirlineCompany, Flight, Ticket, Day

admin.site.register(Customer)
admin.site.register(Country)
admin.site.register(AirlineCompany)
admin.site.register(Flight)
admin.site.register(Ticket)
admin.site.register(Day)
