const mongoose = require("mongoose");
const Product = require("../models/Product.models");
const ProductBlog = require("../models/ProductBlog.models");

const getProductBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Product ID" });
    }

    const product = await Product.findById(id).select("_id isActive");
    if (!product || !product.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }

    const blog = await ProductBlog.findOne({ product: id }).populate(
      "createdBy",
      "name email"
    );

    if (!blog || !blog.isPublished) {
      return res.status(404).json({
        success: false,
        message: "Blog content not found",
      });
    }

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blog content",
      error: error.message,
    });
  }
};

const createProductBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      contentFormat,
      heroImage,
      images,
      isPublished,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Product ID" });
    }

    const product = await Product.findById(id).select("_id isActive");
    if (!product || !product.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const blog = await ProductBlog.findOneAndUpdate(
      { product: product._id },
      {
        $set: {
          title,
          excerpt,
          content,
          contentFormat,
          heroImage,
          images,
          isPublished,
        },
        $setOnInsert: {
          product: product._id,
          createdBy: req.user?._id,
        },
      },
      { new: true, upsert: true, runValidators: true }
    ).populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Blog content saved",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving blog content",
      error: error.message,
    });
  }
};

const updateProductBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Product ID" });
    }

    const product = await Product.findById(id).select("_id isActive");
    if (!product || !product.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }

    const blog = await ProductBlog.findOneAndUpdate(
      { product: product._id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog content not found",
      });
    }

    res.json({
      success: true,
      message: "Blog content updated",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating blog content",
      error: error.message,
    });
  }
};

module.exports = {
  getProductBlog,
  createProductBlog,
  updateProductBlog,
};
