import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../config";

export const childApi = createApi({
  reducerPath: "childApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },

    responseHandler: (response) =>
      response.text().then((text) => {
        try {
          return JSON.parse(text);
        } catch {
          return text;
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

    fetchChildren: builder.query({
      query: () => ({
        url: "/children",
        method: "GET",
      }),
    }),

    deleteChild: builder.mutation({
      query: (urn) => ({
        url: `/child/${urn}`,
        method: "DELETE",
      }),
    }),

  }),
});

export const { useChildUserMutation, useFetchChildrenQuery, useDeleteChildMutation  } = childApi;
