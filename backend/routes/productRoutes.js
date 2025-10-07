const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");

const router = express.Router();

// Multer Setup for File Uploads
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// add new product
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { name, price, stock, stockStatus, about} = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required." });
    }

    const images = req.files.map((file) => file.path);

    const product = new Product({
      name,
      price,
      stock,
      stockStatus,
      about,
      images,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Error adding product:", err);
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

// Update Product with optional new images
router.put("/:id", upload.array("images", 10), async (req, res) => {
  try {
    const { name, price, stock, stockStatus, about } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // If new images are uploaded, append them
    let updatedImages = product.images;
    if (req.files && req.files.length > 0) {
      const newPaths = req.files.map((file) => `uploads/${file.filename}`);
      updatedImages = [...product.images, ...newPaths];
    }

    product.name = name;
    product.price = price;
    product.stock = stock;
    product.stockStatus = stockStatus;
    product.about = about;
    product.images = updatedImages;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

//update stock levels
router.put("/:id", async (req, res) => {
  try {
    const { name, price, stock, stockStatus, about } = req.body;

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
  const { name, price, stock, stockStatus, about } = req.body;
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


module.exports = router;
