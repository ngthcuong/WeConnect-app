import { Mic, Send } from "@mui/icons-material";
import { Button, IconButton, TextField } from "@mui/material";
import { showSnackbar } from "@redux/slices/snackBarSlice";
import { useSendMessageMutation } from "@services/messageApi";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNotification } from "@hooks/index";
import { socket } from "@context/SocketProvider";
import { Events } from "@libs/constants";

const MessageCreation = ({ userId, messageEndRef }) => {
  const dispatch = useDispatch();
  const { createNotification } = useNotification();

  const [message, setMessage] = useState("");
  const [sendMessage] = useSendMessageMutation();

  const handleSendMessage = async () => {
    try {
      const response = await sendMessage({
        message,
        receiver: userId,
      }).unwrap();
      setMessage("");

      createNotification({
        postId: null,
        notificationType: "message",
        notificationTypeId: response._id,
        receiverId: userId,
      });

      socket.emit(Events.CREATE_MESSAGE, response);

      // Cuộn xuống tin nhắn mới nhất
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      // if (onSendMessage) onSendMessage();
    } catch (error) {
      console.error("Failed to send message:", error);
      dispatch(
        showSnackbar({ message: "Cannot send message!", severity: "error" }),
      );
    }
  };

  return (
    <div className="mx-4 my-2 bg-white p-3">
      <div className="flex items-center gap-2">
        <TextField
          fullWidth
          placeholder="Type your message here..."
          variant="outlined"
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && message.trim()) {
              handleSendMessage();
            }
          }}
          slotProps={{
            endAdornment: (
              <IconButton size="small">
                <Mic />
              </IconButton>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<Send />}
          onClick={handleSendMessage}
          style={{ textTransform: "none" }}
          disabled={!message.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default MessageCreation;
