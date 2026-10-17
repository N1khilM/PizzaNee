import { createSlice } from "@reduxjs/toolkit";

const initialState = { base: null, sauce: null, cheese: null, vegetables: [] };

const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    setBase: (state, action) => { state.base = action.payload; },
    setSauce: (state, action) => { state.sauce = action.payload; },
    setCheese: (state, action) => { state.cheese = action.payload; },
    toggleVegetable: (state, action) => {
      const vegetable = action.payload;
      state.vegetables = state.vegetables.includes(vegetable)
        ? state.vegetables.filter((item) => item !== vegetable)
        : [...state.vegetables, vegetable];
    },
    resetBuilder: () => initialState,
  },
});

export const { setBase, setSauce, setCheese, toggleVegetable, resetBuilder } = builderSlice.actions;
export default builderSlice.reducer;
