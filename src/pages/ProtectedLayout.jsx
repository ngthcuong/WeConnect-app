import Header from "@components/Header";
import Loading from "@components/Loading";
import SocketProvider from "@context/SocketProvider";
import { saveUserInfo } from "@redux/slices/authSlice";
import { useGetAuthUserQuery } from "@services/authApi";
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
    return <Loading />;
  }

  // Xử lý tập trung ở rootApi thay vì ở đây
  // if (!response?.data?._id) {
  //   return <Navigate to={"/login"} />;
  // }

  return (
    <SocketProvider>
      <div className="h-screen bg-[#F8F7FA]">
        <Header />
        <div className="">
          <Outlet />
        </div>
      </div>
    </SocketProvider>
  );
};

export default ProtectedLayout;
