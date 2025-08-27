import { baseApi } from "@/redux/baseApi";
import type {
  IMonthlyReport,
  IParcelStat,
  IResponse,
  IUserStat,
} from "@/types";

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
    getMonthlyReport: builder.query<IMonthlyReport[], string>({
      query: (queryParams = "") => ({
        url: `/stats/monthly-report?${queryParams}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<IMonthlyReport[]>) =>
        response.data,
    }),
  }),
});

export const {
  useGetUserStatsQuery,
  useGetParcelStatsQuery,
  useGetMonthlyReportQuery,
} = adminApi;
