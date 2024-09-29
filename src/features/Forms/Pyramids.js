// formulationApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../config";

export const formulationApi = createApi({
  reducerPath: "formulationApi",
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
    addFormulation: builder.mutation({
      query: ({ urn, domains }) => ({
        url: `/child/formulation`,
        method: "POST",
        body: { urn, domains },
      }),
    }),
    getFormulation: builder.query({
      query: (urn) => ({
        url: `/child/formulation/latest/${urn}`,
        method: "GET",
      }),
    }),
    updateFormulation: builder.mutation({
      query: ({ urn, domains }) => ({
        url: `/child/formulation/${urn}`,
        method: "PUT",
        body: { domains },
      }),
    }),
  }),
});

export const {
  useAddFormulationMutation,
  useGetFormulationQuery,
  useUpdateFormulationMutation,
} = formulationApi;
