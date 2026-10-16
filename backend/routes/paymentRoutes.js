const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Pizza = require("../models/Pizza");
const Order = require("../models/Order");

const CUSTOM_PRICES = {
  base: {
    "Classic Hand Tossed": 99,
    "Thin Crust": 119,
    "Cheese Burst": 149,
    "Whole Wheat": 129,
    "Pan Pizza": 139,
  },
  sauce: {
    "Classic Tomato": 20,
    "Spicy Red": 25,
    "Creamy Alfredo": 35,
    Pesto: 40,
    "BBQ Sauce": 30,
  },
  cheese: {
    Mozzarella: 40,
    Cheddar: 45,
    Parmesan: 50,
    "Vegan Cheese": 55,
  },
  vegetables: {
    Onions: 15,
    Capsicum: 20,
    Mushrooms: 25,
    "Sweet Corn": 20,
    Olives: 25,
    Jalapeños: 20,
  },
};

const hasOption = (category, value) =>
  typeof value === "string" &&
  Object.prototype.hasOwnProperty.call(CUSTOM_PRICES[category], value);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body;

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      items.some(
        (item) => !item || typeof item !== "object" || Array.isArray(item),
      )
    ) {
      return res.status(400).json({ message: "Invalid or empty cart" });
    }

    const checkoutItems = items.map((item) => ({
      ...item,
      type: item.type || (item.customization ? "custom" : "standard"),
    }));

    for (const item of checkoutItems) {
      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 50
      ) {
        return res.status(400).json({
          message: "Invalid pizza quantity",
        });
      }

      if (item.type === "standard") {
        if (
          typeof item.pizzaId !== "string" ||
          !/^[a-fA-F0-9]{24}$/.test(item.pizzaId)
        ) {
          return res.status(400).json({
            message: "Invalid pizza ID",
          });
        }
      } else if (item.type === "custom") {
        const c = item.customization;

        if (
          !c ||
          typeof c !== "object" ||
          !hasOption("base", c.base) ||
          !hasOption("sauce", c.sauce) ||
          !hasOption("cheese", c.cheese) ||
          !Array.isArray(c.vegetables) ||
          c.vegetables.length > Object.keys(CUSTOM_PRICES.vegetables).length ||
          !c.vegetables.every((v) => hasOption("vegetables", v)) ||
          new Set(c.vegetables).size !== c.vegetables.length
        ) {
          return res.status(400).json({
            message: "Invalid custom pizza ingredients",
          });
        }
      } else {
        return res.status(400).json({
          message: "Invalid cart item type",
        });
      }
    }

    const standardItems = checkoutItems.filter(
      (item) => item.type === "standard",
    );

    const standardIds = standardItems.map((item) => item.pizzaId);

    if (
      new Set(standardIds.map((id) => id.toLowerCase())).size !==
      standardIds.length
    ) {
      return res.status(400).json({
        message: "Duplicate pizza entries are not allowed",
      });
    }

    const pizzas = standardIds.length
      ? await Pizza.find({ _id: { $in: standardIds } })
      : [];

    if (pizzas.length !== standardIds.length) {
      return res.status(400).json({
        message: "One or more pizzas are unavailable",
      });
    }

    const pizzaMap = new Map(
      pizzas.map((pizza) => [pizza._id.toString(), pizza]),
    );

    const orderItems = checkoutItems.map((item) => {
      if (item.type === "custom") {
        const c = item.customization;

        const price =
          CUSTOM_PRICES.base[c.base] +
          CUSTOM_PRICES.sauce[c.sauce] +
          CUSTOM_PRICES.cheese[c.cheese] +
          c.vegetables.reduce(
            (sum, vegetable) => sum + CUSTOM_PRICES.vegetables[vegetable],
            0,
          );

        const details = [c.base, c.sauce, c.cheese, ...c.vegetables];

        return {
          type: "custom",
          name: `Custom Pizza (${details.join(", ")})`,
          price,
          quantity: item.quantity,
          customization: {
            base: c.base,
            sauce: c.sauce,
            cheese: c.cheese,
            vegetables: [...c.vegetables],
          },
        };
      }

      const pizza = pizzaMap.get(item.pizzaId.toLowerCase());

      return {
        type: "standard",
        pizza: pizza._id,
        name: pizza.name,
        price: pizza.price,
        quantity: item.quantity,
      };
    });

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const order = await Order.create({
      items: orderItems,
      totalAmount,
      status: "Pending",
      paymentStatus: "unpaid",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: orderItems.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      client_reference_id: order._id.toString(),
      metadata: { orderId: order._id.toString() },
      success_url:
        `${process.env.FRONTEND_URL}/cart?payment=success` +
        `&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart?payment=cancelled`,
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error.message);
    res.status(500).json({
      message: "Could not start checkout",
    });
  }
});

router.get("/verify-session/:sessionId", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.params.sessionId,
    );

    if (!session.metadata?.orderId) {
      return res.status(400).json({
        message: "Invalid checkout session",
      });
    }

    const order = await Order.findOne({
      _id: session.metadata.orderId,
      stripeSessionId: session.id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      checkoutStatus: session.status,
      totalAmount: order.totalAmount,
    });
  } catch (error) {
    console.error("Session verification error:", error.message);
    res.status(500).json({
      message: "Could not verify payment",
    });
  }
});

module.exports = router;
