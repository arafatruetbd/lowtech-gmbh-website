import { VENDOR_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const vendorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBanners: builder.query({
      query: () => ({
        url: `${VENDOR_URL}/banners`, // ✅ Fetch banners from all vendors
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetAllBannersQuery } = vendorApiSlice;
