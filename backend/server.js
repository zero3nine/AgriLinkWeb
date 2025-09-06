require('dotenv').config(); // <-- just this
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Imports
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple API route
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello World from Express + MongoDB Atlas!" });
});

app.use("/api/auth", authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Atlas connected"))
.catch(err => console.log("❌ MongoDB connection error:", err));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
