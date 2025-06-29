import React, { useCallback, useEffect, useRef, useState } from "react";
import Post from "./Post";
import { useGetPostsQuery } from "@services/rootApi";
import Loading from "@components/Loading";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const prevDataRef = useRef(null); // Tham chiếu đến dữ liệu trước đó để kiểm tra tránh lặp lại dữ liệu khi cuộn trang
  const [hasMore, setHasMore] = useState(true); // Kiểm tra xem có thêm dữ liệu hay không để hiển thị thông báo kết thúc trang hoặc thông báo không có dữ liệu nào. Mặc định là true.

  const [offset, setOffset] = useState(0);
  const limit = 10;
  const { data, isFetching, isSuccess } = useGetPostsQuery({ offset, limit });

  useEffect(() => {
    if (isSuccess && data && data !== prevDataRef.current) {
      if (!data.length) {
        setHasMore(false);
        return;
      }
      prevDataRef.current = data; // Lưu trữ dữ liệu trước đó để kiểm tra tránh lặp lại dữ liệu khi cuộn trang
      setPosts((prevPosts) => [...prevPosts, ...data]);
    }
  }, [isSuccess, data]);

  // Hàm được gọi khi người dùng cuộn trang
  const handleScroll = useCallback(() => {
    if (!hasMore) return;
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (clientHeight + scrollTop + 50 >= scrollHeight && !isFetching) {
      setOffset(offset + limit);
    }
  }, [hasMore, isFetching, offset, limit]);

  // Đăng ký sự kiện scroll và bỏ đăng ký khi component bị unmount
  // Để tránh lỗi trùng sự kiện khi chuyển trang
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return isFetching ? (
    <Loading />
  ) : (
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
      {isFetching && <Loading />}
      {!hasMore && <div className="text-center">No more posts</div>}
      {/* Hiển thị thông báo kết thúc trang */}
    </div>
  );
};

export default PostList;
