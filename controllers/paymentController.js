const axios = require("axios");
const stripeLib = require("stripe");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  return stripeLib(process.env.STRIPE_SECRET_KEY);
};

const getPaystackClient = () => {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return null;
  }
  return axios.create({
    baseURL: "https://api.paystack.co",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });
};

const normalizeAmount = (amount) => {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return null;
  }
  return Math.round(numericAmount * 100);
};

const createStripePaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "usd", description, metadata, receiptEmail } =
      req.body;
    const stripe = getStripeClient();

    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: "Stripe is not configured",
      });
    }

    const amountInMinor = normalizeAmount(amount);
    if (!amountInMinor) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    if (receiptEmail && !emailRegex.test(receiptEmail)) {
      return res.status(400).json({
        success: false,
        message: "Receipt email is invalid",
      });
    }

    const intent = await stripe.paymentIntents.create({
      amount: amountInMinor,
      currency,
      description,
      metadata,
      receipt_email: receiptEmail,
      automatic_payment_methods: { enabled: true },
    });

    return res.status(201).json({
      success: true,
      data: {
        id: intent.id,
        clientSecret: intent.client_secret,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating Stripe payment intent",
      error: error.message,
    });
  }
};

const initializePaystackTransaction = async (req, res) => {
  try {
    const { email, amount, currency = "NGN", callbackUrl, metadata } = req.body;
    const paystack = getPaystackClient();

    if (!paystack) {
      return res.status(500).json({
        success: false,
        message: "Paystack is not configured",
      });
    }

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "A valid email is required",
      });
    }

    const amountInMinor = normalizeAmount(amount);
    if (!amountInMinor) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    const response = await paystack.post("/transaction/initialize", {
      email,
      amount: amountInMinor,
      currency,
      callback_url: callbackUrl || process.env.PAYSTACK_CALLBACK_URL,
      metadata,
    });

    return res.status(201).json({
      success: true,
      data: response.data.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error initializing Paystack transaction",
      error: error.response?.data?.message || error.message,
    });
  }
};

const verifyPaystackTransaction = async (req, res) => {
  try {
    const { reference } = req.params;
    const paystack = getPaystackClient();

    if (!paystack) {
      return res.status(500).json({
        success: false,
        message: "Paystack is not configured",
      });
    }

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Reference is required",
      });
    }

    const response = await paystack.get(
      `/transaction/verify/${encodeURIComponent(reference)}`
    );

    return res.json({
      success: true,
      data: response.data.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error verifying Paystack transaction",
      error: error.response?.data?.message || error.message,
    });
  }
};

module.exports = {
  createStripePaymentIntent,
  initializePaystackTransaction,
  verifyPaystackTransaction,
};
