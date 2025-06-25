const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const auth = require("../middleware/authMiddleware");



// Get logged-in user's orders
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("My Orders fetch error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


// ✅ Protected route to place order
router.post("/", auth, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    // ✅ Enrich items to include image
    const enrichedItems = items.map(item => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image  // ✅ Include image here
    }));

    const order = new Order({
      user: req.user.id,
      items: enrichedItems, // ✅ use enrichedItems instead of raw items
      totalAmount
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Order save error:", err);
    res.status(500).json({ message: "Order failed", error: err.message });
  }
});



module.exports = router;
