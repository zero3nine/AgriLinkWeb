import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import SellerDashboard from "./pages/SellerDashboard";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import DeliveryProviderDashboard from "./pages/DeliveryProviderDashboard";
import SellerRoute from "./components/SellerRoute";
import DeliveryProviderRoute from "./components/DeliveryProviderRoute";

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/seller-home" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/delivery-home" element={<DeliveryProviderRoute><DeliveryProviderDashboard /></DeliveryProviderRoute>} />

        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;

