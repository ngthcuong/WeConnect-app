import { Message, MoreHoriz } from "@mui/icons-material";
import { Avatar, Button, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const FriendCard = ({ friend }) => (
  <Card
    sx={{
      height: "100%",
      transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      },
    }}
  >
    <CardContent className="p-4">
      <div className="flex flex-col items-center text-center">
        {/* Avatar with online status */}
        <div className="relative mb-3">
          <Avatar
            src={friend.profileImage}
            alt={friend.fullName}
            sx={{ width: 80, height: 80, mb: 1 }}
          >
            {friend.fullName[0].toUpperCase()}
          </Avatar>
          {friend.isOnline && (
            <div className="absolute right-1 bottom-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
          )}
        </div>

        {/* Friend info */}
        <Typography variant="h6" className="mb-1 font-semibold">
          <Link
            to={`/user/${friend._id}`}
            className="text-gray-900 no-underline hover:text-blue-600"
          >
            {friend.fullName}
          </Link>
        </Typography>

        <Typography variant="body2" color="text.secondary" className="mb-2">
          {friend.mutualFriends || 0} mutual friends
        </Typography>

        {/* Action buttons */}
        <div className="flex w-full gap-2">
          <Button
            variant="outlined"
            size="small"
            startIcon={<Message />}
            className="flex-1"
            sx={{
              textTransform: "none",
              borderColor: "#246AA3",
              color: "#246AA3",
              "&:hover": {
                borderColor: "#246AA3",
                backgroundColor: "rgba(36, 106, 163, 0.04)",
              },
            }}
          >
            Message
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{
              minWidth: "40px",
              padding: "6px",
              borderColor: "#e0e0e0",
              color: "#666",
            }}
          >
            <MoreHoriz />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default FriendCard;
