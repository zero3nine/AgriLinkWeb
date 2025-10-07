import { Navigate } from "react-router-dom";

const DeliveryProviderRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    // User not logged in
    return <Navigate to="/login" />;
  }

  if (role !== "delivery_provider") {
    // User is logged in but not delivery provider
    return <Navigate to="/" replace />;
  }

  // User is authenticated and a delivery provider
  return children;
};

export default DeliveryProviderRoute;
