import React from "react";
import Header from "../sections/Header";
import useAxios from "../utils/useAxios";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import DaySection from "../sections/DaySection";

export default function AirlinesManage() {
  const api = useAxios();
  const { id } = useParams();
  const url = /airlines/ + id;
  const fetchData = async () => {
    const response = await api.get(url);
    return response.data;
  };

  const { isLoading, error, data } = useQuery(`airlines_${id}`, fetchData, {
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
          <div className="col-12">
            <div className="alert alert-info p-3 mb5">
              <div class="card-body">
                <h3 class="card-title">{data.name}</h3>
              </div>
            </div>
          </div>
          <DaySection airline_id={id} />
        </div>
      </div>
    </>
  );
}
