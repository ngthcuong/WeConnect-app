import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { rootApi } from "@services/rootApi";
import snackBarReducer from "./slices/snackBarSlice";
import drawerReducer from "./slices/drawerSlice";
import dialogReducer from "./slices/dialogSlice";
import storage from "redux-persist/lib/storage"; // localStorage
import { persistReducer, persistStore } from "redux-persist";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { logoutMiddleware } from "./middleware";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: [rootApi.reducerPath, "dialog", "drawer", "snackbar"], // không lưu trạng thái của rootApi.reducerPath
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authReducer,
    snackbar: snackBarReducer,
    drawer: drawerReducer,
    dialog: dialogReducer,
    [rootApi.reducerPath]: rootApi.reducer,
  }),
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logoutMiddleware, rootApi.middleware);
  },
});

export const persistor = persistStore(store);
