import { baseApi } from "@/redux/baseApi";
import type { IUser } from "@/types";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        data: credentials,
      }),
    }),
    getUsers: builder.query({
      query: (queryParams = "") => ({
        url: `/user?${queryParams}`,
      }),
    }),
    getUserById: builder.query<IUser, { id: string }>({
      query: (id) => ({
        url: `/user/${id}`,
      }),
      transformResponse: (response: { data: IUser }) => response.data,
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PUT",
        data,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export default userApi;

export const {
  useRegisterMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
