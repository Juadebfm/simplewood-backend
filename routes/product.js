const express = require("express");
const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  getProductReviews,
  createProductReview,
} = require("../controllers/reviewController");
const {
  getProductBlog,
  createProductBlog,
  updateProductBlog,
} = require("../controllers/productBlogController");
const auth = require("../middleware/auth");

const router = express.Router();

// Public
router.get("/", getAllProducts);
router.post("/", auth, createProduct);

router.get("/:id", getProductById);
router.put("/:id", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);
router.get("/:id/reviews", getProductReviews);
router.post("/:id/reviews", auth, createProductReview);
router.get("/:id/blog", getProductBlog);
router.post("/:id/blog", auth, createProductBlog);
router.put("/:id/blog", auth, updateProductBlog);

module.exports = router;
