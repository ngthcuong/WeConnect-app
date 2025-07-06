import Header from "@components/Header";
import Post from "@components/NewsFeed/Post";
import { Avatar, Button, Tab, Tabs } from "@mui/material";
import { LocationOn, Cake } from "@mui/icons-material";
import React, { useState } from "react";
import { useUserInfo } from "@hooks/useUserInfo";
import PostCreation from "@components/NewsFeed/PostCreation";
import { useGetUserInfoByIdQuery } from "@services/userApi";
import UserPosts from "@pages/userProfile/UserPosts";
import FriendActionButtons from "@components/FriendActionButtons";
import { Outlet, useParams } from "react-router-dom";
import UserFriend from "./UserFriend";

const UserProfile = () => {
  const { userId } = useParams();
  const { _id, fullName } = useUserInfo();
  const { data = {} } = useGetUserInfoByIdQuery(userId);
  const isMyProfile = data._id === _id;

  const [activeTab, setActiveTab] = useState(0);

  const TABS = [
    {
      path: "posts",
      label: "Posts",
      index: 0,
    },
    {
      path: "about",
      label: "About",
      index: 1,
    },
    {
      path: "friends",
      label: "Friends",
      index: 2,
    },
    {
      path: "photos",
      label: "Photos",
      index: 3,
    },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl px-4">
        {/* Cover Photo Section */}
        <div className="relative">
          <div className="h-80 w-full rounded-t-lg bg-gradient-to-r from-blue-400 to-purple-500">
            <img
              src="https://placehold.co/1920x320"
              alt="Cover"
              className="h-full w-full rounded-t-lg object-cover"
            />
          </div>

          {/* Profile Avatar */}
          <div className="absolute -bottom-16 left-8">
            <Avatar
              alt={fullName}
              sx={{
                width: 120,
                height: 120,
                border: "4px solid white",
                fontSize: "2rem",
                bgcolor: "#246AA3",
              }}
            >
              {fullName?.[0].toUpperCase()}
            </Avatar>
          </div>
        </div>
        {/* Profile Info Section */}
        <div className="rounded-b-lg bg-white px-8 pt-20 pb-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {data.fullName}
              </h1>
              <p className="mt-1 text-gray-600">{data.totalFriends} friends</p>
            </div>

            {/* Action Buttons */}
            {userId !== _id && <FriendActionButtons userInfo={data} />}
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 border-t border-gray-200">
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  minWidth: "auto",
                  paddingX: 3,
                },
                "& .Mui-selected": {
                  color: "#246AA3",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#246AA3",
                },
              }}
            >
              <Tab label="Posts" />
              <Tab label="About" />
              <Tab label="Friends" />
              <Tab label="Photos" />
            </Tabs>
          </div>
        </div>
        <Outlet context={{ userData: data, isMyProfile }} />
      </div>
    </div>
  );
};

export default UserProfile;
