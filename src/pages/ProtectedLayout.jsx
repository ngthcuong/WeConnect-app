import { useGetAuthUserQuery } from "@services/rootApi";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const response = useGetAuthUserQuery();

  if (response.isLoading) {
    return <p>Loading</p>;
  }

  if (!response?.data?._id) {
    return <Navigate to={"/login"} />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
