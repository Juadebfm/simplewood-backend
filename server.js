// Import the packages we just installed
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const newsletterRoutes = require("./routes/newsletter");
const paymentRoutes = require("./routes/payment");
const dashboardRoutes = require("./routes/dashboard");
const cors = require("cors");

// Enable usage of .env files - this must always be at the topmost part of your server/app/index .js file
require("dotenv").config();

// Create the express app
const app = express();

// set up middlewares (code that runs for every request)
app.use(cors());
app.use(express.json());

// Our port
const PORT = process.env.PORT || 5000;

// Create endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello! this is the home endpoint of our backend",
    data: {
      name: "e-commerce-backend datum",
      class: "Feb 2025 class",
      efficiency: "Beginner",
    },
  });
});

// actual endpoints
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Connect DB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connection successful");

    app.listen(PORT, () => {
      console.log(`Server running at ${PORT}`);
    });
  } catch (error) {
    console.error("DB Connection Failed:", error.message);
    process.exitCode = 1;
  }
};

startServer();
