import { Mic, Send } from "@mui/icons-material";
import { Button, IconButton, TextField } from "@mui/material";
import React, { useState } from "react";

const MessageCreation = ({ handleSendMessage }) => {
  const [message, setMessage] = useState("");

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
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default MessageCreation;
