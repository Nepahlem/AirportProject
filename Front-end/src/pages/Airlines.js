import React from "react";
import Header from "../sections/Header";
import useAxios from "../utils/useAxios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

export default function Airlines() {
  const api = useAxios();
  const fetchData = async () => {
    const response = await api.get("/airlines/");
    return response.data;
  };

  const { isLoading, error, data } = useQuery("airlines", fetchData, {
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
                      <div className="col-10">
                        <h3 class="card-title">{item.name}</h3>
                      </div>
                      <div className="col-2">
                        <Link
                          className="btn btn-primary"
                          to={`/airlines/${item.id}`}
                        >
                          Manage
                        </Link>
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
