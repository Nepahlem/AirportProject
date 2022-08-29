import { createContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import axios from "axios";

const AuthContext = createContext();
const baseUrl = process.env.REACT_APP_API_ENDPOINT;

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("authToken")
      ? JSON.parse(localStorage.getItem("authToken"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authToken")
      ? jwtDecode(localStorage.getItem("authToken"))
      : null
  );
  const loginUser = async (e) => {
    e.preventDefault();
    let response = await fetch(`${baseUrl}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });

    let data = await response.json();
    if (response.status === 200) {
      setAuthToken(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authToken", JSON.stringify(data));
      navigate("/");
    } else {
      toast.error(data.message);
    }
  };

  const refreshAccessToken = async () => {
    let response = await fetch(`${baseUrl}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: authToken?.refresh }),
    });

    let data = await response.json();

    if (response.status === 200) {
      setAuthToken(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authToken", JSON.stringify(data));
    } else {
      logoutUser();
    }
    if (loading) {
      setLoading(false);
    }
  };

  const registerUser = async (e) => {
    e.preventDefault();
    let response = await fetch(`${baseUrl}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: e.target.email.value,
        username: e.target.username.value,
        password: e.target.password.value,
        password_confirmation: e.target.password_confirmation.value,
      }),
    });
    let data = await response.json();
    if (response.status === 201) {
      navigate("/login/");
      toast.success("Account Created, Now you may login.");
    } else if (response.status === 500) {
      toast.error("Internal Server Error, Contact Admin if issue persists");
    } else {
      toast.error(data.message);
    }
  };

  const verifyUser = async (code) => {
    let response = await fetch(`${baseUrl}/verify/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code,
      }),
    });
    let data = await response.json();
    navigate("/login/");
    if (response.status === 200) {
      toast.success("Email verified, Now you may Login");
    } else if (response.status === 500) {
      toast.error("Internal Server Error, Contact Admin if issue persists");
    } else {
      toast.error(data.message);
    }
  };
  const resendVerification = async (email) => {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email !== null && re.test(email)) {
      let response = await axios
        .post(`${baseUrl}/register/resend/verification/`, { email: email })
        .catch((error) => {
          if (error.response.status === 429)
            toast.warning("Wait 5 minutes before requesing another mail.");
          else if (error.response.status === 409)
            toast.info("Email is already verified");
          else if (error.response.status === 404)
            toast.error("User with email Not Found");
          else toast.error("Internal Server Error");
        });
      if (response.status === 200)
        toast.success("Email sent, Check your inbox");
    } else toast.error("Enter a valid email");
  };

  const resetPassword = async (email) => {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email !== null && re.test(email)) {
      let response = await axios
        .post(`${baseUrl}/login/reset/password/`, { email: email })
        .catch((error) => {
          if (error.response.status === 429)
            toast.warning("Wait 5 minutes before requesing another mail.");
          else if (error.response.status === 404)
            toast.error("User with email Not Found");
          else toast.error("Internal Server Error");
        });
      if (response.status === 200)
        toast.success("Email sent, Check your inbox");
    } else toast.error("Enter a valid email");
  };
  const logoutUser = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    navigate("/login/");
  };

  let contextData = {
    user: user,
    setUser: setUser,
    setauthToken: setAuthToken,
    resetPassword: resetPassword,
    authToken: authToken,
    loginUser: loginUser,
    verifyUser: verifyUser,
    logoutUser: logoutUser,
    registerUser: registerUser,
    refreshAccessToken: refreshAccessToken,
    resendVerification: resendVerification,
  };

  useEffect(() => {
    if (loading) {
      if (authToken) {
        const user = jwtDecode(authToken.access);
        const expiryIn = dayjs.unix(user.exp).diff(dayjs());
        if (expiryIn < 120000) {
          refreshAccessToken();
        } else {
          setLoading(false);
        }
      } else {
        logoutUser();
        setLoading(false);
      }
    }

    let interval = setInterval(() => {
      if (authToken) {
        refreshAccessToken();
      }
    }, 900000);
    return () => clearInterval(interval);
  }, [loading, authToken]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <>loading...</> : children}
    </AuthContext.Provider>
  );
};
