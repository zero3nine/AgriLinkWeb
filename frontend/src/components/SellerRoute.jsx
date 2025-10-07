import React from "react";
import { Navigate } from "react-router-dom";

const SellerRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    // User not logged in
    return <Navigate to="/login" />;
  }

  if (role !== "seller") {
    // User is logged in but not seller
    return <Navigate to="/" replace />;
  }

  // User is authenticated and a seller
  return children;
};

export default SellerRoute;
