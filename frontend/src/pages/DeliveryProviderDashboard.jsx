import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/dashboardDelivery.css";

function DeliveryProviderDashboard() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const deliveryId = localStorage.getItem("userId"); // logged-in delivery provider

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Fetch all orders
      const res = await axios.get("http://localhost:5000/api/orders?_expand=payment");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${orderId}`, {
        status: newStatus,
        deliveryId: newStatus === "Accepted" ? deliveryId : undefined,
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const renderPaymentStatus = (order) => {
    if (!order.payment) return "Unknown";
    if (order.payment.method === "cod") {
      if (order.status === "Done") return "Paid on Delivery";
      return "Pay on Arrival";
    }
    if (order.payment.status === "success") return "Paid (Card)";
    if (order.payment.status === "pending") return "Pending Payment";
    if (order.payment.status === "failed") return "Failed";
    return "Unknown";
  };

  // Orders categorization
  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const acceptedOrders = orders.filter(
    (o) => o.status === "Accepted" && o.deliveryId === deliveryId
  );
  const completedOrders = orders.filter(
    (o) => o.status === "Done" && o.deliveryId === deliveryId
  );

  // Filter completed orders by search
  const filteredCompleted = completedOrders.filter(
    (o) =>
      o.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.items.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="dashboard delivery-dashboard">
      <h1 className="dashboard-title">🚚 Delivery Provider Dashboard</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "ongoing" ? "active" : ""}
          onClick={() => setActiveTab("ongoing")}
        >
          Ongoing Orders
        </button>
        <button
          className={activeTab === "completed" ? "active" : ""}
          onClick={() => setActiveTab("completed")}
        >
          Completed Orders
        </button>
      </div>

      {/* ONGOING TAB */}
      {activeTab === "ongoing" && (
        <div className="ongoing-section">
          {/* Pending Orders */}
          <div className="order-column">
            <h2>📦 Pending Orders</h2>
            {pendingOrders.length === 0 ? (
              <p>No pending orders</p>
            ) : (
              pendingOrders.map((o) => (
                <div
                  key={o._id}
                  className="order-card"
                  onClick={() => setSelectedOrder(o)}
                >
                  <h3>{o.buyerName}</h3>
                  <p>Total: Rs. {o.totalAmount.toLocaleString()}</p>
                  <p>{renderPaymentStatus(o)}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(o._id, "Accepted");
                    }}
                  >
                    Accept
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Accepted / Awaiting Delivery */}
          <div className="order-column">
            <h2>🚚 Awaiting Delivery</h2>
            {acceptedOrders.length === 0 ? (
              <p>No orders accepted yet</p>
            ) : (
              acceptedOrders.map((o) => (
                <div
                  key={o._id}
                  className="order-card"
                  onClick={() => setSelectedOrder(o)}
                >
                  <h3>{o.buyerName}</h3>
                  <p>Total: Rs. {o.totalAmount.toLocaleString()}</p>
                  <p>{renderPaymentStatus(o)}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(o._id, "Done");
                    }}
                  >
                    Mark as Done
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* COMPLETED TAB */}
      {activeTab === "completed" && (
        <div className="completed-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by buyer or item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredCompleted.length === 0 ? (
            <p>No completed orders found</p>
          ) : (
            <div className="completed-list">
              {filteredCompleted.map((o) => (
                <div
                  key={o._id}
                  className="completed-card"
                  onClick={() => setSelectedOrder(o)}
                >
                  <h3>{o.buyerName}</h3>
                  <p>Total: Rs. {o.totalAmount.toLocaleString()}</p>
                  <p>{renderPaymentStatus(o)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Order Modal */}
      {selectedOrder && (
        <div className="order-modal" onClick={() => setSelectedOrder(null)}>
          <div
            className="order-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setSelectedOrder(null)}>
              ✖
            </button>
            <h2>Order Details</h2>
            <p>
              <strong>Buyer:</strong> {selectedOrder.buyerName}
            </p>
            <p>
              <strong>Total:</strong> Rs. {selectedOrder.totalAmount.toLocaleString()}
            </p>
            <p>
              <strong>Payment:</strong> {renderPaymentStatus(selectedOrder)}
            </p>
            <h3>Items:</h3>
            <div className="item-gallery">
              {selectedOrder.items.map((i) => (
                <div key={i.id} className="item-card">
                  <img src={i.imageUrl || "/placeholder.jpg"} alt={i.name} />
                  <p>{i.name}</p>
                  <span>{i.qty} kg</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeliveryProviderDashboard;
