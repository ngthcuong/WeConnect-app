import { useGetPostsQuery } from "@services/rootApi";
import { throttle } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const useLazyLoadPosts = () => {
  const [posts, setPosts] = useState([]);
  const prevDataRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);

  const [offset, setOffset] = useState(0);
  const limit = 10;
  const { data, isFetching, isSuccess } = useGetPostsQuery({ offset, limit });

  useEffect(() => {
    if (isSuccess && data && data !== prevDataRef.current) {
      if (!data.length) {
        setHasMore(false);
        return;
      }
      prevDataRef.current = data;
      setPosts((prevPosts) => [...prevPosts, ...data]);
    }
  }, [isSuccess, data]);

  const loadMore = useCallback(() => {
    setOffset((offset) => offset + limit);
  }, []);

  useInfiniteScroll(loadMore, hasMore, isFetching, 300, 50);

  return { hasMore, loadMore, isFetching, posts };
};

export const useInfiniteScroll = (
  loadMore,
  hasMore,
  isFetching,
  time,
  distance,
) => {
  const handleScroll = useMemo(() => {
    return throttle(() => {
      if (!hasMore) return;
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (clientHeight + scrollTop + distance >= scrollHeight && !isFetching) {
        loadMore();
      }
    }, time);
  }, [hasMore, isFetching, loadMore, time, distance]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);

  return handleScroll;
};
