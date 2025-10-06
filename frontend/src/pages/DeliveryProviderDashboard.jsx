import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/dashboard.css";

function DeliveryProviderDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${orderId}`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Filter orders by status
  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const acceptedOrders = orders.filter((o) => o.status === "Accepted");
  const completedOrders = orders.filter((o) => o.status === "Done");

  return (
    <div className="dashboard delivery-dashboard">
      <h1 className="dashboard-title">🚚 Delivery Provider Dashboard</h1>

      {/* Pending Orders */}
      <div className="section">
        <h2>📦 Pending Orders</h2>
        {pendingOrders.length === 0 ? (
          <p>No pending orders</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Buyer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((o) => (
                <tr key={o._id}>
                  <td>{o.buyerName}</td>
                  <td>
                    {o.items.map((i) => (
                      <div key={i.id}>
                        {i.name} - {i.qty} kg
                      </div>
                    ))}
                  </td>
                  <td>Rs. {o.totalAmount.toLocaleString()}</td>
                  <td>
                    <button onClick={() => updateStatus(o._id, "Accepted")}>
                      Accept
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Accepted Orders */}
      <div className="section">
        <h2>🚚 Awaiting Delivery</h2>
        {acceptedOrders.length === 0 ? (
          <p>No orders accepted yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Buyer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {acceptedOrders.map((o) => (
                <tr key={o._id}>
                  <td>{o.buyerName}</td>
                  <td>
                    {o.items.map((i) => (
                      <div key={i.id}>
                        {i.name} - {i.qty} kg
                      </div>
                    ))}
                  </td>
                  <td>Rs. {o.totalAmount.toLocaleString()}</td>
                  <td>
                    <button onClick={() => updateStatus(o._id, "Done")}>
                      Done
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Completed Orders */}
      <div className="section">
        <h2>✅ Completed Orders</h2>
        {completedOrders.length === 0 ? (
          <p>No completed orders yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Buyer</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {completedOrders.map((o) => (
                <tr key={o._id}>
                  <td>{o.buyerName}</td>
                  <td>
                    {o.items.map((i) => (
                      <div key={i.id}>
                        {i.name} - {i.qty} kg
                      </div>
                    ))}
                  </td>
                  <td>Rs. {o.totalAmount.toLocaleString()}</td>
                </tr>
              ))}ll
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DeliveryProviderDashboard;
