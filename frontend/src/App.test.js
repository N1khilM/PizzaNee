import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import cartReducer from "./features/cart/cartSlice";
import builderReducer from "./features/builder/builderSlice";
import pizzaReducer from "./features/pizzas/pizzaSlice";
import orderReducer from "./features/orders/orderSlice";
import App from "./App";

const testStore = configureStore({
  reducer: { cart: cartReducer, builder: builderReducer, pizzas: pizzaReducer, orders: orderReducer },
  preloadedState: {
    cart: { items: [] },
    builder: { base: null, sauce: null, cheese: null, vegetables: [] },
    pizzas: { items: [], status: "idle", error: null, usingFallback: true },
    orders: { status: "idle", error: null, currentOrder: null },
  },
});

test("renders PizzaNee brand and hero", () => {
  render(<Provider store={testStore}><BrowserRouter><App /></BrowserRouter></Provider>);
  expect(screen.getAllByText(/Pizza/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/A little more/i)).toBeInTheDocument();
});
