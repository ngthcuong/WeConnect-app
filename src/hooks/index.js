import {
  useCreateCommentMutation,
  useGetPostsByAuthorIdQuery,
  useGetPostsQuery,
} from "@services/postApi";
import { throttle } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUserInfo } from "./useUserInfo";
import { socket } from "@context/SocketProvider";
import { Events } from "@libs/constants";

export const useLazyLoadPosts = ({ userId } = {}) => {
  const prevCountPostRef = useRef(0);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    prevCountPostRef.current = 0;
  }, [userId]);

  const {
    data: userProfileData = { ids: [], entities: [] },
    isFetching: userProfileFetching,
    refetch: userProfileRefetch,
  } = useGetPostsByAuthorIdQuery({ offset, limit, userId }, { skip: !userId });

  const {
    data: homeData = { ids: [], entities: [] },
    isFetching: homeIsFetching,
    refetch: homeRefetch,
  } = useGetPostsQuery({ offset, limit }, { skip: !!userId });

  const data = userId ? userProfileData : homeData;
  const isFetching = userId ? userProfileFetching : homeIsFetching;
  const refetch = userId ? userProfileRefetch : homeRefetch;

  const posts = (data.ids || []).map((id) => data.entities[id]);

  useEffect(() => {
    if (!isFetching && data && hasMore) {
      if (userId) {
        if (data.ids.length === data.meta.total) {
          setHasMore(false);
        }
      } else {
        const currentPostCount = data.ids?.length || 0;
        const newFetchedCount = currentPostCount - prevCountPostRef.current;
        if (newFetchedCount === 0) {
          setHasMore(false);
        } else {
          prevCountPostRef.current = currentPostCount;
        }
      }
    }
  }, [isFetching, data, hasMore, userId]);

  const loadMore = useCallback(() => {
    setOffset((offset) => offset + limit);
  }, []);

  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [offset, refetch]);

  useInfiniteScroll({
    loadMore,
    hasMore,
    isFetching,
    time: 300,
    distance: 100,
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

export const useNotification = () => {
  const [createNotificationMutation] = useCreateCommentMutation();
  const { _id: currentUserId } = useUserInfo();

  async function createNotification({
    receiverId,
    postId,
    notificationType,
    notificationTypeId,
  }) {
    if (receiverId === currentUserId) return;

    const notification = await createNotificationMutation({
      userId: receiverId,
      postId,
      notificationType: notificationType,
      notificationTypeId: notificationTypeId,
    }).unwrap();

    socket.emit(Events.CREATE_NOTIFICATION, notification);
  }

  return { createNotification };
};
