import { Events } from "@libs/constants";
import { generateNotificationMessage } from "@libs/utils";
import { showSnackbar } from "@redux/slices/snackBarSlice";
import { rootApi } from "@services/rootApi";
import { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BASE_URL, {
  autoConnect: false,
  path: "/v1/we-connect/socket.io",
});

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useModalContext = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
  const token = useSelector((store) => store.auth.accessToken);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.auth = { token };
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected to socket server");
    });

    // Clean up function được chạy trước tiên trước khi chạy các dòng lệnh ở trên
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (!socket) return;

    socket.on(Events.CREATE_NOTIFICATION_REQUEST, (data) => {
      dispatch(
        rootApi.util.updateQueryData("getNotifications", undefined, (draft) => {
          draft.notifications.unshift(data);
        }),
      );

      dispatch(
        showSnackbar({
          message: generateNotificationMessage(data),
          type: "info",
        }),
      );
    });

    // Clean up function được chạy trước tiên trước khi chạy các dòng lệnh ở trên
    return () => {
      socket.off(Events.CREATE_NOTIFICATION_REQUEST);
    };
  }, [dispatch]);

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};
export default SocketProvider;
