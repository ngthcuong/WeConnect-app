import Post from "./Post";
import Loading from "@components/Loading";

import { useLazyLoadPosts } from "@hooks/index";

const PostList = () => {
  const { hasMore, isFetching, posts } = useLazyLoadPosts();

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      {(posts || []).map((post) => (
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
      {!hasMore && <div className="text-center">No more posts</div>}
    </div>
  );
};

export default PostList;
