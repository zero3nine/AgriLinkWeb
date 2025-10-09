const express = require("express");
const router = express.Router();

// Import the functions from the controller
const {
  createPaymentIntent,
  recordPayment,
} = require("../controllers/paymentController");

// Define routes
router.get("/public-key", (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

router.post("/create-intent", createPaymentIntent);
router.post("/record", recordPayment);

module.exports = router;