import type { ParcelSchema } from "@/lib/zodSchema";
import { baseApi } from "@/redux/baseApi";
import type { IMeta, IParcel, IResponse, IStatusLog } from "@/types";

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
      providesTags: ["PARCEL", "PROFILE", "USER"],
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
    getReceiverParcels: builder.query<IParcel[], string>({
      query: (queryParams = "") => ({
        url: `/parcels/receiver?${queryParams}`,
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
    trackParcel: builder.query<IStatusLog[], string>({
      query: (id) => ({
        url: `/parcels/tracking/${id}`,
      }),
      transformResponse: (response: IResponse<{ statusLogs: IStatusLog[] }>) =>
        response.data.statusLogs,
    }),
    cancelParcel: builder.mutation<IParcel, { id: string; note: string }>({
      query: ({ id, note }) => ({
        url: `/parcels/cancel/${id}`,
        method: "PATCH",
        data: { note },
      }),
      transformResponse: (response: { data: IParcel }) => response.data,
      async onQueryStarted({ id }, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: updatedParcel } = await queryFulfilled;

          const cacheEntries = parcelApi.util.selectInvalidatedBy(getState(), [
            { type: "PARCEL" },
          ]);

          for (const { originalArgs } of cacheEntries) {
            dispatch(
              parcelApi.util.updateQueryData(
                "getParcels",
                originalArgs,
                (draft) => {
                  const index = draft.findIndex((p) => p._id === id);
                  if (index !== -1) {
                    draft[index] = updatedParcel;
                  }
                }
              )
            );
          }
        } catch (err) {
          console.error("cancelParcel failed:", err);
        }
      },
    }),

    updateParcelStatus: builder.mutation<
      IParcel,
      { id: string; status: string; note: string }
    >({
      query: ({ id, status, note }) => ({
        url: `/parcels/update-status/${id}`,
        method: "PATCH",
        data: { status, note },
      }),
      invalidatesTags: ["PARCEL", "PARCEL_STATS"],
      transformResponse: (response: { data: IParcel }) => response.data,
    }),

    createParcel: builder.mutation<IParcel, ParcelSchema>({
      query: (parcel) => ({
        url: "/parcels",
        method: "POST",
        data: parcel,
      }),
      invalidatesTags: ["PARCEL_STATS"],
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
  useGetReceiverParcelsQuery,
  useTrackParcelQuery,
} = parcelApi;
