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
    }),
  }),
});
