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
import "../styles/dashboard.css";

function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  // 🔹 Fetch products & orders from backend
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const flattenedOrders = orders.flatMap((order) =>
    order.items.map((item) => ({
      id: order._id,
      buyer: order.buyerName,
      product: item.name,
      qty: item.qty,
      status: order.status,
    }))
  );

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // 🔹 Update stock
  const updateStockLevel = async (id, newStock) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, {
        stock: newStock,
      });
      fetchProducts();
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  // 🔹 Mark In Stock
  const markInStock = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/products/${id}/in-stock`);
      fetchProducts();
    } catch (err) {
      console.error("Error marking in stock:", err);
    }
  };

  // 🔹 Mark Out of Stock
  const markOutOfStock = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/products/${id}/out-of-stock`);
      fetchProducts();
    } catch (err) {
      console.error("Error marking out of stock:", err);
    }
  };

  // 🔹 Delete product
const deleteProduct = async (id) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts(); // refresh the list
  } catch (err) {
    console.error("Error deleting product:", err);
    alert("Failed to delete product. Please try again.");
  }
};


  return (
    <div className="dashboard light">
      <h1 className="dashboard-title">🌾 Farmer Dashboard</h1>

      {/* Stats */}
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
            <button
              className="add-product-btn"
              onClick={() => navigate("/add-product")}
            >
              ➕ Add Product
            </button>
          </div>

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
                  <td><img src={p.imageUrl} alt={p.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}/></td>
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
                        if (e.target.value === "edit") {
                          navigate(`/edit-product/${p._id}`); // 🔹 To implement later
                        }
                        if (e.target.value === "delete") { deleteProduct(p._id); }
                        e.target.value = ""; // reset select
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
        </div>

        {/* Orders Section (kept as sample) */}
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
                  <td colSpan="4" style={{ textAlign: "center" }}>No orders found</td>
                </tr>
              ) : (
                flattenedOrders.map((o, index) => (
                  <tr key={`${o.orderId}-${index}`}>
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
