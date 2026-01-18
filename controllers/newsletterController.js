const nodemailer = require("nodemailer");
const NewsletterSubscription = require("../models/NewsletterSubscription.models");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createTransporter = () => {
  const { MAILTRAP_HOST, MAILTRAP_PORT, MAILTRAP_USER, MAILTRAP_PASS } =
    process.env;

  if (!MAILTRAP_HOST || !MAILTRAP_PORT || !MAILTRAP_USER || !MAILTRAP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: MAILTRAP_HOST,
    port: Number(MAILTRAP_PORT),
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });
};

const subscribe = async (req, res) => {
  try {
    const { email, source } = req.body;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "A valid email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await NewsletterSubscription.findOne({
      email: normalizedEmail,
    });

    if (existing?.isActive) {
      return res.status(200).json({
        success: true,
        message: "Email already subscribed",
      });
    }

    const subscription =
      existing ||
      new NewsletterSubscription({
        email: normalizedEmail,
      });

    subscription.isActive = true;
    subscription.source = source || subscription.source;
    await subscription.save();

    const transporter = createTransporter();
    if (!transporter) {
      return res.status(201).json({
        success: true,
        message: "Subscribed successfully (email not configured)",
      });
    }

    const fromAddress =
      process.env.MAIL_FROM || "newsletter@carpenter.local";

    await transporter.sendMail({
      from: fromAddress,
      to: normalizedEmail,
      subject: "Thanks for subscribing",
      text:
        "You have been subscribed to our newsletter. Stay tuned for updates!",
    });

    return res.status(201).json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        message: "Email already subscribed",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error subscribing to newsletter",
      error: error.message,
    });
  }
};

module.exports = {
  subscribe,
};
