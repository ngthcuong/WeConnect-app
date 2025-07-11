import ConversationList from "@components/Messages/ConversationList";
import React from "react";
import { Outlet } from "react-router-dom";

const MessagesPage = () => {
  return (
    <div className="mx-auto mt-4 flex bg-gray-100 px-4">
      <div className="flex-1/5">
        <ConversationList />
      </div>
      <div className="flex-4/5">
        <Outlet />
      </div>
    </div>
  );
};

export default MessagesPage;
