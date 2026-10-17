import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&auto=format&fit=crop&q=80";

function PizzaCard({ pizza, fallbackMode = false }) {
  const dispatch = useDispatch();
  const id = String(pizza._id || pizza.id || "");
  const name = pizza.name || "Signature Pizza";
  const price = Number(pizza.price) || 0;
  const image = pizza.image || pizza.imageUrl || DEFAULT_IMAGE;

  const handleAdd = () => {
    dispatch(addToCart({
      id,
      pizzaId: id,
      name,
      price,
      image,
      description: pizza.description || "A PizzaNee favourite, made for sharing.",
      isVeg: pizza.isVeg !== false,
      category: pizza.category || "PizzaNee favourite",
    }));
  };

  return (
    <article className="pizza-card">
      <div className="pizza-image-wrap">
        <img className="pizza-image" src={image} alt={name} loading="lazy" onError={(event) => { event.currentTarget.src = DEFAULT_IMAGE; }} />
        <span className="pizza-tag">{pizza.category || (pizza.isVeg === false ? "Non-veg" : "Veg favourite")}</span>
      </div>
      <div className="pizza-card-body">
        <div className="pizza-title-row">
          <h3>{name}</h3>
          <span className={pizza.isVeg === false ? "veg-indicator nonveg" : "veg-indicator"} title={pizza.isVeg === false ? "Non-vegetarian" : "Vegetarian"}><i /></span>
        </div>
        <p>{pizza.description || "Fresh flavours, comforting cheese, and a crust made for your next favourite bite."}</p>
        <div className="pizza-card-footer">
          <strong>₹{price}</strong>
          <button className="add-button" type="button" onClick={handleAdd} disabled={!id} aria-label={`Add ${name} to cart`}>Add <span aria-hidden="true">+</span></button>
        </div>
        {fallbackMode && <small className="fallback-inline">Sample menu · connect backend to checkout</small>}
      </div>
    </article>
  );
}

export default PizzaCard;
