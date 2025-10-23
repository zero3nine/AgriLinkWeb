const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const { cloudinary, storage } = require("../config/cloudinary");

const upload = multer({ storage });

// add new product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, stock, stockStatus, sellerId } = req.body;

    const product = new Product({
      name,
      price,
      stock,
      stockStatus,
      sellerId, 
      imageUrl: req.file ? req.file.path : null, // store image URL from Cloudinary
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// fetch products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// fetch products by sellerId - placed before product id filtering
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await Product.find({ sellerId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch seller products" });
  }
});

// fetch unique product by id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



//update stock levels
router.put("/:id", async (req, res) => {
  try {
    const { name, price, stock, stockStatus } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, stock, stockStatus },
      { new: true } // return updated doc
    );

    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// marked as 'in stock' 
router.patch("/:id/in-stock", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { stockStatus: "In Stock" },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark in stock" });
  }
});

// marked as 'out of stock'
router.patch("/:id/out-of-stock", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { stockStatus: "Out of Stock" },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark out of stock" });
  }
});

// Update product
router.put("/:id", async (req, res) => {
  const { name, price, stock, stockStatus } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, stock, stockStatus },
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});


module.exports = router;
