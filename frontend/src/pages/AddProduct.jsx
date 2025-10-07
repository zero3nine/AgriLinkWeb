import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/addProduct.css";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    about: "",
    stockStatus: "In Stock",
  });

  //Store selected image files
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   // Handle file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // generate preview URLs for selected images
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!images || images.length === 0) {
    setError("Please upload at least one image before submitting.");
    setLoading(false);
    return;
    }

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("price", parseFloat(formData.price));
      form.append("stock", parseInt(formData.stock));
      form.append("stockStatus", formData.stockStatus);
      form.append("about", formData.about || "")

      // append images
      images.forEach((img) => form.append("images", img));

      // send product data to backend API
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: form,
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
          {/* New section: Image Upload */}
          <label>
            Product Image:
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="image-preview-container">
              {imagePreviews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="image-preview"
                />
              ))}
            </div>
          )}
          
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
            Product Description:
            <textarea
              name="about"
              value={formData.about || ""}
              onChange={handleChange}
              placeholder="Enter details about this product..."
              rows="3"
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
