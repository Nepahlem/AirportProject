import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import FlightBook from "./pages/FlightBook";
import Airlines from "./pages/Airlines";
import AirlinesManage from "./pages/AirlinesManage";
import Tickets from "./pages/Tickets";

class App extends Component {
  render() {
    const queryClient = new QueryClient();

    return (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Routes>
              <Route path={"/login/"} exact element={<Login />} />
              <Route
                path={"/flights/:id/"}
                exact
                element={
                  <PrivateRoute>
                    <FlightBook />
                  </PrivateRoute>
                }
              />
              <Route
                path={"/airlines/"}
                exact
                element={
                  <PrivateRoute>
                    <Airlines />
                  </PrivateRoute>
                }
              />
              <Route
                path={"/my-tickets/"}
                exact
                element={
                  <PrivateRoute>
                    <Tickets />
                  </PrivateRoute>
                }
              />
              <Route
                path={"/airlines/:id"}
                exact
                element={
                  <PrivateRoute>
                    <AirlinesManage />
                  </PrivateRoute>
                }
              />
              <Route path={"/signup/"} exact element={<Signup />} />
              <Route path={"/"} element={<Dashboard />} />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              pauseOnHover
              theme={"colored"}
            />
            {/* <ReactQueryDevtools /> */}
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    );
  }
}

export default App;
