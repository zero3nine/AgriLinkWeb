import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/dashboard.css";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);

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

  // Filter products based on search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open fullscreen view when clicking product card
  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setSelectedQty(1);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  // Add product to cart from fullscreen
  const addToCart = () => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === selectedProduct._id);
      if (existing) {
        return prev.map((p) =>
          p.id === selectedProduct._id
            ? { ...p, qty: selectedQty }
            : p
        );
      }
      return [...prev, { id: selectedProduct._id, ...selectedProduct, qty: selectedQty }];
    });
    setSelectedProduct(null);
  };

  // Confirm adding to cart
  const confirmAddToCart = () => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === selectedProduct._id);
      if (existing) {
        return prev.map((p) =>
          p.id === selectedProduct._id
            ? { ...p, qty: selectedQty }
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
        buyerName // Replace with actual user if auth implemented
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
        {filteredProducts.length === 0 ? (
          <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            No products found
          </p>
        ) : (
          filteredProducts.map((p) => (
            <div key={p._id} className="product-card">
               <div className="product-image-container"  onClick={() => openProductDetails(p)} style={{ cursor: "pointer" }}>
                {p.images && p.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000/${p.images[0]}`}
                    alt={p.name}
                    className="product-image"
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/150?text=No+Image"
                    alt="No preview available"
                    className="product-image"
                  />
                )}
              </div>
              
              <h3 onClick={() => openProductDetails(p)} style={{ cursor: "pointer" }}>{p.name}</h3>
              <p>Price: Rs. {p.price.toLocaleString()}</p>
              <p>
                Stock: {p.stock} kg{" "}
                {p.stock === 0 && (
                  <span className="status-badge out-of-stock">Out of Stock</span>
                )}
              </p>
              <button
                onClick={() => openProductDetails(p)}
                disabled={p.stock === 0}
                style={{ opacity: p.stock === 0 ? 0.6 : 1 }}
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>

      {/* 🆕 Fullscreen Product View */}
      {selectedProduct && (
        <div className="fullscreen-overlay">
          <div className="fullscreen-product">
            <div className="left">
            {selectedProduct.images?.length > 0 ? (
              <img
              src={`http://localhost:5000/${selectedProduct.images[0]}`}
              alt={selectedProduct.name}
            />
            ) : (
            <img
            src="https://via.placeholder.com/300?text=No+Image"
            alt="No preview"
            />
            )}
          </div>

        <div className="right">
        <h2>{selectedProduct.name}</h2>
        <p className="price">Rs. {selectedProduct.price.toLocaleString()}</p>
        <p className="about">
          {selectedProduct.about || "No description available."}
              </p>
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
            <button onClick={confirmOrder} style={{ marginTop: "15px" }}>
              Confirm Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;