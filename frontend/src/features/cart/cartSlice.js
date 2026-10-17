import { createSlice } from "@reduxjs/toolkit";

function loadCart() {
  try {
    const raw = window.localStorage.getItem("pizzanee-cart");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: loadCart() },
  reducers: {
    addToCart: (state, action) => {
      const pizza = action.payload;
      const existingItem = state.items.find((item) => item.id === pizza.id);
      if (existingItem) existingItem.quantity += 1;
      else state.items.push({ ...pizza, quantity: 1 });
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (item && item.quantity < 50) item.quantity += 1;
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
