const mongoose = require("mongoose");

const compareItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

compareItemSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("CompareItem", compareItemSchema);
