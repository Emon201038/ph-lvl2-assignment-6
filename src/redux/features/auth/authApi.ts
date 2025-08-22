import { baseApi } from "@/redux/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        data: credentials,
      }),
    }),

    verify: builder.mutation({
      query: (credentials) => ({
        url: "/otp/verify",
        method: "POST",
        data: credentials,
      }),
    }),
    sendOtp: builder.mutation({
      query: (credentials) => ({
        url: "/otp/send",
        method: "POST",
        data: credentials,
      }),
    }),
    refreshToken: builder.query({
      query: () => ({
        url: "/auth/refresh-token",
        method: "GET",
      }),
    }),
    logout: builder.query({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
      }),
    }),
    setPassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/set-password",
        method: "POST",
        data: credentials,
      }),
    }),
    changePassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/change-password",
        method: "POST",
        data: credentials,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/forget-password",
        method: "POST",
        data: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyMutation,
  useSendOtpMutation,
  useRefreshTokenQuery,
  useLogoutQuery,
  useSetPasswordMutation,
  useChangePasswordMutation,
  useForgetPasswordMutation,
} = authApi;
export default authApi;
