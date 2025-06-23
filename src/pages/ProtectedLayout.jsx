import { saveUserInfo } from "@redux/slices/authSlice";
import { useGetAuthUserQuery } from "@services/rootApi";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const response = useGetAuthUserQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (response.isSuccess) {
      dispatch(saveUserInfo(response.data));
    }
  }, [response.isSuccess, dispatch, response.data]);

  if (response.isLoading) {
    return <p>Loading</p>;
  }

  if (!response?.data?._id) {
    return <Navigate to={"/login"} />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
