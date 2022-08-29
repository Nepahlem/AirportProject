import React from "react";
import Flight from "../components/Flight";
import axios from "axios";
import { useQuery } from "react-query";

const baseUrl = process.env.REACT_APP_API_ENDPOINT;

export default function FlightList({ from, to, count, date }) {
  const url =
    baseUrl + `/flights/?from=${from}&to=${to}&count=${count}&date=${date}`;
  const fetchData = async () => {
    const response = await axios.get(url);
    return response.data;
  };

  const { isLoading, error, data } = useQuery(`countries`, fetchData, {
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <></>;

  if (error) return <></>;
  return (
    <div className="row">
      <div className="col-12 my-2">
        <h2>Available Flights</h2>
      </div>
      {data.length !== 0 ? (
        data.map((item) => {
          return (
            <div className="col-12 mt-2">
              <Flight data={item} />
            </div>
          );
        })
      ) : (
        <div className="alert alert-warning p-5 text-center">
          No Flights Available
        </div>
      )}
    </div>
  );
}
