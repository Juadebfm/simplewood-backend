const mongoose = require("mongoose");

const newsletterSubscriptionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      trim: true,
      maxLength: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "NewsletterSubscription",
  newsletterSubscriptionSchema
);
