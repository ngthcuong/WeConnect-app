import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  refreshToken: null,
  user: {},
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: () => {
      return initialState;
    },
    saveUserInfo: (state, action) => {
      state.user = action.payload.user;
    },
  },
});

export const { login, logout, saveUserInfo } = authSlice.actions;
export default authSlice.reducer;
