const mongoose = require("mongoose");
const Product = require("../models/Product.models");
const Review = require("../models/Review.models");

const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

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

    const skip = (Number(page) - 1) * Number(limit);
    const [reviews, total] = await Promise.all([
      Review.find({ product: id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("user", "name"),
      Review.countDocuments({ product: id }),
    ]);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalReviews: total,
        hasNextPage: skip + reviews.length < total,
        hasPrevPage: Number(page) > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

const createProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, summary, review, nickname } = req.body;

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

    const normalizedRating = Number(rating);
    if (!Number.isFinite(normalizedRating)) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be a number" });
    }

    const displayName = nickname?.trim() || req.user?.name || "Customer";
    const reviewData = {
      product: product._id,
      user: req.user?._id,
      nickname: displayName,
      summary,
      review,
      rating: normalizedRating,
    };

    const newReview = await Review.create(reviewData);

    const stats = await Review.aggregate([
      { $match: { product: product._id } },
      {
        $group: {
          _id: "$product",
          average: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const average = stats[0]?.average || 0;
    const count = stats[0]?.count || 0;

    await Product.findByIdAndUpdate(product._id, {
      "rating.average": average,
      "rating.count": count,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating review",
      error: error.message,
    });
  }
};

module.exports = {
  getProductReviews,
  createProductReview,
};
