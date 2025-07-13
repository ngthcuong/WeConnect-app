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
      keepUnusedDataFor: 0,
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
      // invalidatesTags: (result, error, { receiver }) => [
      //   "CONVERSATIONS",
      //   { type: "MESSAGES", id: receiver },
      // ],
      onQueryStarted: async (
        { message, receiver },
        { dispatch, queryFulfilled, getState },
      ) => {
        const { auth } = getState();
        const currentUser = auth.user;
        const tempId = crypto.randomUUID();
        const now = new Date().toISOString();

        const optimisticMessage = {
          seen: false,
          _id: tempId,
          message: message,
          sender: currentUser,
          receiver: {
            _id: receiver,
          },
          createdAt: now,
          updatedAt: now,
        };

        const messagesUpdatePatch = dispatch(
          messageApi.util.updateQueryData(
            "getMessages", // endpoint
            { userId: receiver }, // params / args
            (draft) => {
              // draft là dữ liệu đang được caching
              if (draft.messages) {
                draft.messages.push(optimisticMessage);
              }
            },
          ),
        );

        const conversationsUpdatePatch = dispatch(
          rootApi.util.updateQueryData(
            "getConversation",
            undefined,
            (draft) => {
              let currentConversationIndex = draft.findIndex(
                (message) =>
                  message.sender._id === receiver ||
                  message.receiver._id === receiver,
              );
              let receiverInfo = {};
              if (currentConversationIndex !== -1) {
                receiverInfo = draft[currentConversationIndex].receiver;
                draft.splice(currentConversationIndex, 1);
              }

              draft.unshift({ ...optimisticMessage, receiver: receiverInfo });
            },
          ),
        );

        try {
          const response = await queryFulfilled;

          dispatch(
            messageApi.util.updateQueryData(
              "getMessages",
              { userId: receiver },
              (draft) => {
                if (draft.messages) {
                  const messageIndex = draft.messages.findIndex(
                    (msg) => msg._id === tempId,
                  );

                  if (messageIndex !== -1) {
                    draft.messages[messageIndex] = response.data;
                  }
                }
              },
            ),
          );

          dispatch(
            rootApi.util.updateQueryData(
              "getConversation",
              undefined,
              (draft) => {
                const conversationIndex = draft.findIndex(
                  (msg) => msg._id === tempId,
                );

                if (conversationIndex !== -1) {
                  draft[conversationIndex] = response.data;
                }
              },
            ),
          );
        } catch (error) {
          messagesUpdatePatch.undo();
          conversationsUpdatePatch.undo();

          console.error({ error });
        }
      },
    }),
    // Mark all messages from a specific sender as seen.
    updateSeenMessage: builder.mutation({
      query: ({ sender }) => ({
        url: `/messages/update-seen`,
        body: { sender },
        method: "PUT",
      }),
      invalidatesTags: ["CONVERSATIONS"],
    }),
  }),
});

export const {
  useGetConversationQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useUpdateSeenMessageMutation,
} = messageApi;
