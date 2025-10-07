const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  stockStatus: { type: String, enum: ["In Stock", "Out of Stock"], default: "In Stock" },
  imageUrl: { type: String }, // URL of the product image
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
