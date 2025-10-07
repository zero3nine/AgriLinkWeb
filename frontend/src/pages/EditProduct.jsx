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
    about: "",
    stockStatus: "In Stock",
  });

  // New states for image handling
  const [existingImages, setExistingImages] = useState([]); 
  const [newImages, setNewImages] = useState([]); 
  const [previewImages, setPreviewImages] = useState([]);

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
          about: res.data.about || "",
        });

        if (res.data.images) {
          setExistingImages(res.data.images); // existing images from backend
        }

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

  // Handle uploading new images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("price", parseFloat(formData.price));
      form.append("stock", parseInt(formData.stock));
      form.append("stockStatus", formData.stockStatus);
      form.append("about", formData.about || "");

      // append new images (if any)
      newImages.forEach((img) => form.append("images", img));

      // send product update request
      await axios.put(`http://localhost:5000/api/products/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/seller-home");
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-card">
        <h1>✏️ Edit Product</h1>
        <form onSubmit={handleSubmit} className="add-product-form">

          {/* 🖼️ Image Upload Section */}
          <label>
            Product Images:
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </label>

          {/* Show existing images */}
          {existingImages.length > 0 && (
            <div className="image-preview-container">
              {existingImages.map((img, index) => (
                <img
                  key={index}
                  src={img.startsWith("http") ? img : `http://localhost:5000/${img}`}
                  alt={`Existing ${index + 1}`}
                  className="image-preview"
                />
              ))}
            </div>
          )}

          {/* Show new image previews */}
          {previewImages.length > 0 && (
            <div className="image-preview-container">
              {previewImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`New Preview ${index + 1}`}
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
              placeholder="Update product description..."
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
