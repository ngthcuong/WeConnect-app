import Loading from "@components/Loading";
import UserCard from "@components/UserCard";
import { useSearchUsersQuery } from "@services/friendApi";
import React from "react";
import { useLocation } from "react-router-dom";

const SearchUserPage = () => {
  const location = useLocation();

  const { data } = useSearchUsersQuery({
    offset: 0,
    limit: 10,
    searchQuery: location?.state?.searchQuery?.trim(),
  });

  // if (isLoading || isFetching) {
  //   return <Loading />;
  // }

  return (
    <div className="container flex-col">
      <p className="text-xl font-medium">Search</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(data?.users || []).map((user) => (
          <UserCard key={user._id} userInfo={user} />
        ))}
      </div>
    </div>
  );
};

export default SearchUserPage;
