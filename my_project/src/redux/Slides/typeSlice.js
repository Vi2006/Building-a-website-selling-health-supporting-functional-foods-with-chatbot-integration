import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: [],
};

export const typeSlice = createSlice({
  name: "type",
  initialState,
  reducers: {
    updateType: (state, action) => {
      state.type = action.payload;
    },
  },
});

export const { updateType } = typeSlice.actions;

export default typeSlice.reducer;
