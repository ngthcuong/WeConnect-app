import { socket } from "@context/SocketProvider";
import {
  Check,
  Close,
  Message,
  PersonAddAlt1,
  PersonRemove,
} from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import { useSendFriendRequestMutation } from "@services/friendApi";
import React from "react";

const FriendActionButtons = ({ userInfo }) => {
  const [sendFriendRequest, { isLoading }] = useSendFriendRequestMutation();

  const handleSendFriendRequest = async () => {
    await sendFriendRequest({ friendId: userInfo._id }).unwrap();
    socket.emit("friendRequestSent", { receiverId: userInfo._id });
  };

  if (userInfo?.isFriend) {
    return (
      <div className="flex gap-2">
        <Button
          variant="outlined"
          startIcon={<PersonRemove />}
          style={{ textTransform: "none" }}
          size="small"
        >
          Unfriend
        </Button>
        <Button
          variant="contained"
          startIcon={<Message />}
          style={{ textTransform: "none" }}
          size="small"
        >
          Message
        </Button>
      </div>
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

export default FriendActionButtons;
