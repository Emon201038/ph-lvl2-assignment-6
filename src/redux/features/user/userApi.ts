import { baseApi } from "@/redux/baseApi";
import type { IMeta, IResponse, IUser } from "@/types";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        data: credentials,
      }),
    }),
    getUsers: builder.query<{ users: IUser[]; meta: IMeta }, string>({
      query: (queryParams = "") => ({
        url: `/user?${queryParams}`,
      }),
      transformResponse: (
        response: IResponse<{ users: IUser[]; meta: IMeta }>
      ) => {
        return { users: response.data.users, meta: response.data.meta };
      },
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
    toggleUserBlock: builder.mutation({
      query: (id) => ({
        url: `/user/block/${id}`,
        method: "PATCH",
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
  useToggleUserBlockMutation,
} = userApi;
