const express = require("express");
const Pizza = require("../models/Pizza");

const router = express.Router();

// GET /api/pizzas
router.get("/", async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.status(200).json(pizzas);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pizzas",
    });
  }
});

module.exports = router;
