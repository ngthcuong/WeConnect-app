import { rootApi } from "./rootApi";

export const messageApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // Retrieve all conversations for the authenticated user for the left sidebar display.
    getConversation: builder.query({
      query: () => {
        return "/messages/conversations";
      },
      providesTags: ["CONVERSATIONS"],
    }),
    // Retrieve message history between the authenticated user and another user with pagination.
    getMessages: builder.query({
      query: ({ userId, offset, limit }) => ({
        url: `/messages`,
        params: { userId, offset, limit },
      }),
      serializeQueryArgs: ({ queryArgs }) => ({ userId: queryArgs.userId }),
      providesTags: (result, error, { userId }) => {
        return [{ type: "MESSAGES", id: userId }];
      },
    }),
    // Send a new message to another user.
    sendMessage: builder.mutation({
      query: ({ message, receiver }) => ({
        url: `/messages/create`,
        body: { message, receiver },
        method: "POST",
      }),
      invalidatesTags: (result, error, { receiver }) => [
        "CONVERSATIONS",
        { type: "MESSAGES", id: receiver },
      ],
    }),
    // Mark all messages from a specific sender as seen.
    updateSeenMessage: builder.mutation({
      query: ({ sender }) => ({
        url: `/messages/update-seen`,
        body: { sender },
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useGetConversationQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useUpdateSeenMessageMutation,
} = messageApi;
