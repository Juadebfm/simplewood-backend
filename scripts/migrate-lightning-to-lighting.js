const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product.models");

dotenv.config();

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const result = await Product.updateMany(
    { category: "lightning" },
    { $set: { category: "lighting" } }
  );

  console.log(
    `Migration complete. Matched: ${result.matchedCount}, modified: ${result.modifiedCount}`
  );

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
});
