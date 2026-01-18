const jwt = require("jsonwebtoken");
const User = require("../models/User.models");

// We create middle ware function for auth

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access Denied. No Token Provided" });
    }

    // Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Token is valid but user not found" });
    }

    // Add user to req obj
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

module.exports = auth;
