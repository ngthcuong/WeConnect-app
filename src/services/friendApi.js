import { rootApi } from "./rootApi";

export const friendApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      searchUsers: builder.query({
        query: ({ offset, limit, searchQuery }) => {
          const encodedSearchQuery = encodeURIComponent(searchQuery?.trim());
          return {
            url: `/search/users/${encodedSearchQuery}`,
            params: { offset, limit },
          };
        },
        providesTags: (result) =>
          result
            ? [
                ...result.users.map(({ _id }) => ({
                  type: "Users",
                  id: _id,
                })),
                { type: "Users", id: "LIST" },
              ]
            : [{ type: "Users", id: "LIST" }],
      }),
      sendFriendRequest: builder.mutation({
        query: ({ friendId }) => {
          return {
            url: `/friends/request`,
            body: { friendId },
            method: "POST",
          };
        },
        invalidatesTags: (result, error, args) => [
          { type: "Users", id: args.friendId },
          { type: "GET_USER_INFO_BY_ID", id: result._id },
        ],
      }),
      getPendingFriendRequests: builder.query({
        query: () => "/friends/pending",
        // keepUnusedDataFor: 20,
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ _id }) => ({
                  type: "Pending_Friend_Requests",
                  id: _id,
                })),
                { type: "Pending_Friend_Requests", id: "LIST" },
              ]
            : [{ type: "Pending_Friend_Requests", id: "LIST" }],
      }),
      acceptFriendRequest: builder.mutation({
        query: ({ friendId }) => {
          return {
            url: `/friends/accept`,
            body: { friendId },
            method: "POST",
          };
        },
        invalidatesTags: (result, error, args) => [
          { type: "Pending_Friend_Requests", id: args.friendId },
        ],
      }),
      cancelFrientRequest: builder.mutation({
        query: ({ friendId }) => {
          return {
            url: `/friends/cancel`,
            body: { friendId },
            method: "POST",
          };
        },
        invalidatesTags: (result, error, args) => [
          { type: "Pending_Friend_Requests", id: args.friendId },
        ],
      }),
      getFriends: builder.query({
        query: () => "/friends",
        providesTags: (result) =>
          result?.friends
            ? [
                ...result.friends.map(({ _id }) => ({
                  type: "GET_FRIENDS",
                  id: _id,
                })),
                { type: "GET_FRIENDS", id: "LIST" },
              ]
            : [{ type: "GET_FRIENDS", id: "LIST" }],
      }),
      getFriendsByUserId: builder.query({
        query: (userId) => `/users/${userId}/friends`,
        providesTags: (result) =>
          result?.friends
            ? [
                ...result.friends.map(({ _id }) => ({
                  type: "GET_FRIENDS",
                  id: _id,
                })),
                { type: "GET_FRIENDS", id: "LIST" },
              ]
            : [{ type: "GET_FRIENDS", id: "LIST" }],
      }),
    };
  },
});

export const {
  useSearchUsersQuery,
  useSendFriendRequestMutation,
  useGetPendingFriendRequestsQuery,
  useAcceptFriendRequestMutation,
  useCancelFrientRequestMutation,
  useGetFriendsQuery,
  useGetFriendsByUserIdQuery,
} = friendApi;
