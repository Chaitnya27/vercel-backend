const express = require("express");
const router = express.Router();
const ProductModel = require("../models/productModel");
const authMiddleware = require("../middleware/authMiddleware");

// 1. 🔍 GET ALL PRODUCTS (with search filter)
router.get("/", async (req, res) => {
  const searchQuery = req.query.search || "";
  const regex = new RegExp(searchQuery, "i"); // case-insensitive

  try {
    const products = await ProductModel.find({
      $or: [
        { name: { $regex: regex } },
        { brand: { $regex: regex } },
        { category: { $regex: regex } },
      ]
    });
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 2. 🟢 ADD PRODUCT (Requires login)
router.post("/", authMiddleware, async (req, res) => {
  const { name, price,brand,image, description, category } = req.body;

  // Validate required fields manually (or use Joi if implemented)
  if (!name || !price || !brand || !image || !description || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const product = new ProductModel({
      name,
      price,
      brand,
      image,
      description,
      category,
      user: req.user.id, // Authenticated user's ID
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Add product error:", err);
    res.status(400).json({ message: err.message });
  }
});

// 3. 🗑 DELETE PRODUCT (Only owner can delete)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if the logged-in user is the owner
    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 4. 🔁 GET ONE PRODUCT BY ID
router.get("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Error while fetching product:", err);
    res.status(500).json({ message: "Error fetching product" });
  }
});

// 5. ✏️ UPDATE PRODUCT (Only owner can update)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to update this product" });
    }

    const updated = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
