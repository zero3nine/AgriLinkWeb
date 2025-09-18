import React, { useState } from "react";
import "../styles/dashboard.css";

function HomePage() {
  const [products] = useState([
    { id: 1, name: "Tomatoes", price: 200, stock: 50 },
    { id: 2, name: "Cabbage", price: 150, stock: 30 },
    { id: 3, name: "Carrots", price: 180, stock: 40 },
    { id: 4, name: "Onions", price: 220, stock: 20 },
  ]);

  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">🛒 Consumer Dashboard</h1>

      {/* Product Grid */}
      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <h3>{p.name}</h3>
            <p>Price: Rs. {p.price.toLocaleString()}</p>
            <p>Stock: {p.stock} kg</p>
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      <div className="section cart-section">
        <h2>🛍️ My Cart</h2>
        {cart.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>Rs. {item.price.toLocaleString()}</td>
                  <td>Rs. {(item.price * item.qty).toLocaleString()}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" style={{ fontWeight: "bold" }}>
                  Grand Total
                </td>
                <td style={{ fontWeight: "bold" }}>
                  Rs. {totalAmount.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default HomePage;
