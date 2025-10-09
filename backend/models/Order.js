const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      qty: { type: Number, required: true }, // decimal quantities allowed
    },
  ],
  totalAmount: { type: Number, required: true },
  buyerName: { type: String, required: true },
  status: { type: String, default: "Pending" }, 
  createdAt: { type: Date, default: Date.now },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" }, createdAt: { type:Date, default:Date.now},
});

module.exports = mongoose.model("Order", orderSchema);
