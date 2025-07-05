import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { ThemeProvider } from "@emotion/react";
import theme from "@/configs/mui.config";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Provider } from "react-redux";
import { persistor, store } from "@redux/store";
import { PersistGate } from "redux-persist/integration/react";

import ModalProvider from "@context/ModalProvider";

import { CircularProgress } from "@mui/material";

import Dialog from "@components/NewsFeed/Dialog";

import ProtectedLayout from "@pages/ProtectedLayout";
import RootLayout from "@pages/RootLayout";

import RegisterPage from "./pages/auth/RegisterPage";
import AuthLayout from "@pages/auth/AuthLayout";
import LoginPage from "@pages/auth/LoginPage";
import OTPVerifyPage from "@pages/auth/OTPVerifyPage";
import HomePage from "@pages/HomePage";
import SearchUserPage from "@pages/SearchUserPage";
import UserProfile from "@pages/userProfile/UserProfile";

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
          {
            path: "/search/users/:searchQuery",
            element: <SearchUserPage />,
          },
          {
            path: "/user/:userId",
            element: <UserProfile />,
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
