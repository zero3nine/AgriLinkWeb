import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/dashboardHome.css";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [showCart, setShowCart] = useState(false);

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data.filter((p) => p.stock > 0));
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCartPopup = (product) => {
    setSelectedProduct(product);
    setSelectedQty(1);
  };

  const confirmAddToCart = () => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === selectedProduct._id);
      if (existing) {
        return prev.map((p) =>
          p.id === selectedProduct._id ? { ...p, qty: p.qty + selectedQty } : p
        );
      }
      return [...prev, { id: selectedProduct._id, ...selectedProduct, qty: selectedQty }];
    });
    setSelectedProduct(null);
  };

  const deleteCartItem = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const confirmOrder = () => {
    navigate("/payment", {
      state: {
        cart,
        totalAmount,
        buyerName: username,
        userId,
      },
    });
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <h1 className="dashboard-title">Consumer Dashboard</h1>
        <div className="cart-container">
          <button className="cart-btn" onClick={() => setShowCart(true)}>
            <span className="cart-icon">🛒</span>
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </button>
        </div>
      </header>

      {/* Search */}
      <div style={{ marginBottom: "30px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {products
          .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((p) => (
            <div key={p._id} className="product-card">
              <img src={p.imageUrl} alt={p.name} className="product-img" />
              <h3>{p.name}</h3>
              <p>Rs. {p.price.toLocaleString()}</p>
              <button
                className="add-btn"
                onClick={() => handleAddToCartPopup(p)}
                disabled={p.stock === 0}
              >
                Add to Cart
              </button>
            </div>
          ))}
      </div>

      {/* Quantity Modal */}
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
              <button onClick={confirmAddToCart}>Add</button>
              <button onClick={() => setSelectedProduct(null)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Cart Popup */}
      {showCart && (
        <div className="cart-overlay" onClick={() => setShowCart(false)}>
          <div
            className="cart-popup"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <div className="cart-header">
              <h2>Your Cart</h2>
              <button className="close-cart" onClick={() => setShowCart(false)}>
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="empty-cart">Your cart is empty.</p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <img src={item.imageUrl} alt={item.name} />
                      <div>
                        <h4>{item.name}</h4>
                        <p>{item.qty} kg × Rs. {item.price}</p>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => deleteCartItem(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <p className="cart-total">Total: Rs. {totalAmount.toLocaleString()}</p>
                  {!username || role !== "buyer" ? (
                    <p className="auth-warning">⚠️ Please sign in as a buyer.</p>
                  ) : (
                    <button className="confirm-btn" onClick={confirmOrder}>
                      Confirm Order
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
