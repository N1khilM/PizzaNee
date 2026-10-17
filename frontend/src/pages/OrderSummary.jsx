import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { clearCart, increaseQuantity, decreaseQuantity, removeFromCart } from "../features/cart/cartSlice";
import { apiRequest } from "../api";

function OrderSummary() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const [searchParams, setSearchParams] = useSearchParams();
  const [paymentResult, setPaymentResult] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [verifyAttempt, setVerifyAttempt] = useState(0);
  const searchString = searchParams.toString();
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const payment = params.get("payment");
    const sessionId = params.get("session_id");

    if (payment === "cancelled") {
      setPaymentResult({ type: "cancelled", message: "Payment was cancelled. Your cart is still here whenever you're ready." });
      setSearchParams({}, { replace: true });
      return undefined;
    }
    if (payment !== "success" || !sessionId) return undefined;

    let cancelled = false;
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    async function verifyPayment() {
      setCheckingPayment(true);
      setPaymentResult(null);
      try {
        let data;
        for (let attempt = 0; attempt < 5; attempt += 1) {
          if (cancelled) return;
          data = await apiRequest(`/api/payments/verify-session/${encodeURIComponent(sessionId)}`);
          if (data?.paymentStatus === "paid") break;
          if (attempt < 4) await wait(1500);
        }
        if (cancelled) return;
        const paid = data?.paymentStatus === "paid";
        setPaymentResult({
          type: paid ? "success" : "pending",
          message: paid
            ? `Payment confirmed. Order #${data.orderId}`
            : "Your payment is awaiting confirmation. Please do not pay again. Use the button below to check again shortly.",
          totalAmount: data?.totalAmount,
          orderId: data?.orderId,
        });
        if (paid) {
          dispatch(clearCart());
          setSearchParams({}, { replace: true });
        }
      } catch (error) {
        if (!cancelled) setPaymentResult({ type: "error", message: error.message || "We couldn't verify your payment yet. Please try again shortly." });
      } finally {
        if (!cancelled) setCheckingPayment(false);
      }
    }

    verifyPayment();
    return () => { cancelled = true; };
  }, [searchString, setSearchParams, dispatch, verifyAttempt]);

  const handleCheckout = async () => {
    if (!items.length || paymentLoading) return;
    setPaymentLoading(true);
    setPaymentError("");
    try {
      const data = await apiRequest("/api/payments/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((item) => item.customization
            ? { type: "custom", quantity: item.quantity, customization: item.customization }
            : { type: "standard", pizzaId: item.pizzaId || item.id, quantity: item.quantity }),
        }),
      });
      if (!data?.url) throw new Error("Stripe didn't return a checkout URL.");
      window.location.assign(data.url);
    } catch (error) {
      setPaymentError(error.message || "Couldn't start checkout. Please try again.");
      setPaymentLoading(false);
    }
  };

  const paymentNotice = paymentResult && (
    <div className={`payment-result payment-${paymentResult.type}`} role="status">
      <div className="payment-result-icon">{paymentResult.type === "success" ? "✓" : paymentResult.type === "cancelled" ? "↩" : "i"}</div>
      <div className="payment-result-copy"><h2>{paymentResult.type === "success" ? "Payment successful! 🍕" : paymentResult.type === "cancelled" ? "Checkout cancelled" : paymentResult.type === "pending" ? "Payment processing" : "Couldn't verify payment yet"}</h2><p>{paymentResult.message}</p>{paymentResult.type === "success" && <p className="paid-total">Total paid: ₹{paymentResult.totalAmount}</p>}{["pending", "error"].includes(paymentResult.type) && <button className="button button-outline button-small" type="button" onClick={() => setVerifyAttempt((attempt) => attempt + 1)} disabled={checkingPayment}>{checkingPayment ? "Checking…" : "Check payment status again"}</button>}</div>
    </div>
  );

  if (items.length === 0) {
    return <section className="checkout-page section-container"><div className="checkout-title"><p className="eyebrow">YOUR LITTLE PIZZA MOMENT</p><h1>Order summary<span>.</span></h1></div>{checkingPayment && <p className="loading-note"><span className="loader" /> Verifying your payment…</p>}{paymentNotice}{!paymentResult && !checkingPayment && <div className="empty-cart panel-card"><span className="empty-cart-art">🍕</span><h2>Your cart is taking a little nap.</h2><p>Add a pizza or build your own to get things rolling.</p><Link className="button button-primary" to="/#menu">Explore the menu →</Link></div>}{paymentResult?.type === "success" && <div className="empty-cart next-steps"><h3>Thanks for trying PizzaNee!</h3><p>Your test order has been confirmed.</p><Link className="button button-primary" to="/#menu">Explore more pizzas →</Link></div>}{paymentResult?.type === "cancelled" && <Link className="button button-primary" to="/#menu">Back to the menu →</Link>}</section>;
  }

  return (
    <section className="checkout-page section-container">
      <div className="checkout-title"><p className="eyebrow">ALMOST THERE</p><h1>Order summary<span>.</span></h1><p>One last look before your pizza adventure.</p></div>
      {checkingPayment && <p className="loading-note"><span className="loader" /> Verifying your payment…</p>}
      {paymentNotice}
      <div className="checkout-layout">
        <div className="checkout-items-list">
          {items.map((item) => <article className="checkout-item panel-card" key={item.id}>
            <img className="checkout-item-image" src={item.image} alt={item.name} onError={(event) => { event.currentTarget.src = "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80"; }} />
            <div className="checkout-item-details"><h3>{item.name}</h3><p className="item-price">₹{item.price} each</p>{item.customization && <div className="customization-details"><span>{item.customization.base}</span><span>{item.customization.sauce}</span><span>{item.customization.cheese}</span><span>{(item.customization.vegetables || []).join(", ") || "No vegetables"}</span></div>}<div className="checkout-quantity"><button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => dispatch(decreaseQuantity(item.id))} disabled={item.quantity <= 1}>−</button><span>{item.quantity}</span><button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => dispatch(increaseQuantity(item.id))} disabled={item.quantity >= 50}>+</button><button className="remove-button" type="button" onClick={() => dispatch(removeFromCart(item.id))}>Remove</button></div></div>
            <strong className="checkout-line-total">₹{item.price * item.quantity}</strong>
          </article>)}
          <Link className="back-to-menu" to="/#menu">← Back to menu</Link>
        </div>
        <aside className="checkout-card panel-card"><p className="eyebrow">THE TOTAL</p><h2>Bill details</h2><div className="bill-row"><span>Items ({totalQuantity})</span><span>₹{subtotal}</span></div><div className="bill-row"><span>Delivery</span><span className="muted">Demo · not charged</span></div><div className="bill-total"><span>Subtotal</span><strong>₹{subtotal}</strong></div><button className="button button-primary checkout-button" type="button" onClick={handleCheckout} disabled={paymentLoading || !items.length}>{paymentLoading ? "Opening secure checkout…" : "Pay with Stripe →"}</button>{paymentError && <p role="alert" className="form-error">{paymentError}</p>}<p className="checkout-note"><span>🔒</span> You'll be redirected to Stripe's secure checkout page.</p><p className="checkout-note">Portfolio demo only. Use Stripe test mode; no real food orders are fulfilled.</p></aside>
      </div>
    </section>
  );
}

export default OrderSummary;
