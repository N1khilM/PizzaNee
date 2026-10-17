import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setBase,
  setSauce,
  setCheese,
  toggleVegetable,
  resetBuilder,
} from "../features/builder/builderSlice";
import { addToCart } from "../features/cart/cartSlice";

const steps = ["Base", "Sauce", "Cheese", "Veggies"];
const options = {
  base: [
    { name: "Classic Hand Tossed", price: 99 },
    { name: "Thin Crust", price: 119 },
    { name: "Cheese Burst", price: 149 },
    { name: "Whole Wheat", price: 129 },
    { name: "Pan Pizza", price: 139 },
  ],
  sauce: [
    { name: "Classic Tomato", price: 20 },
    { name: "Spicy Red", price: 25 },
    { name: "Creamy Alfredo", price: 35 },
    { name: "Pesto", price: 40 },
    { name: "BBQ Sauce", price: 30 },
  ],
  cheese: [
    { name: "Mozzarella", price: 40 },
    { name: "Cheddar", price: 45 },
    { name: "Parmesan", price: 50 },
    { name: "Vegan Cheese", price: 55 },
  ],
  vegetables: [
    { name: "Onions", price: 15 },
    { name: "Capsicum", price: 20 },
    { name: "Mushrooms", price: 25 },
    { name: "Sweet Corn", price: 20 },
    { name: "Olives", price: 25 },
    { name: "Jalapeños", price: 20 },
  ],
};
const keys = ["base", "sauce", "cheese", "vegetables"];

function PizzaBuilder() {
  const dispatch = useDispatch();
  const builder = useSelector((state) => state.builder);
  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState("");
  const currentKey = keys[step];
  const currentOptions = options[currentKey];

  const priceOf = (key, name) => options[key].find((item) => item.name === name)?.price || 0;
  const total = priceOf("base", builder.base) + priceOf("sauce", builder.sauce) + priceOf("cheese", builder.cheese) + builder.vegetables.reduce((sum, name) => sum + priceOf("vegetables", name), 0);
  const selected = (name) => step === 3 ? builder.vegetables.includes(name) : builder[currentKey] === name;

  const choose = (name) => {
    setNotice("");
    if (step === 0) dispatch(setBase(name));
    else if (step === 1) dispatch(setSauce(name));
    else if (step === 2) dispatch(setCheese(name));
    else dispatch(toggleVegetable(name));
  };

  const addCustomPizza = () => {
    if (!builder.base || !builder.sauce || !builder.cheese) {
      setNotice("Choose a base, sauce and cheese first.");
      return;
    }
    dispatch(addToCart({
      id: `custom-${Date.now()}`,
      name: "Custom Pizza",
      price: total,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&auto=format&fit=crop&q=80",
      isVeg: true,
      customization: {
        base: builder.base,
        sauce: builder.sauce,
        cheese: builder.cheese,
        vegetables: [...builder.vegetables],
      },
    }));
    dispatch(resetBuilder());
    setStep(0);
    setNotice("Your custom pizza is in the cart! ✨");
  };

  return (
    <section className="builder-section section-pad" id="builder">
      <div className="section-container">
        <div className="builder-intro"><p className="eyebrow">THE PIZZA LAB</p><h2>Dream it. <span>Build it.</span></h2><p className="section-lead">Your pizza, your rules. Pick the layers that make you happy.</p></div>
        <div className="builder-layout">
          <div className="builder-main panel-card">
            <div className="step-indicator">{steps.map((label, index) => <button key={label} type="button" className={index === step ? "builder-step active" : index < step ? "builder-step complete" : "builder-step"} onClick={() => setStep(index)}><span>{index < step ? "✓" : index + 1}</span>{label}</button>)}</div>
            <div className="builder-options">
              <div className="builder-options-head"><div><p className="eyebrow">STEP {step + 1} OF 4</p><h3>{["Choose your base", "Pick your sauce", "Choose your cheese", "Add your vegetables"][step]}</h3></div><span className="selection-hint">{step === 3 ? "Choose as many as you like" : "Choose one option"}</span></div>
              <div className="ingredient-grid">{currentOptions.map((item) => <button key={item.name} type="button" className={selected(item.name) ? "ingredient-option chosen" : "ingredient-option"} onClick={() => choose(item.name)} aria-pressed={selected(item.name)}><span className="ingredient-check">{selected(item.name) ? "✓" : "+"}</span><strong>{item.name}</strong><span className="ingredient-price">+₹{item.price}</span></button>)}</div>
            </div>
            <div className="builder-navigation"><button type="button" className="button button-outline" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>← Back</button>{step < 3 ? <button type="button" className="button button-primary" disabled={step === 0 ? !builder.base : step === 1 ? !builder.sauce : !builder.cheese} onClick={() => setStep((value) => Math.min(3, value + 1))}>Continue →</button> : <button type="button" className="button button-primary" disabled={!builder.base || !builder.sauce || !builder.cheese} onClick={addCustomPizza}>Add to cart · ₹{total}</button>}</div>
            {notice && <p className={notice.startsWith("Your") ? "builder-notice success" : "builder-notice"} role="status">{notice}</p>}
          </div>
          <aside className="builder-summary panel-card"><div className="builder-pizza-art"><div className="mini-pizza"><span>🍕</span></div></div><p className="eyebrow">YOUR CREATION</p><h3>Your pizza, in progress.</h3><p className="muted">Every great pizza starts with a good idea.</p><div className="summary-row"><span>Base</span><strong>{builder.base || "Not selected"}</strong></div><div className="summary-row"><span>Sauce</span><strong>{builder.sauce || "Not selected"}</strong></div><div className="summary-row"><span>Cheese</span><strong>{builder.cheese || "Not selected"}</strong></div><div className="summary-row"><span>Veggies</span><strong>{builder.vegetables.length ? builder.vegetables.join(", ") : "None yet"}</strong></div><div className="summary-total"><span>Current total</span><strong>₹{total}</strong></div><small className="builder-summary-footnote">Final prices are validated by the backend during checkout.</small></aside>
        </div>
      </div>
    </section>
  );
}

export default PizzaBuilder;
