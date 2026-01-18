const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    label: {
      type: String,
      trim: true,
      maxLength: 50,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    phone: {
      type: String,
      trim: true,
      maxLength: 30,
    },
    line1: {
      type: String,
      required: true,
      trim: true,
      maxLength: 120,
    },
    line2: {
      type: String,
      trim: true,
      maxLength: 120,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxLength: 80,
    },
    state: {
      type: String,
      trim: true,
      maxLength: 80,
    },
    postalCode: {
      type: String,
      trim: true,
      maxLength: 20,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      maxLength: 80,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

addressSchema.index({ user: 1, isDefault: -1 });

module.exports = mongoose.model("Address", addressSchema);
