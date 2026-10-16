const mongoose = require("mongoose");

const customizationSchema = new mongoose.Schema(
  {
    base: String,
    sauce: String,
    cheese: String,
    vegetables: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const orderItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["standard", "custom"],
      default: "standard",
      required: true,
    },
    pizza: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pizza",
      required: function () {
        return this.type === "standard";
      },
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    customization: {
      type: customizationSchema,
      required: function () {
        return this.type === "custom";
      },
      default: undefined,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "An order must contain at least one item.",
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed"],
      default: "unpaid",
    },
    stripeSessionId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
