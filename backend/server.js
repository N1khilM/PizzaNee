require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const pizzaRoutes = require("./routes/pizzaRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const stripeWebhook = require("./routes/stripeWebhook");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Pizza API is running 🍕" });
});

// Webhook first: preserve the raw request body
app.use("/api/payments/webhook", stripeWebhook);

// JSON parser for all other routes
app.use(express.json());
app.use("/api/pizzas", pizzaRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
