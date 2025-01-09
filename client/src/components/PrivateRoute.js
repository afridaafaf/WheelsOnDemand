import React from "react";
import { Navigate } from "react-router-dom";

/**
 * A higher-order component to protect routes based on authentication and roles.
 *
 * @param {ReactNode} children - The component to render if access is allowed.
 * @param {string} roleRequired - (Optional) The role required to access the route.
 */
const PrivateRoute = ({ children, roleRequired }) => {
  // Retrieve token and role from localStorage
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // If no token is found, redirect to the login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If a specific role is required and the user's role doesn't match, redirect to the home page
  if (roleRequired && userRole !== roleRequired) {
    return <Navigate to="/" />;
  }

  // If authenticated and role matches (if applicable), render the children components
  return children;
};

export default PrivateRoute;
