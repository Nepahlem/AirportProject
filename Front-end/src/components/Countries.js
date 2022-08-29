import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
const baseUrl = process.env.REACT_APP_API_ENDPOINT;
export default function Countries() {
  const fetchData = async () => {
    const response = await axios.get(baseUrl + "/countries/");
    return response.data;
  };

  const { isLoading, error, data } = useQuery(`countries`, fetchData, {
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <option disabled>loading....</option>;

  if (error) return <option disabled>error, reload</option>;
  return (
    <>
      {data.map((item, i) => {
        return <option value={item.code}>{item.name}</option>;
      })}
    </>
  );
}
