import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDrawerOpen: false,
};

export const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    showDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    hideDrawer: () => {
      return initialState;
    },
  },
});

export const { showDrawer, hideDrawer } = drawerSlice.actions;
export default drawerSlice.reducer;
