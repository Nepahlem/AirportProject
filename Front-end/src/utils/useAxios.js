import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import dayjs from "dayjs";
import jwtDecode from "jwt-decode";

const baseUrl = process.env.REACT_APP_API_ENDPOINT;

export default function useAxios() {
  const { authToken, refreshAccessToken } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken?.access}`,
    },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwtDecode(authToken.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    if (!isExpired) return req;
    refreshAccessToken();
    return req;
  });

  return axiosInstance;
}
