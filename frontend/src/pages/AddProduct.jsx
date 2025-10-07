import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/addProduct.css";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    stockStatus: "In Stock",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("stockStatus", formData.stockStatus);
    if (image) {
      data.append("image", image);
    }

    try {
      // send product data to backend API
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      // once added, redirect to seller dashboard
      navigate("/seller-home");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-card">
        <h1>➕ Add New Product</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="add-product-form">
          <label>
            Product Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Price (LKR):
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Stock Quantity:
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Stock Status:
            <select
              name="stockStatus"
              value={formData.stockStatus}
              onChange={handleChange}
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </label>

          <label>
            Product Image:
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Product"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/seller-home")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
