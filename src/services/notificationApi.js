import { rootApi } from "./rootApi";

export const notificationApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getNotifications: builder.query({
        query: () => "/notifications",
        providesTags: (result) =>
          result
            ? [
                ...result.notifications.map(({ _id }) => ({
                  type: "GET_NOTIFICATIONS",
                  id: _id,
                })),
                { type: "GET_NOTIFICATIONS", id: "LIST" },
              ]
            : [{ type: "GET_NOTIFICATIONS", id: "LIST" }],
      }),
      createNotification: builder.mutation({
        query: ({ userId, postId, notificationType, notificationTypeId }) => {
          return {
            url: `/notifications/create`,
            body: { userId, postId, notificationType, notificationTypeId },
            method: "POST",
          };
        },
      }),
    };
  },
});

export const { useGetNotificationsQuery, useCreateNotificationMutation } =
  notificationApi;
