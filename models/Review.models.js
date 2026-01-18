const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    nickname: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxLength: 120,
    },
    review: {
      type: String,
      required: true,
      trim: true,
      maxLength: 2000,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
