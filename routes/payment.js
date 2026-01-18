const express = require("express");
const {
  createStripePaymentIntent,
  initializePaystackTransaction,
  verifyPaystackTransaction,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/stripe/intent", createStripePaymentIntent);
router.post("/paystack/initialize", initializePaystackTransaction);
router.get("/paystack/verify/:reference", verifyPaystackTransaction);

module.exports = router;
