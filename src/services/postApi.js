import { method } from "lodash";
import { rootApi } from "./rootApi";
import { createEntityAdapter } from "@reduxjs/toolkit";

export const postsAdapter = createEntityAdapter({
  selectId: (post) => post._id,
  sortComparer: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
});

const initialState = postsAdapter.getInitialState();

export const postApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
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
        transformResponse: (response) => {
          // Chuẩn hóa thành dạng
          //  {
          //   ids: [1, 3], entities: [{id: 1, content: '123'},{id: 3, content: 'abc'}]
          //  }
          return postsAdapter.upsertMany(initialState, response);
        },
        serializeQueryArgs: () => "allPosts", // Đảm bảo luôn trả về một key duy nhất
        merge: (currentCatch, newItems) => {
          // gộp dữ liệu trước đó với dữ liệu mới có được
          // đảm bảo dữ liệu sẽ không bị duplicate vì đã có ids
          return postsAdapter.upsertMany(currentCatch, newItems.entities);
        },
        providesTags: [{ type: "Posts" }],
      }),
      likePost: builder.mutation({
        query: (postId) => {
          return {
            url: `/posts/${postId}/like`,
            body: { postId },
            method: "POST",
          };
        },
        onQueryStarted: async (
          args,
          { dispatch, queryFulfilled, getState },
        ) => {
          const store = getState();
          const tempId = crypto.randomUUID();

          // Optimistic Update
          const patchResult = dispatch(
            rootApi.util.updateQueryData(
              "getPosts",
              { offset: 0, limit: 10 },
              (draft) => {
                const currentPost = draft.find((p) => p._id === args);
                if (currentPost) {
                  currentPost.likes.push({
                    author: {
                      _id: store.auth.user._id,
                      fullName: store.auth.user.fullName,
                    },
                    _id: tempId,
                  });
                }
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
                  const currentPost = draft.find((p) => p._id === args);

                  if (currentPost) {
                    let currentLike = currentPost.likes.find(
                      (like) => like._id === tempId,
                    );
                    if (currentLike) {
                      currentLike = {
                        author: {
                          _id: store.auth.user._id,
                          fullName: store.auth.user.fullName,
                        },
                        _id: tempId,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                      };
                    }
                  }
                },
              ),
            );
          } catch (error) {
            patchResult.undo();
          }
        },
      }),
      unlikePost: builder.mutation({
        query: (postId) => {
          return {
            url: `/posts/${postId}/like`,
            body: { postId },
            method: "DELETE",
          };
        },
      }),
    };
  },
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useLikePostMutation,
  useUnlikePostMutation,
} = postApi;
