const crypto = require("crypto");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();




// Simulate in-memory token store (in production, use DB)
let resetTokens = {}; // key: token, value: userId

// Forgot Password: Generate reset token
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(20).toString("hex");
  resetTokens[token] = user._id;

  // k (simulate email): http://localhost:5173/reset-password/" + token);

  res.json({ message: "Reset link sent to your email (simulated)", token });
});

// Reset Password: Use token to reset
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const userId = resetTokens[token];
  if (!userId) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();

  delete resetTokens[token]; // remove used token

  res.json({ message: "Password reset successful" });
});




module.exports = router;