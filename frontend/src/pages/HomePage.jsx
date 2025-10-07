import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/dashboard.css";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data.filter((p) => p.stock > 0)); // only show in-stock products
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);


  // Open quantity modal
  const handleAddToCartPopup = (product) => {
    setSelectedProduct(product);
    setSelectedQty(1);
  };

  // Confirm adding to cart
  const confirmAddToCart = () => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === selectedProduct._id);
      if (existing) {
        return prev.map((p) =>
          p.id === selectedProduct._id
            ? { ...p, qty: p.qty + selectedQty }
            : p
        );
      }
      return [...prev, { id: selectedProduct._id, ...selectedProduct, qty: selectedQty }];
    });
    setSelectedProduct(null);
  };

  const deleteCartItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const fetchProducts = async () => {
  const res = await axios.get("http://localhost:5000/api/products");
  setProducts(res.data);
  };

  const confirmOrder = async () => {
    try {
      await axios.post("http://localhost:5000/api/orders", {
        items: cart,
        totalAmount,
        buyerName: username, // Replace with actual user if auth implemented
      });
      alert("Order confirmed!");
      setCart([]);
      await fetchProducts(); // refresh product list to update stock
    } catch (err) {
      console.error("Error confirming order:", err);
    }
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">🛒 Consumer Dashboard</h1>

      {/* Search Bar */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 12px",
            width: "250px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {products
          .filter((p) => p.stock > 0 && p.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((p) => (
            <div key={p._id} className="product-card">
              <img
                src={p.imageUrl}
                alt={p.name}
                style={{ width: "180px", height: "180px", objectFit: "cover", borderRadius: "8px" }}
              />
              <h3>{p.name}</h3>
              <p>Price: Rs. {p.price.toLocaleString()}</p>
              <p>
                Stock: {p.stock} kg{" "}
                {p.stock === 0 && (
                  <span className="status-badge out-of-stock">Out of Stock</span>
                )}
              </p>
              <button
                onClick={() => handleAddToCartPopup(p)}
                disabled={p.stock === 0}
                style={{ opacity: p.stock === 0 ? 0.6 : 1 }}
              >
                Add to Cart
              </button>
            </div>
          ))}
      </div>


      {/* Quantity Selection Modal */}
      {selectedProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{selectedProduct.name}</h3>
            <p>Price: Rs. {selectedProduct.price.toLocaleString()}</p>
            <label>
              Quantity: {selectedQty} kg
              <input
                type="range"
                min="0.1"
                step="0.1"
                max={selectedProduct.stock}
                value={selectedQty}
                onChange={(e) => setSelectedQty(parseFloat(e.target.value))}
              />
            </label>
            <div className="modal-actions">
              <button onClick={confirmAddToCart}>Add to Cart</button>
              <button onClick={() => setSelectedProduct(null)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Section */}
      <div className="section cart-section">
        <h2>🛍️ My Cart</h2>
        {cart.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.qty} kg</td>
                    <td>Rs. {item.price.toLocaleString()}</td>
                    <td>Rs. {(item.price * item.qty).toLocaleString()}</td>
                    <td>
                      <button className="delete-btn" onClick={() => deleteCartItem(item.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3" style={{ fontWeight: "bold" }}>
                    Grand Total
                  </td>
                  <td style={{ fontWeight: "bold" }}>Rs. {totalAmount.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            {!username || role !== "buyer" ? (
              <>
                <p className="auth-warning">
                  ⚠️ Please sign in as a buyer to confirm orders.
                </p>
                <button className="confirm-btn disabled" disabled>
                  Confirm Order
                </button>
              </>
            ) : (
              <button className="confirm-btn" onClick={confirmOrder}>
                Confirm Order
              </button>
            )}

          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
