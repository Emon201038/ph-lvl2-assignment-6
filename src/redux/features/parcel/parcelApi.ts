import type { ParcelSchema } from "@/lib/zodSchema";
import { baseApi } from "@/redux/baseApi";
import type { IMeta, IParcel, IResponse } from "@/types";

export const parcelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getParcels: builder.query<IParcel[], string>({
      query: (queryParams = "") => ({
        url: `/parcels?${queryParams}`,
      }),
      transformResponse: (
        response: IResponse<{
          parcels: IParcel[];
          meta: IMeta;
        }>
      ) => response.data?.parcels,
    }),
    getSenderParcels: builder.query<IParcel[], string>({
      query: (queryParams = "") => ({
        url: `/parcels/sender?${queryParams}`,
      }),
      transformResponse: (
        response: IResponse<{
          parcels: IParcel[];
          meta: IMeta;
        }>
      ) => response.data?.parcels,
    }),
    getParcelById: builder.query<IParcel, string>({
      query: (id) => ({
        url: `/parcels/${id}`,
      }),
      transformResponse: (response: IResponse<IParcel>) => response.data,
    }),
    cancelParcel: builder.mutation<IParcel, string>({
      query: (id) => ({
        url: `/parcels/${id}/cancel`,
        method: "PUT",
      }),
      transformResponse: (response: { data: IParcel }) => response.data,
    }),
    updateParcelStatus: builder.mutation<
      IParcel,
      { id: string; status: string; note: string }
    >({
      query: ({ id, status, note }) => ({
        url: `/parcels/${id}/status`,
        method: "PUT",
        data: { status, note },
      }),
      transformResponse: (response: { data: IParcel }) => response.data,
    }),
    createParcel: builder.mutation<IParcel, ParcelSchema>({
      query: (parcel) => ({
        url: "/parcels",
        method: "POST",
        data: parcel,
      }),
      transformResponse: (response: IResponse<IParcel>) => response.data,
    }),
  }),
});

export const {
  useGetParcelsQuery,
  useGetParcelByIdQuery,
  useCancelParcelMutation,
  useUpdateParcelStatusMutation,
  useCreateParcelMutation,
  useGetSenderParcelsQuery,
} = parcelApi;
