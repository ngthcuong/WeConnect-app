import { method } from "lodash";
import { rootApi } from "./rootApi";

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
