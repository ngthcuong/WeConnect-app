import Header from "@components/Header";
import FriendRequest from "@components/NewsFeed/FriendRequest";
import PostCreation from "@components/NewsFeed/PostCreation";
import PostList from "@components/NewsFeed/PostList";
import Sidebar from "@components/NewsFeed/Sidebar";
import React from "react";

const HomePage = () => {
  return (
    <div className="h-100vh bg-[#F8F7FA]">
      {/* <Header /> */}
      <div className="flex gap-4 p-6">
        <div>
          <Sidebar />
        </div>
        <div className="flex-1">
          <PostCreation />
          <PostList />
        </div>
        <div className="hidden w-64 sm:block">
          <FriendRequest />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
