import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import SellerDashboard from "./pages/SellerDashboard";


function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/seller-home" element={<SellerDashboard/>} />
        <Route path="/delivery-home" element={<h2>Delivery Provider Home - To be implemented</h2>} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;

