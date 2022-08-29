import React, { useState } from "react";
import Countries from "../components/Countries";

import FlightList from "../sections/FlightList";
import Header from "../sections/Header";
export default function Dashboard() {
  const [quering, setQuering] = useState(false);
  const [date, setDate] = useState(null);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [count, setCount] = useState(null);

  const handleLookUp = async (e) => {
    e.preventDefault();
    setDate(e.target.date.value);
    setCount(e.target.count.value);
    setFrom(e.target.from.value);
    setTo(e.target.to.value);
    setQuering(true);
  };
  return (
    <>
      <div className="container">
        <Header />
      </div>

      <main className="container">
        <div className="row mb-3">
          <div className="container">
            <div className="card p-4 mt-5">
              <form id="checkForm" onSubmit={(e) => handleLookUp(e)}>
                <div className="row g-3">
                  <div className="col-12 mb-4">
                    <h4>Flight Booking</h4>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="form-floating">
                      <select
                        id="inputState"
                        class="form-select"
                        name="from"
                        required
                      >
                        <Countries />
                      </select>
                      <label>FLYING FROM</label>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="form-floating">
                      <select
                        id="inputState"
                        class="form-select"
                        name="to"
                        required
                      >
                        <Countries />
                      </select>
                      <label>FLYING TO</label>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-12">
                    <div className="form-floating">
                      <input
                        type="date"
                        name="date"
                        className="form-control"
                        placeholder="DEPARTING"
                        required
                      />
                      <label>DEPARTING</label>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-12">
                    <div className="form-floating">
                      <select className="form-select" name="count" required>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                        <option value="4">Four</option>
                        <option value="5">Five</option>
                      </select>
                      <label>ADULTS(18+)</label>
                    </div>
                  </div>
                  <div className="col-12 mt-4">
                    <button
                      className="btn btn-primary text-uppercase ml-3"
                      type="submit"
                      href="#!"
                      form="checkForm"
                    >
                      SHOW FLIGHTS
                    </button>
                    <button
                      className="btn btn-primary text-uppercase ml-3 ms-2"
                      type="button"
                      onClick={() => window.location.reload(false)}
                    >
                      SEARCH ANOTHER
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {quering ? (
          <FlightList from={from} to={to} date={date} count={count} />
        ) : (
          <></>
        )}
      </main>
    </>
  );
}
