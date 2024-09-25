import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../config"; // baseUrl is assumed to be correctly defined here

export const childApi = createApi({
  reducerPath: "childApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    // Override the default response handler to avoid JSON parsing errors for non-JSON responses
    responseHandler: (response) => response.text().then((text) => {
      try {
        return JSON.parse(text); // Try to parse as JSON
      } catch {
        return text; // Return as plain text if parsing fails
      }
    }),
  }),
  endpoints: (builder) => ({
    childUser: builder.mutation({
      query: (userData) => ({
        url: "/child",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const { useChildUserMutation } = childApi;
