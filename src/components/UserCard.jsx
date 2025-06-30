import { Message, PersonAddAlt1 } from "@mui/icons-material";
import { Avatar, Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const UserCard = (userInfo) => {
  return (
    <div className="flex flex-col items-center gap-2 rounded-sm bg-white p-4 shadow-sm">
      <Avatar>{userInfo?.fullName?.[0].toUpperCase() || "A"}</Avatar>
      <Link className="font-medium" to={"#"}>
        {userInfo?.fullName || "Anonymous"}
      </Link>
      <Button
        variant="contained"
        startIcon={<Message />}
        style={{ textTransform: "none" }}
        size="small"
      >
        Message
      </Button>
      <Button
        variant="outlined"
        startIcon={<PersonAddAlt1 />}
        style={{ textTransform: "none" }}
        size="small"
      >
        Add Friend
      </Button>
    </div>
  );
};

export default UserCard;
