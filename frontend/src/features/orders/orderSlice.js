import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "orders",
  initialState: { status: "idle", error: null, currentOrder: null },
  reducers: {
    setCurrentOrder: (state, action) => { state.currentOrder = action.payload; state.status = "succeeded"; state.error = null; },
    clearCurrentOrder: (state) => { state.currentOrder = null; state.status = "idle"; state.error = null; },
    setOrderError: (state, action) => { state.status = "failed"; state.error = action.payload; },
  },
});

export const { setCurrentOrder, clearCurrentOrder, setOrderError } = orderSlice.actions;
export default orderSlice.reducer;
