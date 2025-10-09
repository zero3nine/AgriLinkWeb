require('dotenv').config({ path: './backend/.env', debug: true });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//Imports
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Temporary test route to verify Stripe Secret Key
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.get("/api/test-stripe", async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve();
    res.json({ success: true, balance });
  } catch (err) {
    console.error("Stripe test failed:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Simple API route
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello World from Express + MongoDB Atlas!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", require("./routes/paymentRoutes"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Atlas connected"))
.catch(err => console.log("❌ MongoDB connection error:", err));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));