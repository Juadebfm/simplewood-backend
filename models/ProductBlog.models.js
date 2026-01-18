const mongoose = require("mongoose");

const productBlogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 120,
    },
    excerpt: {
      type: String,
      trim: true,
      maxLength: 300,
    },
    content: {
      type: String,
      required: true,
      maxLength: 20000,
    },
    contentFormat: {
      type: String,
      enum: ["markdown", "html", "text"],
      default: "markdown",
    },
    heroImage: {
      url: {
        type: String,
      },
      alt: {
        type: String,
        default: "",
      },
    },
    images: [
      {
        url: {
          type: String,
        },
        alt: {
          type: String,
          default: "",
        },
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

productBlogSchema.index({ product: 1 }, { unique: true });
productBlogSchema.index({ title: 1 });

module.exports = mongoose.model("ProductBlog", productBlogSchema);
