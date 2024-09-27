import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../config";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => "/user-details",
    }),
    updateUserProfile: builder.mutation({
      query: (profileData) => ({
        url: "/update-profile",
        method: "POST",
        body: profileData,
      }),
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } =
  profileApi;
