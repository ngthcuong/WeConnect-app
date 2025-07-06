import { createRoot } from "react-dom/client";
import "./index.css";

import { ThemeProvider } from "@emotion/react";
import theme from "@/configs/mui.config";
import { RouterProvider } from "react-router-dom";

import { Provider } from "react-redux";
import { persistor, store } from "@redux/store";
import { PersistGate } from "redux-persist/integration/react";

import { CircularProgress } from "@mui/material";

import Dialog from "@components/NewsFeed/Dialog";
import { router } from "./routes";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<CircularProgress />} persistor={persistor}>
      {/* Sử dụng theme của MUI được custom */}
      <ThemeProvider theme={theme}>
        {/* <ModalProvider> */}
        <RouterProvider router={router} />
        <Dialog />
        {/* </ModalProvider> */}
      </ThemeProvider>
    </PersistGate>
  </Provider>,
);
