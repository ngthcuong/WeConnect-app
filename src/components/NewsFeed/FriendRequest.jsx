import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import React from "react";

const FriendRequest = () => {
  const theme = useTheme();
  const isMoble = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    // !isMoble && (
    <div className="border-l border-gray-200 p-4">FriendRequest</div>
    // )
  );
};

export default FriendRequest;
