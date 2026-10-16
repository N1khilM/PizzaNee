const express = require("express");
const mongoose = require("mongoose");

const Pizza = require("../models/Pizza");
const Order = require("../models/Order");

const router = express.Router();

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your order must contain at least one item",
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const { pizzaId, quantity } = item;

      if (
        !mongoose.isValidObjectId(pizzaId) ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > 50
      ) {
        return res.status(400).json({
          message: "Invalid pizza ID or quantity",
        });
      }

      const pizza = await Pizza.findById(pizzaId);

      if (!pizza) {
        return res.status(404).json({
          message: "A pizza in your order was not found",
        });
      }

      const lineTotal = pizza.price * quantity;
      totalAmount += lineTotal;

      orderItems.push({
        pizza: pizza._id,
        name: pizza.name,
        price: pizza.price,
        quantity,
      });
    }

    const order = await Order.create({
      items: orderItems,
      totalAmount,
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Order creation failed:", error.message);

    res.status(500).json({
      message: "Failed to create order",
    });
  }
});

// GET /api/orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.pizza", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});

module.exports = router;
