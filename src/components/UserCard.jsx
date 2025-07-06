import { Avatar } from "@mui/material";

import React from "react";
import { Link } from "react-router-dom";
import FriendActionButtons from "./FriendActionButtons";

const UserCard = ({ userInfo }) => {
  return (
    <div className="flex flex-col items-center gap-2 rounded-sm bg-white p-4 shadow-sm">
      <Avatar>{userInfo?.fullName?.[0].toUpperCase() || "A"}</Avatar>
      <Link className="font-medium" to={`/user/${userInfo?._id}`}>
        {userInfo?.fullName || "Anonymous"}
      </Link>
      <FriendActionButtons userInfo={userInfo} />
    </div>
  );
};

export default UserCard;
