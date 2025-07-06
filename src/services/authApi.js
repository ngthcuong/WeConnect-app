import { rootApi } from "./rootApi";

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
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
        providesTags: [{ type: "GET_AUTH_USER" }],
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
} = authApi;
