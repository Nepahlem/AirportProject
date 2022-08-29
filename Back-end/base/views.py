from datetime import datetime, timezone
from base.models import AirlineCompany, Flight, Country, Ticket, Day
from rest_framework.views import APIView
from base.serializers import FlightsSerializer,\
    CountriesSerializer, \
    TicketsSerializer, AirlineCompaniesSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny


class IndexView(APIView):
    def get(self, request):
        return Response({"message": "Ok"}, status=200)


class CountriesView(APIView):
    model = Country
    serializer = CountriesSerializer
    permission_classes = AllowAny,

    def get(self, request):
        """
            Method for returning the list of available countries
        """
        data = self.model.objects.all()
        serializer = self.serializer(data, many=True)
        return Response(serializer.data, status=200)


class AirlineCompaniesView(APIView):
    model = AirlineCompany
    serializer = AirlineCompaniesSerializer
    permission_classes = IsAuthenticated,

    def get(self, request, airline_id=None):
        """
            Method for viewing airline data individually if airline_id is passed
            otherwise it will return a list of airlines managed by the request user
        """
        if airline_id is not None:
            data = self.model.objects.get(id=airline_id)
            if data in request.user.customer.airlines_managed.all():
                serializer = self.serializer(data, many=False)
            else:
                return Response(status=401)
        else:
            data = request.user.customer.airlines_managed.all()
            serializer = self.serializer(data, many=True)
        return Response(serializer.data, status=200)


class FlightsView(APIView):
    model = Flight
    serializer = FlightsSerializer

    def get(self, request, flight_id=None):
        """
            Method for viewing flights data individually if flight_id is passed
            otherwise it will return a list of flights for the specified date
        """
        if flight_id is not None:
            data = self.model.objects.get(id=flight_id)
            serializer = self.serializer(data, many=False)
            return Response(serializer.data, status=200)
        else:
            date = Day.objects.filter(date=request.query_params.get("date")).last()
            if date and date.date > datetime.now(timezone.utc).date():
                data = date.flights_scheduled.filter(
                    destination_country__code=request.query_params.get("to"),
                    origin_country__code=request.query_params.get("from"),
                    total_seats__gte=request.query_params.get("count"),
                    day__date__gt=datetime.now(timezone.utc).date()
                )
                serializer = self.serializer(data, many=True)
                return Response(serializer.data, status=200)
        return Response([], status=200)

    def post(self, request, flight_id):
        """
            Method for booking tickets for the specific flight
        """
        flight = self.model.objects.get(
            id=flight_id
        )
        Ticket.objects.create(
            flight=flight,
            customer=request.user.customer,
            total_rate=flight.rate,
            status=True
        )
        return Response(status=201)

    def delete(self, request, flight_id=None):
        """
            Method deleting a scheduled flight by the airline staff
        """
        flight = self.model.objects.get(id=flight_id)
        if flight.airline_company in request.user.customer.airlines_managed.all():
            flight.delete()
            return Response({"DELETE": flight_id})


class DaysView(APIView):
    model = Day
    serializer = AirlineCompaniesSerializer
    permission_classes = IsAuthenticated,

    def get(self, request, airline_id):
        """
            Method returns the cheduled flights for the specified day
        """
        data = self.model.objects.filter(date__gte=datetime.now(timezone.utc))
        items = []
        for item in data:
            items.append({"scheduled_flights": item.sheduled_airline_flights(airline_id),
                          "date": item.date, "formatted_date": item.formated_date})
        return Response(items, status=200)

    def post(self, request, airline_id):
        """
            Method for scheduling a flight by the airline staff
        """
        if airline_id is not None:
            airline = AirlineCompany.objects.get(id=airline_id)
            day = Day.objects.get(date=request.data.get("date"))
            origin_country = Country.objects.get(code=request.data.get("from"))
            destination_country = Country.objects.get(code=request.data.get("to"))
            if airline in request.user.customer.airlines_managed.all():
                Flight.objects.create(
                    day=day,
                    total_seats=request.data.get("seats"),
                    rate=request.data.get("rate"),
                    departure_time=request.data.get("dp_time"),
                    landing_time=request.data.get("ar_time"),
                    origin_country=origin_country,
                    destination_country=destination_country,
                    airline_company=airline,
                )
        return Response(status=201)


class TicketView(APIView):
    serializer = TicketsSerializer
    model = Ticket

    def get(self, request, ticket_id=None):
        """
            Method for viewing flight tickets individually if ticket_id is passed
            otherwise it will return a list of tickets for the specified user
        """
        if ticket_id is not None:
            data = self.model.objects.get(id=ticket_id)
            serializer = self.serializer(data, many=False)
        else:
            data = request.user.customer.tickets.all()
            serializer = self.serializer(data, many=True)
        return Response(serializer.data, status=200)

    def delete(self, request, ticket_id):
        """
            Method for cancelling a specific flight ticket
        """
        ticket = self.model.objects.get(id=ticket_id)
        if ticket.customer == request.user.customer:
            ticket.delete()
            return Response(status=204)
        return Response(status=401)
