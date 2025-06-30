import { socket } from "@context/SocketProvider";
import { Check, Close, Message, PersonAddAlt1 } from "@mui/icons-material";
import { Avatar, Button, CircularProgress } from "@mui/material";
import { useSendFriendRequestMutation } from "@services/rootApi";
import React from "react";
import { Link } from "react-router-dom";

const UserCard = ({ userInfo }) => {
  const [sendFriendRequest, { isLoading }] = useSendFriendRequestMutation();

  const handleSendFriendRequest = async () => {
    await sendFriendRequest({ friendId: userInfo._id }).unwrap();
    socket.emit("friendRequestSent", { receiverId: userInfo._id });
  };

  const getActionButtons = () => {
    if (userInfo?.isFriend) {
      return (
        <Button
          variant="contained"
          startIcon={<Message />}
          style={{ textTransform: "none" }}
          size="small"
        >
          Message
        </Button>
      );
    }

    if (userInfo?.requestSent) {
      return (
        <Button
          variant="outlined"
          startIcon={<Check />}
          style={{ textTransform: "none" }}
          size="small"
          disabled
        >
          Request Sent
        </Button>
      );
    }

    if (userInfo?.requestReceived) {
      return (
        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<Check />}
            style={{ textTransform: "none" }}
            size="small"
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            startIcon={<Close />}
            style={{ textTransform: "none" }}
            size="small"
          >
            Cancel
          </Button>
        </div>
      );
    }

    return isLoading ? (
      <CircularProgress size={24} />
    ) : (
      <Button
        variant="outlined"
        startIcon={<PersonAddAlt1 />}
        style={{ textTransform: "none" }}
        size="small"
        onClick={handleSendFriendRequest}
      >
        Add Friend
      </Button>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2 rounded-sm bg-white p-4 shadow-sm">
      <Avatar>{userInfo?.fullName?.[0].toUpperCase() || "A"}</Avatar>
      <Link className="font-medium" to={"#"}>
        {userInfo?.fullName || "Anonymous"}
      </Link>
      {getActionButtons()}
    </div>
  );
};

export default UserCard;
