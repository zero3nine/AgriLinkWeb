import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/dashboardSeller.css";

function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // ✅ Get sellerId from localStorage
  const sellerId = localStorage.getItem("userId");

  // ✅ Fetch data on load
  useEffect(() => {
    if (!sellerId) {
      alert("Seller ID not found. Please log in again.");
      navigate("/login");
      return;
    }

    fetchProducts();
    fetchOrders();
  }, [sellerId]);

  // ✅ Fetch only this seller's products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/seller/${sellerId}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching seller products:", err);
    }
  };

  // ✅ Fetch only this seller's orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/seller/${sellerId}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching seller orders:", err);
    }
  };

  // ✅ Flatten only this seller's orders
  const flattenedOrders = orders.flatMap((order) =>
    order.items
      .filter((item) => item.sellerId === sellerId)
      .map((item) => ({
        id: order._id,
        buyer: order.buyerName,
        product: item.name,
        qty: item.qty,
        status: order.status,
      }))
  );

  // ✅ Update stock quantity
  const updateStockLevel = async (id, newStock) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, { stock: newStock });
      fetchProducts();
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  // ✅ Mark product In Stock
  const markInStock = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/products/${id}/in-stock`);
      fetchProducts();
    } catch (err) {
      console.error("Error marking in stock:", err);
    }
  };

  // ✅ Mark product Out of Stock
  const markOutOfStock = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/products/${id}/out-of-stock`);
      fetchProducts();
    } catch (err) {
      console.error("Error marking out of stock:", err);
    }
  };

  // ✅ Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  return (
    <div className="dashboard light">
      <h1 className="dashboard-title">🌾 Seller Dashboard</h1>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          📦 Total Products <span>{products.length}</span>
        </div>
        <div className="stat-card">
          🛒 Orders Received <span>{flattenedOrders.length}</span>
        </div>
        <div className="stat-card">
          ✅ Completed Orders{" "}
          <span>{orders.filter((o) => o.status === "Ready").length}</span>
        </div>
      </div>

      <div className="main-grid">
        {/* Product Listings */}
        <div className="section">
          <div className="section-header">
            <h2>My Listings</h2>
            <button className="add-product-btn" onClick={() => navigate("/add-product")}>
              ➕ Add Product
            </button>
          </div>

          {products.length === 0 ? (
            <p style={{ textAlign: "center", padding: "20px" }}>
              You haven’t added any products yet.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Image</th>
                  <th>Price (LKR)</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </td>
                    <td>{p.price}</td>
                    <td>{p.stock}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          p.stockStatus === "In Stock" ? "in-stock" : "out-of-stock"
                        }`}
                      >
                        {p.stockStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        onChange={(e) => {
                          if (e.target.value === "in-stock") markInStock(p._id);
                          if (e.target.value === "out-of-stock") markOutOfStock(p._id);
                          if (e.target.value === "update-stock") {
                            const newStock = prompt("Enter new stock quantity:");
                            if (newStock) updateStockLevel(p._id, parseInt(newStock));
                          }
                          if (e.target.value === "edit") navigate(`/edit-product/${p._id}`);
                          if (e.target.value === "delete") deleteProduct(p._id);
                          e.target.value = "";
                        }}
                      >
                        <option value="">Select Action</option>
                        <option value="in-stock">Mark In Stock</option>
                        <option value="out-of-stock">Mark Out of Stock</option>
                        <option value="update-stock">Update Stock Level</option>
                        <option value="edit">Edit Product</option>
                        <option value="delete">Delete Product</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Orders Section */}
        <div className="section">
          <h2>Orders Received</h2>
          <table>
            <thead>
              <tr>
                <th>Buyer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {flattenedOrders.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No orders found
                  </td>
                </tr>
              ) : (
                flattenedOrders.map((o, index) => (
                  <tr key={`${o.id}-${index}`}>
                    <td>{o.buyer}</td>
                    <td>{o.product}</td>
                    <td>{o.qty}</td>
                    <td>{o.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="section analytics">
        <h2>📊 Best-Selling Products</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={products}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Bar dataKey="stock" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SellerDashboard;
