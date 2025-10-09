require('dotenv').config({ path: '.backend/.env', debug: true });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");
const Order = require("../models/Order");

const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: "We couldn't process your payment right now. Please check your card details or try again later." });
  }
};

const recordPayment = async (req, res) => {
  try {
    const { order, buyerId, amount, method, transactionId, status } = req.body;

    const newPayment = new Payment({
      order,
      buyer: buyerId,
      amount,
      method,
      transactionId,
      status,
    });

    const savedPayment = await newPayment.save();

    //Link payment with order
    await Order.findByIdAndUpdate(order, { payment: savedPayment._id });

    res.status(201).json(savedPayment);
  } catch (error) {
    console.error("Error recording payment:", error);
    res.status(500).json({ message: "Payment recording failed" });
  }
};

module.exports = { createPaymentIntent, recordPayment };