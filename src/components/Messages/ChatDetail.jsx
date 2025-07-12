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
  const { fullName, image } = useGetUserInfoByIdQuery(userId);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const messageEndRef = useRef(null);

  const { data = [] } = useGetMessagesQuery({
    userId,
    offset,
    limit,
  });
  const messages = useMemo(() => data.messages || [], [data.messages]);

  const [updateSeenMessage] = useUpdateSeenMessageMutation();

  useEffect(() => {
    if (userId) updateSeenMessage(userId);
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [updateSeenMessage, userId]);

  // Hàm dùng để nhóm messages
  const getGroupedMessages = (messages) => {
    // Bước 1: Nhóm tin nhắn theo ngày
    const groupedByDate = messages.reduce((groups, msg) => {
      // Lấy ngày từ thời gian tạo tin nhắn và định dạng thành "MM-DD-YYYY"
      const date = dayjs(msg.createdAt).format("MM-DD-YYYY");

      // Nếu chưa có nhóm cho ngày này, tạo một mảng rỗng
      if (!groups[date]) {
        groups[date] = [];
      }

      // Thêm tin nhắn vào nhóm của ngày tương ứng
      groups[date].push(msg);
      return groups;
      // {
      //   "MM-DD-YYYY1": [message1, message2, ...],
      //   "MM-DD-YYYY2": [message3, message4, ...],
      //   ...
      // }
    }, {});

    // Bước 2: Tạo cấu trúc dữ liệu mới để nhóm tin nhắn theo người gửi và thời gian
    const fullyGrouped = {};

    // Duyệt qua từng ngày và danh sách tin nhắn của ngày đó
    // Object.entries(groupedByDate) sẽ trả về kết quả như sau:
    // [
    //   ["MM-DD-YYYY1", [message1, message2, ...]],
    //   ["MM-DD-YYYY2", [message3, message4, ...]],
    //   ...
    // ]
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
    // {
    //   "YYYY-MM-DD": [
    //     {
    //       senderId: "user1",
    //       startTime: "2023-01-01T10:00:00",
    //       endTime: "2023-01-01T10:01:30",
    //       messages: [message1, message2, ...]
    //     },
    //     {
    //       senderId: "user2",
    //       startTime: "2023-01-01T10:05:00",
    //       endTime: "2023-01-01T10:06:00",
    //       messages: [message3, message4, ...]
    //     },
    //     ...
    //   ],
    //   ...
    // }
  };

  // const scrollToBottom = () => {
  //   messageRef.current?.scrollIntoView({ behavior: "smooth" });
  // };
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

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
          <div ref={messageEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <MessageCreation
        userId={userId}
        // onSendMessage={scrollToBottom}
        messageEndRef={messageEndRef}
      />
    </div>
  );
};

export default ChatDetail;
