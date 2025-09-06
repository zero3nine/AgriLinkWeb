import React, { useState } from "react";
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
  const [products, setProducts] = useState([
    { id: 1, name: "Tomatoes", price: 200, stock: 50, status: "In Stock" },
    { id: 2, name: "Cabbage", price: 150, stock: 30, status: "In Stock" },
    { id: 3, name: "Carrots", price: 180, stock: 40, status: "In Stock" },
  ]);

  const statusOptions = [
    "In Stock",
    "Low Stock", 
    "Out of Stock",
    "Coming Soon",
    "Discontinued"
  ];

  const updateProductStatus = (productId, newStatus) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, status: newStatus }
          : product
      )
    );
  };

  const [orders, setOrders] = useState([
    { id: 1, buyer: "John Doe", product: "Tomatoes", qty: 5, status: "Pending", date: "2024-01-15", amount: 1000 },
    { id: 2, buyer: "Jane Smith", product: "Cabbage", qty: 2, status: "Pending", date: "2024-01-14", amount: 300 },
    { id: 3, buyer: "Michael Lee", product: "Carrots", qty: 10, status: "Ready", date: "2024-01-13", amount: 1800 },
    { id: 4, buyer: "Sarah Wilson", product: "Tomatoes", qty: 8, status: "Pending", date: "2024-01-12", amount: 1600 },
    { id: 5, buyer: "David Brown", product: "Cabbage", qty: 3, status: "Ready", date: "2024-01-11", amount: 450 },
  ]);

  const orderStatusOptions = [
    "Pending",
    "Ready"
  ];

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const analyticsData = [
    { name: "Tomatoes", sold: 120 },
    { name: "Cabbage", sold: 80 },
    { name: "Carrots", sold: 150 },
  ];

  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const pendingOrders = orders.filter(order => order.status === "Pending").length;
  const completedOrders = orders.filter(order => order.status === "Ready").length;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">🌾 Farmer Dashboard</h1>

      {/* Top Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          📦 Total Products 
          <span>{products.length}</span>
        </div>
        <div className="stat-card">
          🛒 Orders Received 
          <span>{orders.length}</span>
        </div>
        <div className="stat-card">
          ⏳ Pending Orders 
          <span>{pendingOrders}</span>
        </div>
        <div className="stat-card">
          ✅ Completed Orders 
          <span>{completedOrders}</span>
        </div>
        <div className="stat-card">
          💰 Total Revenue 
          <span>Rs. {totalRevenue.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          📊 Avg Order Value 
          <span>Rs. {Math.round(totalRevenue / orders.length).toLocaleString()}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="main-grid">
         {/* Products */}
         <div className="section">
           <h2>🌱 My Listings</h2>
           <table>
             <thead>
               <tr>
                 <th>Product</th>
                 <th>Price (LKR)</th>
                 <th>Stock (kg)</th>
                 <th>Status</th>
                 <th>Action</th>
               </tr>
             </thead>
             <tbody>
               {products.map((p) => (
                 <tr key={p.id}>
                   <td>{p.name}</td>
                   <td>Rs. {p.price.toLocaleString()}</td>
                   <td>{p.stock}</td>
                   <td>
                     <span className={`status-${p.status.toLowerCase().replace(' ', '-')}`}>
                       {p.status}
                     </span>
                   </td>
                   <td>
                     <select 
                       value={p.status} 
                       onChange={(e) => updateProductStatus(p.id, e.target.value)}
                       className="status-select"
                     >
                       {statusOptions.map(option => (
                         <option key={option} value={option}>
                           {option}
                         </option>
                       ))}
                     </select>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>

         {/* Orders */}
         <div className="section">
           <h2>📋 Orders Received</h2>
           <table>
             <thead>
               <tr>
                 <th>Buyer</th>
                 <th>Product</th>
                 <th>Qty</th>
                 <th>Amount</th>
                 <th>Date</th>
                 <th>Status</th>
                 <th>Action</th>
               </tr>
             </thead>
             <tbody>
               {orders.map((o) => (
                 <tr key={o.id}>
                   <td>{o.buyer}</td>
                   <td>{o.product}</td>
                   <td>{o.qty} kg</td>
                   <td>Rs. {o.amount.toLocaleString()}</td>
                   <td>{o.date}</td>
                   <td>
                     <span className={`status-${o.status.toLowerCase()}`}>
                       {o.status}
                     </span>
                   </td>
                   <td>
                     <select 
                       value={o.status} 
                       onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                       className="order-status-select"
                     >
                       {orderStatusOptions.map(option => (
                         <option key={option} value={option}>
                           {option}
                         </option>
                       ))}
                     </select>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>

      {/* Analytics */}
      <div className="section analytics">
        <h2>📊 Best-Selling Products</h2>
         <ResponsiveContainer width="100%" height={300}>
           <BarChart data={analyticsData}>
             <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
             <XAxis dataKey="name" stroke="#6b7280" />
             <YAxis stroke="#6b7280" />
             <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", color: "#374151", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} />
             <Bar dataKey="sold" fill="#059669" />
           </BarChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SellerDashboard;
