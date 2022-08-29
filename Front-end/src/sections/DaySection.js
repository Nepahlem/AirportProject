import React, { useState } from "react";
import useAxios from "../utils/useAxios";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Countries from "../components/Countries";

export default function DaySection() {
  const api = useAxios();
  const [date, setDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams();
  const url = /days/ + id;

  const handleScheduling = (date_passed) => {
    setDate(date_passed);
    setShowModal(true);
  };

  const handleSchedulePost = async (e) => {
    e.preventDefault();
    const response = await api
      .post(url, {
        date: e.target.date.value,
        from: e.target.from.value,
        to: e.target.to.value,
        dp_time: e.target.dp_time.value,
        ar_time: e.target.ar_time.value,
        seats: e.target.seats.value,
        rate: e.target.rate.value,
      })
      .catch((error) => {
        setShowModal(false);
      });
    if (response.status === 201) {
      toast.success("Scheduled");
      queryClient.invalidateQueries(`days_${id}`);
      setShowModal(false);
    }
  };
  const fetchData = async () => {
    const response = await api.get(url);
    return response.data;
  };

  const { isLoading, error, data } = useQuery(`days_${id}`, fetchData, {
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <></>;

  if (error) return <></>;
  return (
    <div className="col-12">
      {data.map((day) => {
        return (
          <div className="card mb-2 p-3">
            <div class="card-body">
              <div className="row">
                <div className="col-4">
                  <h3 class="card-title">{day.formatted_date}</h3>
                </div>
                <div className="col-6">
                  <div className="row">
                    <div className="col-6">
                      {day.scheduled_flights.length !== 0 ? (
                        day.scheduled_flights.map((flight) => {
                          return (
                            <div className="alert alert-info">
                              Flight: {flight.id} -{" "}
                              <b>
                                {flight.or} - {flight.dt}
                              </b>
                              <br />
                              <b>
                                {flight.dp} - {flight.ar}
                              </b>
                            </div>
                          );
                        })
                      ) : (
                        <div className="alert alert-danger">
                          No flights scheduled
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <a
                    className="btn btn-primary"
                    href="#!"
                    onClick={() => handleScheduling(day.date)}
                  >
                    Schedule Flights
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div
        class={`modal fade ${showModal ? "show" : ""}`}
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
        style={{ display: showModal ? "block" : "none" }}
      >
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">
                Schedule Flight
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div class="modal-body">
              <form class="row g-3" id="myform" onSubmit={handleSchedulePost}>
                <div class="col-md-6">
                  <label for="inputEmail4" class="form-label">
                    Date of Departure
                  </label>
                  <input
                    type="date"
                    name="date"
                    class="form-control"
                    disabled
                    value={date}
                    id="inputEmail4"
                    required
                  />
                </div>
                <div class="col-md-6"></div>
                <div class="col-md-6">
                  <label for="inputState" class="form-label">
                    From
                  </label>
                  <select
                    id="inputState"
                    class="form-select"
                    name="from"
                    required
                  >
                    <Countries />
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="inputState" class="form-label">
                    To
                  </label>
                  <select
                    id="inputState"
                    class="form-select"
                    name="to"
                    required
                  >
                    <Countries />
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="inputZip" class="form-label">
                    Departure Time
                  </label>
                  <input
                    type="time"
                    class="form-control"
                    id="inputZip"
                    name="dp_time"
                    required
                  />
                </div>
                <div class="col-md-3">
                  <label for="inputZip" class="form-label">
                    Landing Time
                  </label>
                  <input
                    type="time"
                    class="form-control"
                    id="inputZip"
                    name="ar_time"
                    required
                  />
                </div>
                <div class="col-md-3">
                  <label for="inputZip" class="form-label">
                    Ticket Rate
                  </label>
                  <input
                    type="number"
                    class="form-control"
                    id="inputZip"
                    name="rate"
                    required
                  />
                </div>
                <div class="col-md-3">
                  <label for="inputPassword4" class="form-label">
                    Total Seats
                  </label>
                  <input
                    type="number"
                    name="seats"
                    class="form-control"
                    id="inputPassword4"
                    required
                  />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button type="submit" class="btn btn-primary" form="myform">
                Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
