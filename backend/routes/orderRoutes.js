const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); 
const Product = require("../models/Product");

router.post("/", async (req, res) => {
  const { items, totalAmount, buyerName } = req.body;
  try {
    const newOrder = await Order.create({
      items,
      totalAmount,
      buyerName,
      status: "Pending",
      createdAt: new Date(),
    });

    // Update stock levels for each product
    for (const item of items) {
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
    const orders = await Order.find(); // fetch all orders
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
