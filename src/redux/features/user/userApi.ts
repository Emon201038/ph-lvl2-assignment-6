import type { RegisterUserSchema, UserSchema } from "@/lib/zodSchema";
import { baseApi } from "@/redux/baseApi";
import type { IMeta, IResponse, IUser } from "@/types";
import authApi from "../auth/authApi";
import type { PasswordChangeSchema } from "@/components/profile/password-form";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<IResponse<IUser>, RegisterUserSchema>({
      query: (credentials) => ({
        url: "/user",
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
    updateUser: builder.mutation<
      IUser,
      { id: string; data: UserSchema | PasswordChangeSchema }
    >({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PUT",
        data,
      }),
      transformResponse: (response: IResponse<IUser>) => response.data,
      invalidatesTags: ["PROFILE"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedUser } = await queryFulfilled; // IUser

          dispatch(
            authApi.util.updateQueryData("getProfile", undefined, (draft) => {
              // mutate the draft directly
              Object.assign(draft, updatedUser);
            })
          );
        } catch (error) {
          throw error;
        }
      },
    }),

    updateRole: builder.mutation<IUser, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/user/role/${id}`,
        method: "PATCH",
        data: { role },
      }),
      invalidatesTags: ["PROFILE", "USER"],
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
  useUpdateRoleMutation,
  useDeleteUserMutation,
  useToggleUserBlockMutation,
} = userApi;
