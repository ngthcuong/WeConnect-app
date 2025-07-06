import ProtectedLayout from "@pages/ProtectedLayout";
import RootLayout from "@pages/RootLayout";

import RegisterPage from "@pages/auth/RegisterPage";
import AuthLayout from "@pages/auth/AuthLayout";
import LoginPage from "@pages/auth/LoginPage";
import OTPVerifyPage from "@pages/auth/OTPVerifyPage";
import HomePage from "@pages/HomePage";
import SearchUserPage from "@pages/SearchUserPage";
import UserProfile from "@pages/userProfile/UserProfile";
import UserPosts from "@pages/userProfile/UserPosts";
import UserFriends from "@pages/userProfile/UserFriends";

import { createBrowserRouter, Navigate } from "react-router-dom";
import AccountSettings from "@pages/AccountSettings";

export const router = createBrowserRouter([
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
            children: [
              // Khi user truy cập /user/:userId mà không có sub-path,
              // tự động redirect về /user/:userId/posts
              // replace: true: Thay thế history entry thay vì tạo mới
              {
                index: true,
                element: <Navigate to={"posts"} replace />,
              },
              {
                path: "posts",
                element: <UserPosts />,
              },
              {
                path: "friends",
                element: <UserFriends />,
              },
            ],
          },
          {
            path: "/settings",
            children: [
              {
                path: "account",
                element: <AccountSettings />,
              },
            ],
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
