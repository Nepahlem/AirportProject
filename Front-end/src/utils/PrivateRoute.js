import { Navigate } from "react-router-dom";
import { useContext } from "react";
import React from "react";
import AuthContext from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  console.log(user);
  return user ? children : <Navigate to={"/login/"} />;
}
