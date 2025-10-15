const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

// CREATE new order
router.post("/", async (req, res) => {
  const { items, totalAmount, buyerName } = req.body;

  try {
    // 🧩 Attach image URLs from Product model
    const itemsWithImages = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.id);
        if (!product) {
          throw new Error(`Product not found: ${item.id}`);
        }

        // Copy product info safely
        return {
          id: product._id,
          name: product.name,
          price: product.price,
          qty: item.qty,
          imageUrl: product.imageUrl || "", // ✅ attach image here
        };
      })
    );

    // Create order
    const newOrder = await Order.create({
      items: itemsWithImages,
      totalAmount,
      buyerName,
      status: "Pending",
      createdAt: new Date(),
    });

    // 🧮 Update stock levels
    for (const item of itemsWithImages) {
      const product = await Product.findById(item.id);
      if (product) {
        const newStock = product.stock - item.qty;
        product.stock = Math.max(newStock, 0);
        product.stockStatus = newStock <= 0 ? "Out of Stock" : "In Stock";
        await product.save();
      }
    }

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH order status
router.patch("/:id", async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("payment"); // fetch all orders
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
