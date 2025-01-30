/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const checkLogin = () => {
  return localStorage.getItem("authToken");
};
const PrivateRoute = ({ element }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(checkLogin());

  useEffect(() => {
    setIsLoggedIn(checkLogin());
  }, []);

  return isLoggedIn ? element : <Navigate to="/auth" />;
};
export default PrivateRoute;
