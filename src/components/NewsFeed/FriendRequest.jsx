import { socket } from "@context/SocketProvider";
import { Check, Close } from "@mui/icons-material";
import { Avatar, Button, CircularProgress } from "@mui/material";
import {
  useAcceptFriendRequestMutation,
  useCancelFrientRequestMutation,
  useGetPendingFriendRequestsQuery,
} from "@services/friendApi";
import React, { useEffect } from "react";

const mockData = [
  {
    _id: "1",
    fullName: "John Doe",
    image: "https://i.pravatar.cc/300",
  },
  {
    _id: "2",
    fullName: "Jane Doe",
    image: "https://i.pravatar.cc/300",
  },
  {
    _id: "3",
    fullName: "John Smith",
    image: "https://i.pravatar.cc/300",
  },
];

const FriendRequestItem = ({ userInfo }) => {
  const [acceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();
  const [cancelFriendRequest, { isLoading: isCancelling }] =
    useCancelFrientRequestMutation();

  return (
    <div className="flex items-center gap-4">
      <div className="flex">
        <Avatar>{userInfo?.fullName?.[0].toUpperCase() || "A"}</Avatar>
      </div>
      <div>
        <p className="text-base font-medium">
          {userInfo?.fullName || "Anonymous"}
        </p>
        <p className="text-sm text-gray-500">12 mutal friends</p>
        <div className="mt-2 flex gap-2">
          {isAccepting ? (
            <CircularProgress size={24} />
          ) : (
            <Button
              variant="contained"
              startIcon={<Check />}
              style={{ textTransform: "none" }}
              size="small"
              onClick={() => acceptFriendRequest({ friendId: userInfo._id })}
            >
              Accept
            </Button>
          )}
          {isCancelling ? (
            <CircularProgress size={24} />
          ) : (
            <Button
              variant="outlined"
              startIcon={<Close />}
              style={{ textTransform: "none" }}
              size="small"
              color="error"
              onClick={() => cancelFriendRequest({ friendId: userInfo._id })}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const FriendRequest = () => {
  const { data, refetch } = useGetPendingFriendRequestsQuery();

  useEffect(() => {
    socket.on("friendRequestReceived", (data) => {
      if (data.from) refetch();
    });

    return () => {
      socket.off("friendRequestReceived");
    };
  });

  return (
    <div className="rounded-sm bg-white px-3 py-4 shadow">
      <p className="text-lg font-bold">FriendRequest</p>
      <div className="mt-3 flex flex-col gap-4">
        {(data?.slice(0, 3) || mockData)?.map((user) => (
          <FriendRequestItem key={user._id} userInfo={user} />
        ))}
      </div>
    </div>
  );
};

export default FriendRequest;
