const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); 
const Product = require("../models/Product");
const User = require("../models/User"); //For linking users

router.post("/", async (req, res) => {
  const { items, totalAmount, buyerId, buyerName } = req.body;
  try {
    const newOrder = await Order.create({
      items,
      totalAmount,
      buyer: buyerId,
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

    const populatedOrder = await Order.findById(newOrder._id)
      .populate("buyer", "username email")
      .populate("deliveryProvider", "username email");

    res.status(201).json(populatedOrder);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH order status
router.patch("/:id", async (req, res) => {
  const { status, deliveryProviderId } = req.body;
  try {
    const updateData = { status };

    if (status === "Accepted" && deliveryProviderId) {
      updateData.deliveryProvider = deliveryProviderId;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id, updateData,
      { new: true }
    )
    .populate("buyer", "username email")
    .populate("deliveryProvider", "username email");

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find() // fetch all orders
     .populate("buyer", "username email")
     .populate("deliveryProvider", "username email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;