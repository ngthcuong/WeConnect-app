import Header from "@components/Header";
import Post from "@components/NewsFeed/Post";
import { Avatar, Button, Tab, Tabs } from "@mui/material";
import { LocationOn, Cake } from "@mui/icons-material";
import React, { useState } from "react";
import { useUserInfo } from "@hooks/useUserInfo";
import PostCreation from "@components/NewsFeed/PostCreation";
import PostList from "@components/NewsFeed/PostList";
import { useGetUserInfoByIdQuery } from "@services/userApi";
import UserPosts from "@components/UserProfile/UserPosts";
import FriendActionButtons from "@components/FriendActionButtons";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { userId } = useParams();
  const { _id, fullName } = useUserInfo();
  const { data = {} } = useGetUserInfoByIdQuery(userId);

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

  // Mock data - thay bằng API call thực tế
  const userInfo = {
    fullName: "Daniel Mark",
    friends: 129,
    followers: 1000,
    location: "Ho Chi Minh City",
    age: "32 years old",
    introduction:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, faucibus non risus. Phasellus faucibus mollis placerat. Proin blandit ac massa sed rhoncus.",
    coverImage: "/cover-image.jpg",
    profileImage: "/profile-avatar.jpg",
  };

  // Mock photos data
  const photos = [
    "/api/placeholder/150/150",
    "/api/placeholder/150/150",
    "/api/placeholder/150/150",
    "/api/placeholder/150/150",
    "/api/placeholder/150/150",
    "/api/placeholder/150/150",
    "/api/placeholder/150/150",
    "/api/placeholder/150/150",
    "/api/placeholder/150/150",
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

        {/* Tab Content - Posts Layout */}
        {activeTab === 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Sidebar */}
            <div className="space-y-6">
              {/* Introduction Card */}
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold">Introduction</h3>
                <p className="mb-4 text-sm text-gray-600">{data.about}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <LocationOn className="mr-2 h-4 w-4" />
                    {userInfo.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Cake className="mr-2 h-4 w-4" />
                    {userInfo.age}
                  </div>
                </div>
              </div>

              {/* Photos Card */}
              <div className="rounded-lg bg-white p-6 shadow">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Photos</h3>
                  <button className="text-sm text-blue-600 hover:underline">
                    See all photos
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {photos.slice(0, 9).map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="aspect-square rounded-lg object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content - Posts */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {userId === _id && <PostCreation />}
                {/* Sử dụng key để reload lại component nếu khi thay đổi trang/route, component đó vẫn tồn tại */}
                <UserPosts userId={userId} key={userId} />
              </div>
            </div>
          </div>
        )}

        {/* Other Tab Contents */}
        {activeTab === 1 && (
          <div className="mt-6 rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-xl font-semibold">About</h3>
            <p className="text-gray-600">
              About information will be displayed here.
            </p>
          </div>
        )}

        {activeTab === 2 && (
          <div className="mt-6 rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-xl font-semibold">Friends</h3>
            <p className="text-gray-600">
              Friends list will be displayed here.
            </p>
          </div>
        )}

        {activeTab === 3 && (
          <div className="mt-6 rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-xl font-semibold">Photos</h3>
            <p className="text-gray-600">
              Photo gallery will be displayed here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
