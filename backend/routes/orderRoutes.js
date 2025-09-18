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
      await Product.findByIdAndUpdate(item.id, {
        $inc: { stock: -item.qty }, // subtract purchased quantity
      });
    }
    
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
