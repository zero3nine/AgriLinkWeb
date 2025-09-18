import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import "../styles/dashboard.css";

function SellerDashboard() {
  const [products, setProducts] = useState([
    { id: 1, name: "Tomatoes", price: 200, stock: 50, stockStatus: "In Stock" },
    { id: 2, name: "Cabbage",  price: 150, stock: 30, stockStatus: "In Stock" },
    { id: 3, name: "Carrots",  price: 180, stock: 40, stockStatus: "In Stock" },
  ]);

  const [orders, setOrders] = useState([
    { id: 1, buyer: "John Doe",   product: "Tomatoes", qty: 5,  status: "Pending" },
    { id: 2, buyer: "Jane Smith", product: "Cabbage",  qty: 2,  status: "Pending" },
    { id: 3, buyer: "Michael Lee",product: "Carrots",  qty: 10, status: "Ready"   },
  ]);

  // State for dropdown visibility
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Product actions
  const handleProductAction = (productId, action) => {
    switch (action) {
      case 'edit':
        // Handle edit product
        console.log('Edit product:', productId);
        break;
      case 'delete':
        setProducts(prev => prev.filter(p => p.id !== productId));
        break;
      case 'updateStock':
        const newStock = prompt('Enter new stock quantity:');
        if (newStock && !isNaN(newStock)) {
          setProducts(prev => prev.map(p => 
            p.id === productId ? { ...p, stock: parseInt(newStock) } : p
          ));
        }
        break;
      case 'inStock':
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, stockStatus: "In Stock" } : p
        ));
        break;
      case 'outOfStock':
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, stockStatus: "Out of Stock" } : p
        ));
        break;
      default:
        break;
    }
    setActiveDropdown(null);
  };

  // Order actions
  const handleOrderAction = (orderId, action) => {
    switch (action) {
      case 'markPending':
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Pending" } : o));
        break;
      case 'markReady':
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Ready" } : o));
        break;
      case 'markShipped':
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Shipped" } : o));
        break;
      case 'cancelOrder':
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Cancelled" } : o));
        break;
      default:
        break;
    }
    setActiveDropdown(null);
  };

  const markAsReady = (id) =>
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "Ready" } : o));

  const analyticsData = [
    { name: "Tomatoes", sold: 120 },
    { name: "Cabbage",  sold: 80  },
    { name: "Carrots",  sold: 150 },
  ];

  return (
    <div className="dashboard light">
      <h1 className="dashboard-title">🌾 Farmer Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">📦 Total Products <span>{products.length}</span></div>
        <div className="stat-card">🛒 Orders Received <span>{orders.length}</span></div>
        <div className="stat-card">
          ✅ Completed Orders <span>{orders.filter(o=>o.status==="Ready").length}</span>
        </div>
      </div>

      <div className="main-grid">
        <div className="section">
          <h2>My Listings</h2>
          <table>
            <thead>
              <tr><th>Product</th><th>Price (LKR)</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map(p=>(
                <tr key={p.id}>
                  <td>{p.name}</td><td>{p.price}</td><td>{p.stock}</td>
                  <td>
                    <span className={`status-badge ${p.stockStatus === 'In Stock' ? 'in-stock' : 'out-of-stock'}`}>
                      {p.stockStatus}
                    </span>
                  </td>
                  <td>
                    <div className="dropdown-container">
                      <button 
                        className="dropdown-toggle"
                        onClick={() => setActiveDropdown(activeDropdown === `product-${p.id}` ? null : `product-${p.id}`)}
                      >
                        Actions ▼
                      </button>
                      {activeDropdown === `product-${p.id}` && (
                        <div className="dropdown-menu">
                          <button onClick={() => handleProductAction(p.id, 'edit')}>Edit Product</button>
                          <button onClick={() => handleProductAction(p.id, 'updateStock')}>Update Stock</button>
                          <button onClick={() => handleProductAction(p.id, 'inStock')}>Mark In Stock</button>
                          <button onClick={() => handleProductAction(p.id, 'outOfStock')}>Mark Out of Stock</button>
                          <button onClick={() => handleProductAction(p.id, 'delete')} className="delete-btn">Delete</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="section">
          <h2>Orders Received</h2>
          <table>
            <thead>
              <tr><th>Buyer</th><th>Product</th><th>Qty</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {orders.map(o=>(
                <tr key={o.id}>
                  <td>{o.buyer}</td><td>{o.product}</td><td>{o.qty}</td><td>{o.status}</td>
                  <td>
                    <div className="dropdown-container">
                      <button 
                        className="dropdown-toggle"
                        onClick={() => setActiveDropdown(activeDropdown === `order-${o.id}` ? null : `order-${o.id}`)}
                      >
                        Actions ▼
                      </button>
                      {activeDropdown === `order-${o.id}` && (
                        <div className="dropdown-menu">
                          <button onClick={() => handleOrderAction(o.id, 'markPending')}>Mark Pending</button>
                          <button onClick={() => handleOrderAction(o.id, 'markReady')}>Mark Ready</button>
                          <button onClick={() => handleOrderAction(o.id, 'markShipped')}>Mark Shipped</button>
                          {o.status !== "Shipped" && o.status !== "Cancelled" && (
                            <button onClick={() => handleOrderAction(o.id, 'cancelOrder')} className="cancel-btn">Cancel Order</button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section analytics">
        <h2>📊 Best-Selling Products</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", color: "#333", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }} />
            <Bar dataKey="sold" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default SellerDashboard;
