import React from "react";
import { Avatar, IconButton, TextField, Button } from "@mui/material";
import { Phone, Videocam, Send, Mic } from "@mui/icons-material";
import UserAvatar from "@components/UserAvatar";
import { useParams } from "react-router-dom";
import { useUserInfo } from "@hooks/useUserInfo";
import TimeAgo from "@components/TimeAgo";
import MessageCreation from "./MessageCreation";

// Giả lập dữ liệu tin nhắn
const mockMessages = [
  {
    id: 1,
    senderId: "user1",
    text: "Hey John, I am looking for the best admin template. Could you please help me to find it out?",
    timestamp: "2023-06-15T13:20:00",
  },
  {
    id: 2,
    senderId: "user1",
    text: "It should be MUI v5 compatible.",
    timestamp: "2023-06-15T13:22:00",
  },
  {
    id: 3,
    senderId: "currentUser",
    text: "How can we help? We're here for you!",
    timestamp: "2023-06-15T13:15:00",
  },
  {
    id: 4,
    senderId: "currentUser",
    text: "Absolutely!",
    timestamp: "2023-06-15T13:28:00",
  },
  {
    id: 5,
    senderId: "currentUser",
    text: "This admin template is built with MUI!",
    timestamp: "2023-06-15T13:28:30",
  },
  {
    id: 6,
    senderId: "user1",
    text: "Looks clean and fresh UI. 😊",
    timestamp: "2023-06-15T13:36:00",
  },
  {
    id: 7,
    senderId: "user1",
    text: "It's perfect for my next project.",
    timestamp: "2023-06-15T13:37:00",
  },
  {
    id: 8,
    senderId: "user1",
    text: "How can I purchase it?",
    timestamp: "2023-06-15T13:38:00",
  },
  {
    id: 9,
    senderId: "currentUser",
    text: "Thanks. From our official site 😊",
    timestamp: "2023-06-15T13:45:00",
  },
];

const ChatDetail = () => {
  const { userId } = useParams();
  const { _id: currentUserId } = useUserInfo();

  const chatPartner = {
    _id: "user1",
    fullName: "Waldemar Mannering",
    image: null,
  };

  return (
    <div className="flex h-[calc(100vh-110px)] flex-col overflow-hidden rounded-lg border-gray-300 bg-[#f8f7fa]">
      {/* Header */}
      <div className="flex items-center justify-between border-y border-gray-300 bg-white p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <UserAvatar
              name={chatPartner.fullName}
              src={chatPartner.image}
              className="!h-10 !w-10"
            />
          </div>
          <div>
            <h3 className="font-medium">{chatPartner.fullName}</h3>
          </div>
        </div>
        <div className="flex gap-2">
          <IconButton size="small" color="primary">
            <Phone />
          </IconButton>
          <IconButton size="small" color="primary">
            <Videocam />
          </IconButton>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {mockMessages.map((message) => {
            const isCurrentUser = message.senderId === "currentUser";
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div className="flex max-w-[70%]">
                  {!isCurrentUser && (
                    <UserAvatar
                      name={chatPartner.fullName}
                      src={chatPartner.image}
                      className="mr-2 mb-1 !h-8 !w-8 self-end"
                    />
                  )}
                  <div className="flex flex-col">
                    <div
                      className={`rounded-lg p-3 ${
                        isCurrentUser
                          ? "bg-primary-main rounded-tr-none bg-[#247fc3] text-white"
                          : "rounded-tl-none bg-white text-gray-800 shadow-sm"
                      }`}
                    >
                      {message.text}
                    </div>
                    <div
                      className={`mt-1 flex items-center text-xs ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <TimeAgo
                        date={message.timestamp}
                        className="text-gray-500"
                      />
                      {isCurrentUser && (
                        <span className="ml-1 text-green-500">✓</span>
                      )}
                    </div>
                  </div>
                  {isCurrentUser && (
                    <UserAvatar
                      isMyAvatar={true}
                      className="mb-1 ml-2 !h-8 !w-8 self-end"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message Input */}
      <MessageCreation />
    </div>
  );
};

export default ChatDetail;
