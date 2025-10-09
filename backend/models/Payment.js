const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true, // links this payment to an order
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // who paid
  },
  amount: {
    type: Number,
    required: true, // amount in your currency units (e.g. LKR)
  },
  method: {
    type: String,
    enum: ["card", "paypal", "cod", "wallet"],
    default: "card",
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed", "refunded"],
    default: "pending",
  },
  transactionId: {
    type: String, // provider transaction id (Stripe paymentIntent id)
  },
  providerResponse: {
    type: mongoose.Schema.Types.Mixed, // raw provider response if you want to store it
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);