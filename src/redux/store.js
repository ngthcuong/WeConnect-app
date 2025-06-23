import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { rootApi } from "@services/rootApi";
import snackBarReducer from "./slices/snackBarSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    snackbar: snackBarReducer,
    [rootApi.reducerPath]: rootApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(rootApi.middleware);
  },
});
