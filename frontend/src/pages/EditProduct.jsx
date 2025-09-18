import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/addProduct.css"; // reuse styles

function EditProduct() {
  const { id } = useParams(); // product id from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    stockStatus: "In Stock",
  });

  // Fetch product on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setFormData({
          name: res.data.name,
          price: res.data.price,
          stock: res.data.stock,
          stockStatus: res.data.stockStatus,
        });
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, formData);
      navigate("/seller-home"); // redirect back to dashboard
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-card">
        <h1>✏️ Edit Product</h1>
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

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Save Changes
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

export default EditProduct;
