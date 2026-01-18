const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Address = require("../models/Address.models");
const CompareItem = require("../models/CompareItem.models");
const NewsletterSubscription = require("../models/NewsletterSubscription.models");
const Order = require("../models/Order.models");
const Product = require("../models/Product.models");
const User = require("../models/User.models");
const WishlistItem = require("../models/WishlistItem.models");

dotenv.config();

const ensureSeedUser = async () => {
  const seedEmail = process.env.SEED_USER_EMAIL;
  const seedName = process.env.SEED_USER_NAME || "Seed User";
  const seedPassword = process.env.SEED_USER_PASSWORD || "SeedPassword123!";

  if (seedEmail) {
    const existing = await User.findOne({ email: seedEmail });
    if (existing) return existing;

    return User.create({
      name: seedName,
      email: seedEmail,
      password: seedPassword,
    });
  }

  const firstUser = await User.findOne().sort({ createdAt: 1 });
  if (firstUser) return firstUser;

  return User.create({
    name: seedName,
    email: "seed@example.com",
    password: seedPassword,
  });
};

const buildImage = (product) => {
  const image = product.images?.[0];
  if (!image?.url) return undefined;
  return {
    url: image.url,
    alt: image.alt || product.name,
  };
};

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const user = await ensureSeedUser();
  const products = await Product.find({ isActive: true }).limit(6);

  if (products.length < 3) {
    throw new Error("Seed at least 3 products before running this script.");
  }

  const homeAddress = {
    user: user._id,
    label: "Home",
    fullName: user.name,
    phone: "(555) 229-3326",
    line1: "6146 Honey Bluff Parkway",
    line2: "",
    city: "Calder",
    state: "Michigan",
    postalCode: "49628-7789",
    country: "United States",
    isDefault: true,
  };

  const officeAddress = {
    user: user._id,
    label: "Office",
    fullName: user.name,
    phone: "(555) 229-3326",
    line1: "46 W 45th Street",
    line2: "Suite 1200",
    city: "New York",
    state: "NY",
    postalCode: "10036",
    country: "United States",
    isDefault: false,
  };

  await Address.findOneAndUpdate(
    { user: user._id, label: "Home" },
    { $set: homeAddress },
    { upsert: true, new: true, runValidators: true }
  );

  await Address.findOneAndUpdate(
    { user: user._id, label: "Office" },
    { $set: officeAddress },
    { upsert: true, new: true, runValidators: true }
  );

  await NewsletterSubscription.findOneAndUpdate(
    { email: user.email },
    {
      $set: {
        email: user.email,
        isActive: true,
        source: "seed-dashboard",
      },
    },
    { upsert: true, new: true, runValidators: true }
  );

  const wishlistProducts = products.slice(0, 3);
  const compareProducts = products.slice(2, 5);

  await Promise.all(
    wishlistProducts.map((product) =>
      WishlistItem.updateOne(
        { user: user._id, product: product._id },
        { $setOnInsert: { user: user._id, product: product._id } },
        { upsert: true }
      )
    )
  );

  await Promise.all(
    compareProducts.map((product) =>
      CompareItem.updateOne(
        { user: user._id, product: product._id },
        { $setOnInsert: { user: user._id, product: product._id } },
        { upsert: true }
      )
    )
  );

  const shippingSnapshot = {
    fullName: homeAddress.fullName,
    phone: homeAddress.phone,
    line1: homeAddress.line1,
    line2: homeAddress.line2,
    city: homeAddress.city,
    state: homeAddress.state,
    postalCode: homeAddress.postalCode,
    country: homeAddress.country,
  };

  const orderOneItems = [
    {
      product: products[0]._id,
      name: products[0].name,
      price: products[0].price,
      quantity: 1,
      image: buildImage(products[0]),
    },
    {
      product: products[1]._id,
      name: products[1].name,
      price: products[1].price,
      quantity: 1,
      image: buildImage(products[1]),
    },
  ];

  const orderTwoItems = [
    {
      product: products[2]._id,
      name: products[2].name,
      price: products[2].price,
      quantity: 2,
      image: buildImage(products[2]),
    },
  ];

  const orders = [
    {
      orderNumber: "00000001",
      status: "pending",
      currency: "USD",
      items: orderOneItems,
    },
    {
      orderNumber: "00000002",
      status: "pending",
      currency: "USD",
      items: orderTwoItems,
    },
  ];

  for (const order of orders) {
    const total = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await Order.findOneAndUpdate(
      { orderNumber: order.orderNumber },
      {
        $set: {
          user: user._id,
          status: order.status,
          currency: order.currency,
          items: order.items,
          total,
          shippingAddress: shippingSnapshot,
        },
        $setOnInsert: {
          orderNumber: order.orderNumber,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );
  }

  console.log("Dashboard seed complete.");
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error("Dashboard seed failed:", error.message);
  process.exitCode = 1;
});
