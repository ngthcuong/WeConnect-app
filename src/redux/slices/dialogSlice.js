import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  maxWidth: "xs",
  fullWidth: true,
  title: null,
  content: null,
  actions: null,
};

export const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    showDialog: (state, action) => {
      return {
        ...state,
        ...action.payload,
        open: true,
      };
    },
    hideDialog: () => {
      return initialState;
    },
  },
});

export const { showDialog, hideDialog } = dialogSlice.actions;
export default dialogSlice.reducer;
