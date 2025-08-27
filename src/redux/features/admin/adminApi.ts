import { baseApi } from "@/redux/baseApi";
import type { IParcelStat, IResponse, IUserStat } from "@/types";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserStats: builder.query<IUserStat, string>({
      query: (queryParams = "") => ({
        url: `/stats/users?${queryParams}`,
      }),
      transformResponse: (response: IResponse<IUserStat>) => response.data,
    }),

    getParcelStats: builder.query<IParcelStat, string>({
      query: (queryParams = "") => ({
        url: `/stats/parcels?${queryParams}`,
      }),
      transformResponse: (response: IResponse<IParcelStat>) => response.data,
      providesTags: ["PARCEL_STATS"],
    }),
  }),
});

export const { useGetUserStatsQuery, useGetParcelStatsQuery } = adminApi;
