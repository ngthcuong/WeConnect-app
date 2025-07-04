import { useGetPostsQuery } from "@services/postApi";
import { throttle } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const useLazyLoadPosts = () => {
  // const [posts, setPosts] = useState([]);
  const prevCountPostRef = useRef(0);
  const [hasMore, setHasMore] = useState(true);

  const [offset, setOffset] = useState(0);
  const limit = 10;
  const {
    data = {},
    isFetching,
    isSuccess,
    refetch,
  } = useGetPostsQuery({ offset, limit }, { skip: !hasMore });

  const posts = (data.ids || []).map((id) => data.entities[id]);

  useEffect(() => {
    // if (isSuccess && data && data !== prevDataRef.current) {
    //   if (!data.length) {
    //     setHasMore(false);
    //     return;
    //   }
    //   prevDataRef.current = data;
    //   setPosts((prevPosts) => {
    //     if (offset === 0) return data;
    //     return [...prevPosts, ...data];
    //   });
    // }
    if (!isFetching && data && hasMore) {
      const currentPostCount = data.ids.length;
      const newFetchedCount = currentPostCount - prevCountPostRef.current;
      if (newFetchedCount === 0) {
        setHasMore(false);
      } else {
        prevCountPostRef.current = currentPostCount;
      }
    }
  }, [isFetching, data, hasMore]);

  const loadMore = useCallback(() => {
    setOffset((offset) => offset + limit);
  }, []);

  useEffect(() => {
    refetch();
  }, [offset]);

  useInfiniteScroll({
    loadMore,
    hasMore,
    isFetching,
    time: 300,
    distance: 50,
    // restFn: () => {
    //   setOffset(0);
    //   setHasMore(true);
    //   prevDataRef.current = null;
    // },
    // offset,
  });

  return { hasMore, loadMore, isFetching, posts };
};

export const useInfiniteScroll = ({
  loadMore,
  hasMore,
  isFetching,
  // offset,
  // restFn,
  time,
  distance,
}) => {
  const handleScroll = useMemo(() => {
    return throttle(() => {
      if (!hasMore || isFetching) return;

      const scrollTop = document.documentElement.scrollTop; // b
      const scrollHeight = document.documentElement.scrollHeight; // a
      const clientHeight = document.documentElement.clientHeight; // c

      // if (scrollTop === 0 && offset > 0) {
      //   restFn();
      //   return;
      // }
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
