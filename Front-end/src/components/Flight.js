import React from "react";
import { Link } from "react-router-dom";

export default function Flight({ data }) {
  return (
    <div class="card w-100 border">
      <div class="card-body">
        <div className="row">
          <div className="col-5">
            <h4 class="card-title">
              {data.airline_company?.name} {data.id}
            </h4>
            <h5>
              {data.origin_country} - {data.destination_country}
            </h5>
            <h6>
              {data.departure_time} hrs - {data.landing_time} hrs
            </h6>
          </div>
          <div className="col-6"></div>
          <div className="col-1 row align-items-center">
            <Link to={`/flights/${data.id}/`} class="btn btn-primary">
              Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
