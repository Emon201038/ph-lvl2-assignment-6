import { baseApi } from "@/redux/baseApi";
import type { IResponse, IUser } from "@/types";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      IUser & { accessToken: string; refreshToken: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        data: credentials,
      }),
      transformResponse: (
        response: IResponse<
          IUser & { accessToken: string; refreshToken: string }
        >
      ) => response.data,
    }),

    verifyOTP: builder.mutation<
      IResponse<null>,
      { email: string; otp: string }
    >({
      query: (credentials) => ({
        url: "/otp/verify",
        method: "POST",
        data: credentials,
      }),
    }),
    sendOtp: builder.mutation<IResponse<null>, { email: string }>({
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
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["PROFILE"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // ✅ automatically clear all cached data
          dispatch(authApi.util.resetApiState());
        }
      },
    }),
    setPassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/set-password",
        method: "POST",
        data: credentials,
      }),
      invalidatesTags: ["PROFILE"],
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
    resetPassword: builder.mutation<
      IResponse<{ email: string }>,
      { id: string; token: string; newPassword: string }
    >({
      query: (credentials) => ({
        url: "/auth/reset-password",
        method: "POST",
        data: credentials,
      }),
    }),
    getProfile: builder.query<IUser, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      transformResponse: (response: { data: IUser }) => response.data,
      providesTags: ["PROFILE"],
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyOTPMutation,
  useSendOtpMutation,
  useRefreshTokenQuery,
  useLogoutMutation,
  useSetPasswordMutation,
  useChangePasswordMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
} = authApi;
export default authApi;
