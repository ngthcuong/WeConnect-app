import { login, logout } from "@redux/slices/authSlice";
// import { persistor } from "@redux/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    if (result?.error?.data?.message === "Token has expired.") {
      const refreshToken = api.getState().auth.refreshToken;

      if (refreshToken) {
        const refreshResult = await baseQuery(
          {
            url: "/refresh-token",
            body: { refreshToken },
            method: "POST",
          },
          api,
          extraOptions,
        );

        const newAccessToken = refreshResult?.data?.accessToken;

        if (newAccessToken) {
          api.dispatch(
            login({
              accessToken: newAccessToken,
              refreshToken,
            }),
          );

          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
          window.location.href = "/login";
        }
      }
    } else {
      window.location.href = "/login";
    }
  }

  return result;
};

export const rootApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Posts", "Users", "Pending_Friend_Requests"],
  endpoints: (builder) => {
    return {
      // Auth
      register: builder.mutation({
        query: ({ fullName, email, password }) => {
          return {
            url: "/signup",
            body: { fullName, email, password },
            method: "POST",
          };
        },
      }),
      login: builder.mutation({
        query: ({ email, password }) => {
          return {
            url: "/login",
            body: { email, password },
            method: "POST",
          };
        },
      }),
      verifyOTP: builder.mutation({
        query: ({ email, otp }) => {
          return {
            url: "/verify-otp",
            body: { email, otp },
            method: "POST",
          };
        },
      }),
      refreshToken: builder.mutation({
        query: (refreshToken) => {
          return {
            url: "/refresh-token",
            body: { refreshToken },
            method: "POST",
          };
        },
      }),
      getAuthUser: builder.query({
        query: () => "/auth-user",
      }),

      // Posts
      createPost: builder.mutation({
        query: (formData) => {
          return {
            url: "/posts",
            body: formData, // { content, image },
            method: "POST",
          };
        },
        onQueryStarted: async (
          args,
          { dispatch, queryFulfilled, getState },
        ) => {
          const store = getState();
          const tempId = crypto.randomUUID();

          const newPost = {
            _id: tempId,
            likes: [],
            comments: [],
            content: args.get("content"),
            author: {
              notifications: [],
              _id: store.auth?.user?._id,
              fullName: store.auth?.user?.fullName,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0,
          };

          const patchResult = dispatch(
            rootApi.util.updateQueryData(
              "getPosts",
              { offset: 0, limit: 10 },
              (draft) => {
                draft.unshift(newPost);
              },
            ),
          );

          try {
            const { data } = await queryFulfilled;
            dispatch(
              rootApi.util.updateQueryData(
                "getPosts",
                { offset: 0, limit: 10 },
                (draft) => {
                  const index = draft.findIndex((post) => post._id === tempId);
                  if (index) {
                    draft[index] = data;
                  }
                },
              ),
            );
          } catch (err) {
            patchResult.undo();
            console.log(err);
          }
        },
        // invalidatesTags: [{ type: "Posts" }],
      }),
      getPosts: builder.query({
        query: ({ offset, limit } = {}) => {
          return {
            url: "/posts",
            params: { offset, limit },
            // method: "GET",
          };
        },
        providesTags: [{ type: "Posts" }],
      }),

      // Users / Friends
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
                ...result.users.map(({ _id }) => ({ type: "Users", id: _id })),
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
        ],
      }),
      getPendingFriendRequests: builder.query({
        query: () => "/friends/pending",
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
    };
  },
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOTPMutation,
  useRefreshTokenMutation,
  useGetAuthUserQuery,
  useCreatePostMutation,
  useGetPostsQuery,
  useSearchUsersQuery,
  useSendFriendRequestMutation,
  useGetPendingFriendRequestsQuery,
  useAcceptFriendRequestMutation,
  useCancelFrientRequestMutation,
} = rootApi;
