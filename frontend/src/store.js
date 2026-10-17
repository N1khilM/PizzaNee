import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";
import builderReducer from "./features/builder/builderSlice";
import pizzaReducer from "./features/pizzas/pizzaSlice";
import orderReducer from "./features/orders/orderSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    builder: builderReducer,
    pizzas: pizzaReducer,
    orders: orderReducer,
  },
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    try {
      window.localStorage.setItem("pizzanee-cart", JSON.stringify(store.getState().cart.items));
    } catch {
      // Local storage can be unavailable in private browsing; the in-memory cart still works.
    }
  });
}

export default store;
