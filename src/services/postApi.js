import { rootApi } from "./rootApi";
import { createEntityAdapter } from "@reduxjs/toolkit";

export const postsAdapter = createEntityAdapter({
  selectId: (post) => post._id,
  sortComparer: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
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
            rootApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
              // draft.unshift(newPost);
              postsAdapter.addOne(draft, newPost);
            }),
          );

          try {
            const { data } = await queryFulfilled;
            dispatch(
              rootApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
                // const index = draft.findIndex((post) => post._id === tempId);
                // if (index) {
                //   draft[index] = data;
                // }
                postsAdapter.removeOne(draft, tempId);
                postsAdapter.addOne(draft, data);
              }),
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
        keepUnusedDataFor: 0,
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

          // Lấy tất cả các arguments đã được sử dụng để gọi getPostsByAuthorId và hiện có trong cache
          const userPostsArgs = rootApi.util.selectCachedArgsForQuery(
            store,
            "getPostsByAuthorId",
          );
          // Ex:
          // userPostsArgs = [
          //   { offset: 0, limit: 10, userId: "user123" },
          //   { offset: 0, limit: 10, userId: "user456" },
          //   { offset: 10, limit: 10, userId: "user123" },
          // ];

          // Lưu trữ các patch results
          const patchResults = [];

          // Danh sách tất cả cache queries cần được update với optimistic like
          const cachingPairs = [
            // Các user page đã được cache
            ...userPostsArgs.map((arg) => [
              "getPostsByAuthorId",
              { userId: arg.userId },
            ]),
            // Home page
            ["getPosts", "allPosts"],
          ];

          cachingPairs.forEach(([endpoint, key]) => {
            // Optimistic Update
            const patchResult = dispatch(
              rootApi.util.updateQueryData(endpoint, key, (draft) => {
                const currentPost = draft.entities[args];
                if (currentPost) {
                  currentPost.likes.push({
                    author: {
                      _id: store.auth.user._id,
                      fullName: store.auth.user.fullName,
                    },
                    _id: tempId,
                  });
                }
              }),
            );
            patchResults.push(patchResult);
          });

          try {
            const { data } = await queryFulfilled;

            cachingPairs.forEach(([endpoint, key]) => {
              dispatch(
                rootApi.util.updateQueryData(endpoint, key, (draft) => {
                  const currentPost = draft.entities[args];
                  if (currentPost) {
                    const likeIndex = currentPost.likes.findIndex(
                      (like) => like._id === tempId,
                    );
                    if (likeIndex !== -1) {
                      currentPost.likes[likeIndex] = {
                        author: {
                          _id: store.auth.user._id,
                          fullName: store.auth.user.fullName,
                        },
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                        _id: data._id,
                      };
                    }
                  }
                }),
              );
            });
          } catch (error) {
            patchResults.forEach((patchResult) => patchResult.undo());
            console.log(error);
          }
        },
        // default behaviour: key = endpoint + params
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
      createComment: builder.mutation({
        query: ({ postId, comment }) => {
          return {
            url: `/posts/${postId}/comments`,
            method: "POST",
            body: { comment },
          };
        },
        onQueryStarted: async (
          args,
          { dispatch, queryFulfilled, getState },
        ) => {
          const store = getState();
          const tempId = crypto.randomUUID();

          const patchResult = dispatch(
            rootApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
              const currentPost = draft.entities[args.postId];

              const optimisticComment = {
                _id: tempId,
                comment: args.comment,
                author: {
                  _id: store?.auth?.user?._id,
                  fullName: store?.auth?.user?.fullName,
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

              if (currentPost) {
                currentPost.comments.push(optimisticComment);
              }
            }),
          );

          try {
            const { data } = await queryFulfilled;
            dispatch(
              rootApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
                const currentPost = draft.entities[args.postId];

                if (currentPost) {
                  const commentIndex = currentPost.comments.findIndex(
                    (comment) => comment._id === tempId,
                  );

                  if (commentIndex !== -1)
                    currentPost.comments[commentIndex] = data;
                }
              }),
            );
          } catch (error) {
            patchResult.undo();
            console.log(error);
          }
        },
      }),
      getPostsByAuthorId: builder.query({
        query: ({ offset, limit, userId } = {}) => {
          return {
            url: `/posts/author/${userId}`,
            params: { offset, limit },
            // method: "GET",
          };
        },
        keepUnusedDataFor: 0,
        // Formar lại dữ liệu
        transformResponse: (response) => {
          const postNormalize = postsAdapter.upsertMany(
            initialState,
            response.posts,
          );
          return {
            ...postNormalize,
            meta: {
              total: response.total,
              limit: response.limit,
              offset: response.offset,
            },
          };
        },
        // Lấy key userId từ params để tạo ra một key để clear catching data khi đổi route
        serializeQueryArgs: ({ queryArgs }) => ({
          userId: queryArgs.userId,
        }),
        merge: (currentCatch, newItems) => {
          return postsAdapter.upsertMany(currentCatch, newItems.entities);
        },
      }),
      getPostImagesByAuthorId: builder.query({
        query: ({ offset, limit, userId } = {}) => {
          return {
            url: `/posts/author/${userId}/images`,
            params: { offset, limit },
          };
        },
        keepUnusedDataFor: 0,
      }),
    };
  },
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useCreateCommentMutation,
  useGetPostsByAuthorIdQuery,
} = postApi;
