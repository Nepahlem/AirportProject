
from django.urls import path
from . import views
from .authentication import RegisterView, MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
     path('', views.IndexView.as_view()),
     path('register/', RegisterView.as_view(), name="register"),
     path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

     # countries
     path('countries/', views.CountriesView.as_view()),
     path('countries/<country_id>', views.CountriesView.as_view()),

     # Airline_Companies
     path('airlines/', views.AirlineCompaniesView.as_view()),
     path('airlines/<airline_id>', views.AirlineCompaniesView.as_view()),

     path('days/<airline_id>', views.DaysView.as_view()),

     # flights
     path('flights/', views.FlightsView.as_view()),
     path('flights/<flight_id>', views.FlightsView.as_view()),

     path('tickets/', views.TicketView.as_view()),
     path('tickets/<ticket_id>', views.TicketView.as_view()),

]
