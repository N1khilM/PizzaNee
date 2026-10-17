import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../api";
import fallbackPizzas from "../../data/pizzas";

export const fetchPizzas = createAsyncThunk("pizzas/fetchPizzas", async () => {
  const data = await apiRequest("/api/pizzas");
  const list = Array.isArray(data) ? data : data?.pizzas || data?.data || data?.items;
  if (!Array.isArray(list)) throw new Error("The pizza API did not return a pizza list.");
  return list;
});

const pizzaSlice = createSlice({
  name: "pizzas",
  initialState: { items: fallbackPizzas, status: "idle", error: null, usingFallback: true },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPizzas.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(fetchPizzas.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
        state.error = null;
        state.usingFallback = false;
      })
      .addCase(fetchPizzas.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Could not load the menu.";
        state.items = fallbackPizzas;
        state.usingFallback = true;
      });
  },
});

export default pizzaSlice.reducer;
