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

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
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
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  // Sử dụng theme của MUI được custom
  <ThemeProvider theme={theme}>
    <ModalProvider>
      <RouterProvider router={router} />
    </ModalProvider>
  </ThemeProvider>,
);
