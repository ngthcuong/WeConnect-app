import TimeAgo from "@components/TimeAgo";
import UserAvatar from "@components/UserAvatar";
import { useUserInfo } from "@hooks/useUserInfo";
import { Circle, Search as SearchIcon } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { useGetConversationQuery } from "@services/messageApi";
import classNames from "classnames";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const ConversationList = () => {
  const { data: conversations = [] } = useGetConversationQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const { userId: activeUserId } = useParams();
  const { _id: currentUserId } = useUserInfo();

  const filteredConversations = conversations.filter((conversation) => {
    const partner =
      conversation.sender._id === currentUserId
        ? conversation.receiver
        : conversation.sender;

    return partner.fullName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-[calc(100vh-110px)] flex-col overflow-hidden rounded-r-none border-r border-b border-gray-300 bg-white p-0">
      <div className="border border-x-0 border-y border-gray-300 p-3">
        <TextField
          fullWidth
          size="small"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-gray-400" />
                </InputAdornment>
              ),
            },
          }}
        />
      </div>
      <div className="overflow-y-auto">
        <div className="px-3 py-2 text-lg font-medium text-[#246aa3]">
          Chats
        </div>
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => {
            const partner =
              conversation.sender._id === currentUserId
                ? conversation.receiver
                : conversation.sender;

            const isActive = activeUserId === partner._id;
            const isUnread =
              !conversation.seen && conversation.sender._id !== currentUserId;
            return (
              <Link to={`/messages/${partner._id}`} key={partner._id}>
                <div
                  className={classNames(
                    "relative flex items-center gap-2 px-4 py-3 hover:bg-gray-100",
                    {
                      "bg-primary-main hover:bg-primary-dark text-white":
                        isActive,
                    },
                  )}
                >
                  <UserAvatar
                    name={partner.fullName}
                    src={partner.image}
                    className={classNames("!h-10 !w-10", {
                      "border-2 border-white": isActive,
                    })}
                  />
                  <div className="w-full">
                    <div className="flex justify-between">
                      <p
                        className={classNames(
                          "font-semibold",
                          isUnread ? "font-extrabold" : "",
                        )}
                      >
                        {partner.fullName}
                      </p>
                      <TimeAgo
                        date={conversation.createdAt}
                        className={classNames("text-dark-400 text-xs", {
                          "text-white": isActive,
                          "font-medium": isUnread,
                        })}
                      />
                    </div>
                    <p
                      className={classNames(
                        "text-dark-400 max-w-[180px] truncate text-sm",
                        {
                          "text-white": isActive,
                          "font-medium text-black": isUnread,
                        },
                      )}
                    >
                      {conversation.sender._id === currentUserId ? (
                        <span>You: </span>
                      ) : null}
                      {conversation.message}
                    </p>
                  </div>
                  {isUnread && (
                    <Circle className="text-primary-main absolute top-1/2 right-4 ml-1 !h-2 !w-2" />
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <div className="flex h-64 flex-col items-center justify-center p-4 text-center">
            <p className="mb-2 font-medium text-gray-500">
              No conversations yet
            </p>
            <p className="text-sm text-gray-400">
              Start a new conversation by searching for friends
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default ConversationList;
