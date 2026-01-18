const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product.models");
const ProductBlog = require("../models/ProductBlog.models");
const User = require("../models/User.models");

dotenv.config();

const ensureSeedUser = async () => {
  const seedEmail = process.env.SEED_USER_EMAIL;
  if (seedEmail) {
    const existing = await User.findOne({ email: seedEmail });
    if (existing) return existing;
  }

  return User.findOne().sort({ createdAt: 1 });
};

const buildContent = (product) => {
  const description = product.description || "";
  return [
    `# ${product.name}`,
    "",
    "## Overview",
    description,
    "",
    "## Design Highlights",
    "- Crafted for everyday comfort",
    "- Built with durable materials",
    "- Easy to style in modern spaces",
    "",
    "## Materials & Care",
    product.careInstructions
      ? product.careInstructions
      : "Wipe clean with a soft, dry cloth. Avoid harsh chemicals.",
    "",
    "## Why You'll Love It",
    "This piece balances form and function with a clean silhouette, making it a reliable staple for your space.",
    "",
  ].join("\n");
};

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const [products, seedUser] = await Promise.all([
    Product.find({ isActive: true }),
    ensureSeedUser(),
  ]);

  if (!products.length) {
    throw new Error("No products found to seed blogs for.");
  }

  for (const product of products) {
    const hero = product.images?.[0];
    const gallery = product.images?.slice(1) || [];

    const blogData = {
      product: product._id,
      title: `${product.name} Story`,
      excerpt: product.description?.slice(0, 280) || `${product.name} details.`,
      content: buildContent(product),
      contentFormat: "markdown",
      heroImage: hero
        ? { url: hero.url, alt: hero.alt || product.name }
        : undefined,
      images: gallery.map((img) => ({
        url: img.url,
        alt: img.alt || product.name,
      })),
      isPublished: true,
    };

    if (seedUser?._id) {
      blogData.createdBy = seedUser._id;
    }

    await ProductBlog.findOneAndUpdate(
      { product: product._id },
      { $set: blogData },
      { upsert: true, new: true, runValidators: true }
    );
  }

  console.log(`Seeded blogs for ${products.length} products.`);
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error("Blog seed failed:", error.message);
  process.exitCode = 1;
});
