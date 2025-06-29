import React from "react";
import Post from "./Post";
import { useGetPostsQuery } from "@services/rootApi";
import { CircularProgress } from "@mui/material";
import Loading from "@components/Loading";

const PostList = () => {
  const { data, isFetching } = useGetPostsQuery();

  return isFetching ? (
    <Loading />
  ) : (
    <div className="flex flex-col gap-4">
      {(data || []).map((post) => (
        <Post
          key={post._id}
          fullName={post.author.fullName}
          content={post.content}
          image={post.image}
          likes={post.likes}
          comments={post.comments}
          createdAt={post.createdAt}
        />
      ))}
    </div>
  );
};

export default PostList;
