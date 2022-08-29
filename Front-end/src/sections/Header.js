import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Header() {
  const { logoutUser, user } = useContext(AuthContext);

  return (
    <header className="blog-header py-3">
      <div className="row flex-nowrap justify-content-between align-items-center">
        <div className="col-8 pt-1">
          <h3 className="link-secondary">
            <a href="#!" onClick={() => (window.location.href = "/")}>
              Flight Booking System
            </a>
          </h3>
        </div>
        <div className="col-4 d-flex justify-content-end align-items-center">
          {user ? (
            user.is_staff ? (
              <Link
                className="btn btn-sm btn-outline-secondary me-3"
                to="/airlines/"
              >
                Airlines Management
              </Link>
            ) : (
              <Link
                className="btn btn-sm btn-outline-secondary me-3"
                to="/my-tickets/"
              >
                My Tickets
              </Link>
            )
          ) : (
            <></>
          )}
          {user ? (
            <a
              className="btn btn-sm btn-outline-success me-3"
              href="https://airline-backendd.herokuapp.com/admin/"
            >
              Administrator Login
            </a>
          ) : (
            <></>
          )}
          {user ? (
            <a
              className="btn btn-sm btn-outline-danger"
              href="#"
              onClick={() => logoutUser()}
            >
              Logout
            </a>
          ) : (
            <Link className="btn btn-sm btn-outline-success" to={"/login/"}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
