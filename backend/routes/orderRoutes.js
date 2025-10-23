const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

// CREATE new order
router.post("/", async (req, res) => {
  const { items, totalAmount, buyerName } = req.body;

  try {
    // Attach image URLs from Product model
    const itemsWithImages = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.id);
        if (!product) {
          throw new Error(`Product not found: ${item.id}`);
        }

        return {
          id: product._id,
          name: product.name,
          price: product.price,
          qty: item.qty,
          imageUrl: product.imageUrl || "",
          sellerId: product.sellerId,
        };
      })
    );

    // Create order
    const newOrder = await Order.create({
      items: itemsWithImages,
      totalAmount,
      buyerName,
      status: "Pending",
      deliveryId: null, // default to no delivery provider assigned
      createdAt: new Date(),
    });

    // Update stock levels
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

// PATCH order status and assign delivery provider
router.patch("/:id", async (req, res) => {
  const { status, deliveryId } = req.body; // deliveryId is optional

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;

    // If status is Accepted and deliveryId provided, assign delivery provider
    if (status === "Accepted" && deliveryId) {
      order.deliveryId = deliveryId;
    }

    // Optionally clear deliveryId if order goes back to Pending
    if (status === "Pending") {
      order.deliveryId = null;
    }

    await order.save();
    res.json(order);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET all orders (optional filter by status or delivery provider)
router.get("/", async (req, res) => {
  try {
    const { status, deliveryId } = req.query;
    let query = {};

    if (status) query.status = status;
    if (deliveryId) query.deliveryId = deliveryId;

    const orders = await Order.find(query).populate("payment").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET orders for a specific seller
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    const sellerOrders = await Order.find({
      "items.sellerId": sellerId,
    }).sort({ createdAt: -1 });

    res.json(sellerOrders);
  } catch (err) {
    console.error("Error fetching seller orders:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET orders for a specific delivery provider
router.get("/delivery/:deliveryId", async (req, res) => {
  try {
    const deliveryId = req.params.deliveryId;

    const deliveryOrders = await Order.find({
      deliveryId,
    }).sort({ createdAt: -1 });

    res.json(deliveryOrders);
  } catch (err) {
    console.error("Error fetching delivery provider orders:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
