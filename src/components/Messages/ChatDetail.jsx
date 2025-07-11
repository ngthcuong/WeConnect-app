import React, { useState } from "react";
import { Avatar, IconButton, TextField, Button } from "@mui/material";
import { Phone, Videocam, Send, Mic } from "@mui/icons-material";
import UserAvatar from "@components/UserAvatar";
import { useParams } from "react-router-dom";
import { useUserInfo } from "@hooks/useUserInfo";
import TimeAgo from "@components/TimeAgo";
import MessageCreation from "./MessageCreation";
import { useGetMessagesQuery } from "@services/messageApi";
import { useGetUserInfoByIdQuery } from "@services/userApi";

const ChatDetail = () => {
  const { userId } = useParams();
  const { _id: currentUserId } = useUserInfo();
  const { fullName, image } = useGetUserInfoByIdQuery(userId);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const { data = [] } = useGetMessagesQuery({
    userId,
    offset,
    limit,
  });
  const messages = data.messages || [];

  return (
    <div className="flex h-[calc(100vh-110px)] flex-col overflow-hidden rounded-lg border-gray-300 bg-[#f8f7fa]">
      {/* Header */}
      <div className="flex items-center justify-between border-y border-gray-300 bg-white p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <UserAvatar name={fullName} src={image} className="!h-10 !w-10" />
          </div>
          <div>
            <h3 className="font-medium">{fullName}</h3>
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
          {messages.map((message) => {
            const isCurrentUser = message.sender._id === currentUserId;
            const partner = isCurrentUser ? message.receiver : message.sender;

            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div className="flex max-w-[70%]">
                  {!isCurrentUser && (
                    <UserAvatar
                      name={partner.fullName}
                      src={partner.image}
                      className="mr-2 mb-1 !h-8 !w-8"
                    />
                  )}
                  <div className="flex flex-col">
                    <div
                      className={`rounded-lg px-3 py-1.5 ${
                        isCurrentUser
                          ? "bg-primary-main self-end rounded-tr-none bg-[#247fc3] text-white"
                          : "rounded-tl-none bg-white text-gray-800 shadow-sm"
                      }`}
                    >
                      {message.message}
                    </div>
                    <div
                      className={`mt-1 flex items-center text-xs ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <TimeAgo
                        date={message.createdAt}
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
                      className="mb-1 ml-2 !h-8 !w-8"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message Input */}
      <MessageCreation userId={userId} />
    </div>
  );
};

export default ChatDetail;
