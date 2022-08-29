import React from "react";
import Header from "../sections/Header";
import useAxios from "../utils/useAxios";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

export default function Tickets() {
  const api = useAxios();
  const queryClient = useQueryClient();
  const fetchData = async () => {
    const response = await api.get("/tickets/");
    return response.data;
  };
  const cancelTicket = async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    if (response.status === 204) {
      toast.success("Ticket Cancelled");
      queryClient.invalidateQueries("tickets");
    }
  };
  const { isLoading, error, data } = useQuery("tickets", fetchData, {
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <></>;

  if (error) return <></>;
  return (
    <>
      <div className="container">
        <Header />
      </div>

      <div className="container">
        <div className="row">
          {data.map((item) => {
            return (
              <div className="col-6">
                <div className="card mb-2 p-3">
                  <div class="card-body">
                    <div className="row">
                      <div className="col-8">
                        <h3 class="card-title">
                          {item.flight.airline_company
                            ? item.flight.airline_company.name
                            : null}{" "}
                          {item.id}
                        </h3>
                        <h4>
                          {item.flight
                            ? item.flight.origin_country +
                              "-" +
                              item.flight.destination_country
                            : null}
                        </h4>

                        <h5>
                          {" "}
                          {item.flight
                            ? item.flight.departure_time +
                              "-" +
                              item.flight.landing_time
                            : null}
                        </h5>
                      </div>

                      <div className="col-4">
                        Booked at: {item.create_time}
                        <br />
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => cancelTicket(item.id)}
                        >
                          cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
