const Product = require("../models/Product.models");
const mongoose = require("mongoose");

const getAllProducts = async (req, res) => {
  try {
    // Query the current product catelogue from the DB
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
    } = req.query;

    // filter object
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (inStock === "true") {
      filter.inStock = true;
      filter.stockQuantity = { $gt: 0 };
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // // Execute Query
    // const products = await Product.find(filter)
    //   .populate("createdBy", "name email")
    //   .sort(sort)
    //   .skip(skip)
    //   .limit(Number(limit));

    // // get total counts for pagination
    // const total = await Product.countDocuments(filter);

    // Replace those two lines with this:
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("createdBy", "name email")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalProducts: total,
        hasNextPage: skip + products.length < total,
        hasPrevPage: Number(page) > 1,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Product ID" });
    }

    const product = await Product.findById(id).populate(
      "createdBy",
      "name email"
    );

    if (!product || !product.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }

    res.status(200).json({
      success: true,
      message: "Product found",
      data: product,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    // Get the product info from req (client)
    const productData = { ...req.body, createdBy: req.user.userId };

    // Calling the schema which will be the guide on hw the prod above will be stored in the db
    const product = new Product(productData);

    // Store data in the db
    await product.save();

    // populate the createdBy field for response
    await product.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.log(error.message);
    // SKU unique
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product with this SKU Number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating products",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(201).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating products",
      error: error.message,
    });
  }
};

// Soft delete
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    // const product = await Product.findByIdAndDelete(id);

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
