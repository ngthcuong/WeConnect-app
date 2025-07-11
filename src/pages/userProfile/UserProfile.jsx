import { Tab, Tabs } from "@mui/material";
import React from "react";
import { useUserInfo } from "@hooks/useUserInfo";
import { useGetUserInfoByIdQuery } from "@services/userApi";
import FriendActionButtons from "@components/FriendActionButtons";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import UserAvatar from "@components/UserAvatar";

const UserProfile = () => {
  const { userId } = useParams();
  const location = useLocation();
  const { _id, coverImage } = useUserInfo();
  const { data = {} } = useGetUserInfoByIdQuery(userId);
  const isMyProfile = data._id === _id;

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

  const getActiveTabIndex = (pathname = "") => {
    if (pathname === `/users/${userId}`) return 0;

    // http://localhost:5173/user/6858ef479b5c5246978fac38/friends
    // split("/"): chia chuỗi thành mảng []
    // filter(Boolean): loại bỏ các giá trị bị empty string
    // pop(): lấy ra giá trị cuối cùng của mảng
    // => lấy được lastSagment = friends
    const lastSagment = pathname.split("/").filter(Boolean).pop();
    const matchedTab = TABS.find((tab) => tab.path === lastSagment);

    return matchedTab ? matchedTab.index : 0;
  };

  const currentTabIndex = getActiveTabIndex(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl px-4">
        {/* Cover Photo Section */}
        <div className="relative">
          <div className="h-80 rounded-t-lg bg-gradient-to-r from-blue-400 to-purple-500">
            <img
              src={coverImage}
              alt="Cover"
              className="h-full w-full rounded-t-lg object-cover"
            />
          </div>

          {/* Profile Avatar */}
          <div className="absolute -bottom-16 left-8">
            <UserAvatar
              src={data.image}
              className="!h-40 !w-40 !border-white !bg-[#246AA3] !text-4xl"
            />
          </div>
        </div>
        {/* Profile Info Section */}
        <div className="rounded-b-lg bg-white px-8 pt-20 pb-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {data.fullName}
              </h1>
              <p className="mt-1 text-gray-600">
                <Link to={`/user/${userId}/friends`}>
                  {data.totalFriends} friends
                </Link>
              </p>
            </div>

            {/* Action Buttons */}
            {userId !== _id && <FriendActionButtons userInfo={data} />}
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 border-t border-gray-200">
            <Tabs
              value={currentTabIndex}
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
              {TABS.map((tab) => (
                <Tab
                  label={tab.label}
                  key={tab.index}
                  LinkComponent={Link}
                  to={`/user/${userId}/${tab.path}`}
                />
              ))}
            </Tabs>
          </div>
        </div>
        <Outlet context={{ userData: data, isMyProfile }} />
      </div>
    </div>
  );
};

export default UserProfile;
