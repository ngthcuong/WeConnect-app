import { Check, Close } from "@mui/icons-material";
import { Avatar, Button } from "@mui/material";
import React from "react";

const FriendRequestItem = ({ userInfo }) => {
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
          <Button
            variant="contained"
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
            color="error"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

const FriendRequest = () => {
  return (
    <div className="rounded-sm bg-white px-3 py-4 shadow">
      <p className="text-lg font-bold">FriendRequest</p>
      <div className="mt-3 flex flex-col gap-4">
        <FriendRequestItem />
        <FriendRequestItem />
      </div>
    </div>
  );
};

export default FriendRequest;
