import UserCard from "@components/UserCard";
import React from "react";

const SearchUserPage = () => {
  return (
    <div className="container flex-col">
      <p className="text-xl font-medium">Search</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
      </div>
    </div>
  );
};

export default SearchUserPage;
