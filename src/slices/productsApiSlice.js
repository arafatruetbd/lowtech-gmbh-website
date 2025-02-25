import { CATEGORY_URL, PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLatestProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/latest`,
      }),
      keepUnusedDataFor: 5, // Cache for 5 seconds
    }),
    getProductsBySearch: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: `${PRODUCTS_URL}/search`,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
    }),
    getCategoryProducts: builder.query({
      query: ({ categoryId }) => ({
        url: `${PRODUCTS_URL}/category/${categoryId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getCategories: builder.query({
      query: () => ({
        url: `${CATEGORY_URL}`,
      }),
      keepUnusedDataFor: 5, // Cache for 5 seconds
    }),
  }),
});

export const {
  useGetProductDetailsQuery,
  useGetProductsBySearchQuery,
  useGetLatestProductsQuery,
  useGetCategoryProductsQuery,
  useGetCategoriesQuery,
} = productsApiSlice;
