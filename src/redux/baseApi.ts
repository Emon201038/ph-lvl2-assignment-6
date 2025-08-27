import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";
export const baseApi = createApi({
  baseQuery: axiosBaseQuery(),
  tagTypes: ["USER", "PROFILE", "PARCEL", "PARCEL_STATS"],
  endpoints: () => ({}),
});
