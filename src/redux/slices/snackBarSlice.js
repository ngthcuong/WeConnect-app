import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  message: null,
  severity: "success",
};

export const snackBarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: (state, action) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    hideSnackbar: () => {
      return initialState;
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackBarSlice.actions;
export default snackBarSlice.reducer;
