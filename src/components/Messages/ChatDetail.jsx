import React, { useEffect, useMemo, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import { Phone, Videocam } from "@mui/icons-material";
import UserAvatar from "@components/UserAvatar";
import { useParams } from "react-router-dom";
import { useUserInfo } from "@hooks/useUserInfo";
import TimeAgo from "@components/TimeAgo";
import MessageCreation from "./MessageCreation";
import {
  useGetMessagesQuery,
  useUpdateSeenMessageMutation,
} from "@services/messageApi";
import { useGetUserInfoByIdQuery } from "@services/userApi";
import dayjs from "dayjs";

const ChatDetail = () => {
  const { userId } = useParams();
  const { _id: currentUserId } = useUserInfo();
  const { data: userInfo = {} } = useGetUserInfoByIdQuery(userId);
  const { fullName, image } = userInfo;
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const messageEndRef = useRef(null);

  const { data = [] } = useGetMessagesQuery(
    {
      userId,
      offset,
      limit,
    },
    // { pollingInterval: 2000 },
  );
  const messages = useMemo(() => data.messages || [], [data.messages]);

  const [updateSeenMessage] = useUpdateSeenMessageMutation();

  useEffect(() => {
    if (userId) updateSeenMessage({ sender: userId });
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [updateSeenMessage, userId, messages]);

  // Hàm dùng để nhóm messages
  const getGroupedMessages = (messages) => {
    if (!Array.isArray(messages) || messages.length === 0) {
      return {};
    }

    // Bước 1: Nhóm tin nhắn theo ngày
    const groupedByDate = messages.reduce((groups, msg) => {
      if (!msg || !msg.createdAt || !msg.sender) {
        return groups; // Skip invalid messages
      }

      // Lấy ngày từ thời gian tạo tin nhắn và định dạng thành "YYYY-MM-DD"
      const date = dayjs(msg.createdAt).format("YYYY-MM-DD");

      // Nếu chưa có nhóm cho ngày này, tạo một mảng rỗng
      if (!groups[date]) {
        groups[date] = [];
      }

      // Thêm tin nhắn vào nhóm của ngày tương ứng
      groups[date].push(msg);
      return groups;
    }, {});

    // Bước 2: Tạo cấu trúc dữ liệu mới để nhóm tin nhắn theo người gửi và thời gian
    const fullyGrouped = {};

    // Duyệt qua từng ngày và danh sách tin nhắn của ngày đó
    Object.entries(groupedByDate).forEach(([date, dateMessages]) => {
      // Khởi tạo mảng rỗng cho ngày này trong cấu trúc dữ liệu mới
      fullyGrouped[date] = [];
      // Biến tạm để lưu nhóm tin nhắn hiện tại đang xử lý
      let groupedByMinutues = null;

      // Duyệt qua từng tin nhắn trong ngày
      dateMessages.forEach((msg) => {
        // Chuyển đổi thời gian tạo tin nhắn thành đối tượng dayjs để dễ so sánh
        const messageTime = dayjs(msg.createdAt);

        // Kiểm tra xem có cần tạo nhóm mới hay không dựa trên 3 điều kiện:
        // 1. Chưa có nhóm nào (groupedByMinutues là null)
        // 2. Người gửi khác với người gửi của nhóm hiện tại
        // 3. Thời gian giữa tin nhắn hiện tại và tin nhắn cuối cùng của nhóm > 2 phút
        if (
          !groupedByMinutues ||
          groupedByMinutues.senderId !== msg.sender._id ||
          messageTime.diff(dayjs(groupedByMinutues.endTime), "minute") > 2
        ) {
          // Tạo nhóm mới với thông tin từ tin nhắn hiện tại
          groupedByMinutues = {
            senderId: msg.sender._id, // ID của người gửi
            startTime: msg.createdAt, // Thời gian bắt đầu nhóm (thời gian của tin nhắn đầu tiên)
            endTime: msg.createdAt, // Thời gian kết thúc nhóm (thời gian của tin nhắn cuối cùng)
            messages: [msg], // Mảng chứa các tin nhắn trong nhóm
          };
          // Thêm nhóm mới vào mảng của ngày tương ứng
          fullyGrouped[date].push(groupedByMinutues);
        } else {
          // Nếu không cần tạo nhóm mới, thêm tin nhắn vào nhóm hiện tại
          groupedByMinutues.messages.push(msg);
          // Cập nhật thời gian kết thúc của nhóm
          groupedByMinutues.endTime = msg.createdAt;
        }
      });
    });

    // Trả về cấu trúc dữ liệu đã được nhóm đầy đủ
    return fullyGrouped;
  };

  // Sử dụng useMemo để tránh tính toán lại khi không cần thiết
  const groupedMessages = useMemo(
    () => getGroupedMessages(messages),
    [messages],
  );

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
          {Object.keys(groupedMessages).length > 0 ? (
            Object.entries(groupedMessages).map(([date, groups]) => (
              <div key={`date-${date}`}>
                {/* Hiển thị các nhóm tin nhắn trong ngày */}
                <div className="my-4 flex justify-center">
                  <div className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-600">
                    {dayjs(date).format("MMMM D, YYYY")}
                  </div>
                </div>

                {groups.map((group, groupIndex) => {
                  // Kiểm tra tính hợp lệ của nhóm
                  // Xác định người gửi và người nhận
                  if (
                    !group.messages ||
                    group.messages.length === 0 ||
                    !group.messages[0].sender
                  ) {
                    return null;
                  }

                  // Xác định người gửi và người nhận - partner
                  const firstMessage = group.messages[0];
                  const isCurrentUser =
                    firstMessage.sender._id === currentUserId;
                  const partner = isCurrentUser
                    ? firstMessage.receiver
                    : firstMessage.sender;

                  if (!partner) return null;

                  return (
                    <div key={`group-${date}-${groupIndex}`} className="mb-4">
                      <div
                        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                      >
                        <div className="flex max-w-[70%]">
                          {!isCurrentUser && (
                            <UserAvatar
                              name={partner.fullName}
                              src={partner.image}
                              className="mr-2 mb-6 !h-8 !w-8 self-end"
                            />
                          )}
                          <div className="flex flex-col">
                            {group.messages.map((message, msgIndex) => (
                              <div
                                key={
                                  message._id ||
                                  message.id ||
                                  `msg-${date}-${groupIndex}-${msgIndex}`
                                }
                                className={`mb-1 ${
                                  isCurrentUser ? "self-end" : ""
                                }`}
                              >
                                <div
                                  className={`rounded-lg px-3 py-1.5 ${
                                    isCurrentUser
                                      ? "bg-primary-main bg-[#247fc3] text-white"
                                      : "bg-white text-gray-800 shadow-sm"
                                  } ${
                                    group.messages.length > 1
                                      ? msgIndex === 0
                                        ? isCurrentUser
                                          ? "rounded-tr-none"
                                          : "rounded-tl-none"
                                        : msgIndex === group.messages.length - 1
                                          ? isCurrentUser
                                            ? "rounded-br-none"
                                            : "rounded-bl-none"
                                          : isCurrentUser
                                            ? "rounded-r-none"
                                            : "rounded-l-none"
                                      : isCurrentUser
                                        ? "rounded-tr-none"
                                        : "rounded-tl-none"
                                  }`}
                                >
                                  {message.message}
                                </div>
                              </div>
                            ))}
                            <div
                              className={`mt-1 flex items-center text-xs ${isCurrentUser ? "justify-end" : "justify-start"}`}
                            >
                              <TimeAgo
                                date={group.endTime}
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
                              className="mb-6 ml-2 !h-8 !w-8 self-end"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">No messages</p>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <MessageCreation userId={userId} messageEndRef={messageEndRef} />
    </div>
  );
};

export default ChatDetail;
