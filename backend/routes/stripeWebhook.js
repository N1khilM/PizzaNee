const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      console.error("Webhook signature error:", error.message);
      return res.status(400).send("Invalid webhook signature");
    }

    try {
      if (
        event.type === "checkout.session.completed" ||
        event.type === "checkout.session.async_payment_succeeded"
      ) {
        const session = event.data.object;

        if (session.payment_status === "paid") {
          const orderId = session.metadata?.orderId;

          if (orderId) {
            await Order.findOneAndUpdate(
              {
                _id: orderId,
                stripeSessionId: session.id,
                paymentStatus: { $ne: "paid" },
              },
              {
                $set: {
                  paymentStatus: "paid",
                  status: "Confirmed",
                },
              },
            );
          }
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook processing error:", error.message);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  },
);

module.exports = router;
