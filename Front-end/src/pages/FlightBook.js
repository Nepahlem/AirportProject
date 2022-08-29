import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../sections/Header";
import useAxios from "../utils/useAxios";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

export default function FlightBook() {
  const api = useAxios();
  const { id } = useParams();
  const naviagate = useNavigate();
  const fetchData = async () => {
    const response = await api.get(`/flights/${id}`);
    console.log(response.data);
    return response.data;
  };

  const { isLoading, error, data } = useQuery(`countries`, fetchData, {
    refetchOnWindowFocus: false,
  });
  const handleBooking = async () => {
    const response = await api.post(`/flights/${id}`).catch((error) => {
      toast.error("Error");
    });
    if (response.status === 201) {
      toast.success("Ticket Booked");
      naviagate("/my-tickets/");
    }
  };
  if (isLoading) return <></>;

  if (error) return <></>;
  return (
    <>
      <div className="container">
        <Header />
      </div>

      <div className="container">
        <div className="row">
          <div className="col-9">
            <div className="alert alert-warning mb-2">
              <div class="card-body">
                <div className="row">
                  <div className="col-8">
                    <h3 class="card-title">
                      {data.airline_company ? data.airline_company.name : null}{" "}
                      {data.id}
                    </h3>
                    <h5 class="text-muted">
                      {data.origin_country} - {data.destination_country}
                    </h5>
                    <h5 class="text-muted">Non Stop</h5>
                  </div>
                  <div className="col-4">
                    <h3 class="card-title">
                      {data.departure_time} - {data.landing_time}
                    </h3>
                    <h5 class="text-muted">{data.seats_left} Seats left</h5>
                    <h5 class="text-muted">{data.luggage} kgs Luggage</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="card mb-2">
              <div class="card-body">
                <div class="container">
                  <div class="row">
                    <div class="col-xs-12">
                      <div class="grid invoice">
                        <div class="grid-body">
                          <div class="invoice-title">
                            <div class="row">
                              <div class="col-xs-12">
                                <h2>
                                  invoice
                                  <br />
                                </h2>
                              </div>
                            </div>
                          </div>
                          <hr />
                          <div class="row">
                            <div class="col-md-12">
                              <h3>ORDER SUMMARY</h3>
                              <table class="table table-striped">
                                <thead>
                                  <tr class="line">
                                    <td>
                                      <strong>#</strong>
                                    </td>
                                    <td class="text-center">
                                      <strong>FLIGHT</strong>
                                    </td>
                                    <td class="text-right">
                                      <strong>RATE</strong>
                                    </td>
                                    <td class="text-right">
                                      <strong>SUBTOTAL</strong>
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>1</td>
                                    <td>
                                      <strong>Qatar Airways</strong>
                                      <br />
                                      Q912 DXB - QAR (3.00 - 6.00 hrs) 23 Kg
                                    </td>
                                    <td class="text-center">${data.rate}</td>
                                    <td class="text-right">${data.rate}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-12 text-right identity">
                              <button
                                className="btn btn-primary"
                                onClick={() => handleBooking()}
                              >
                                Book Tickets
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
