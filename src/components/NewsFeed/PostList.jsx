import Post from "./Post";
import Loading from "@components/Loading";

import { useLazyLoadPosts, useNotification } from "@hooks/index";
import { useUserInfo } from "@hooks/useUserInfo";
// import { useCreateNotificationMutation } from "@services/notificationApi";
import {
  useCreateCommentMutation,
  useLikePostMutation,
} from "@services/postApi";

const PostList = () => {
  const { hasMore, isFetching, posts } = useLazyLoadPosts();
  const [likePost] = useLikePostMutation();
  const [commentPost] = useCreateCommentMutation();
  // const [createNotification] = useCreateNotificationMutation();
  const { _id } = useUserInfo();
  const { createNotification } = useNotification();

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      {(posts || []).map((post) => (
        <Post
          key={post._id}
          id={post._id}
          fullName={post.author.fullName}
          content={post.content}
          image={post.image}
          likes={post.likes}
          comments={post.comments}
          createdAt={post.createdAt}
          isLiked={post.likes.some((like) => like.author?._id === _id)}
          onLike={async (postId) => {
            try {
              const resLike = await likePost(postId).unwrap();
              createNotification({
                receiverId: post.author?._id,
                postId: post._id,
                notificationType: "like",
                notificationTypeId: resLike?._id,
              });
            } catch (error) {
              console.log(error);
            }
          }}
          onComment={async ({ comment, postId }) => {
            try {
              const resComment = await commentPost({
                comment,
                postId,
              }).unwrap();
              createNotification({
                receiverId: post.author?._id,
                postId: post._id,
                notificationType: "comment",
                notificationTypeId: resComment?._id,
              });
            } catch (error) {
              console.log(error);
            }
          }}
        />
      ))}
      {!hasMore && <div className="text-center">No more posts</div>}
    </div>
  );
};

export default PostList;
