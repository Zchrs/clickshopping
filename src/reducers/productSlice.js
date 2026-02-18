import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  connected: false,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action) {
      state.products = action.payload;
    },
    sseConnected(state) {
      state.connected = true;
    },
    sseDisconnected(state) {
      state.connected = false;
    },
  },
});

export const {
  setProducts,
  sseConnected,
  sseDisconnected,
} = productSlice.actions;

export default productSlice.reducer;
