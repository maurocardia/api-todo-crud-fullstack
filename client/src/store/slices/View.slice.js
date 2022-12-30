import { createSlice } from "@reduxjs/toolkit";

export const viewSlice = createSlice({
  name: "view",
  initialState: "toDo",
  reducers: {
    setView: (state, action) => {
      const view = action.payload;
      return view;
    },
  },
});

export const { setView } = viewSlice.actions;

export default viewSlice.reducer;
