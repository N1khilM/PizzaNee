import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Cart() {
  const items = useSelector((state) => state.cart.items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link className="cart-nav-link" to="/cart" aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}>
      <span aria-hidden="true">🛒</span>
      <span>Cart</span>
      <span className="cart-count">{count}</span>
    </Link>
  );
}

export default Cart;
