import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
export default function Signup() {
  let { registerUser, resendVerification } = useContext(AuthContext);
  return (
    <div class="container">
      <div class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card border-0 shadow rounded-3 my-5">
            <div class="card-body p-4 p-sm-5">
              <h5 class="card-title text-center mb-5 fw-light fs-5">Sign Up</h5>
              <form onSubmit={registerUser}>
                <div class="form-floating mb-3">
                  <input
                    type="email"
                    name="email"
                    class="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                  />
                  <label for="floatingInput">Email address</label>
                </div>
                <div class="form-floating mb-3">
                  <input
                    type="text"
                    name="username"
                    class="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                  />
                  <label for="floatingPassword">Username</label>
                </div>
                <div class="form-floating mb-3">
                  <input
                    type="password"
                    name="password"
                    class="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                  />
                  <label for="floatingPassword">Password</label>
                </div>
                <div class="form-floating mb-3">
                  <input
                    type="password"
                    name="password_confirmation"
                    class="form-control"
                    id="floatingPasswordx"
                    placeholder="Password"
                  />
                  <label for="floatingPassword">Confirm Password</label>
                </div>
                <div class="d-grid">
                  <button
                    class="btn btn-primary btn-login text-uppercase fw-bold"
                    type="submit"
                  >
                    Sign in
                  </button>
                </div>
                <hr class="my-4" />
                Already have an account?<Link to="/login/"> Sign in.</Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
