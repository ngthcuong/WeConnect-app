import { Mic, Send } from "@mui/icons-material";
import { Button, IconButton, TextField } from "@mui/material";
import { showSnackbar } from "@redux/slices/snackBarSlice";
import { useSendMessageMutation } from "@services/messageApi";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const MessageCreation = ({ userId }) => {
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");

  const [sendMessage, { isError }] = useSendMessageMutation();

  const handleSendMessage = async () => {
    await sendMessage({ message: message, receiver: userId }).unwrap();
    setMessage("");
  };

  useEffect(() => {
    if (isError) {
      dispatch(
        showSnackbar({ message: "Can not send message!", severity: "error" }),
      );
    }
  });

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
