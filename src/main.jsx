import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import HomePage from "@pages/HomePage";
import { ThemeProvider } from "@emotion/react";
import theme from "@/configs/mui.config";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "@pages/RootLayout";
import ModalProvider from "@context/ModalProvider";

import RegisterPage from "./pages/auth/RegisterPage";
import AuthLayout from "@pages/auth/AuthLayout";
import LoginPage from "@pages/auth/LoginPage";
import OTPVerifyPage from "@pages/auth/OTPVerifyPage";
import { Provider } from "react-redux";
import { persistor, store } from "@redux/store";
import ProtectedLayout from "@pages/ProtectedLayout";
import { PersistGate } from "redux-persist/integration/react";
import { CircularProgress } from "@mui/material";
import Dialog from "@components/NewsFeed/Dialog";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/register",
            element: <RegisterPage />,
          },
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/verify-otp",
            element: <OTPVerifyPage />,
          },
        ],
      },
    ],
  },
]);

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
