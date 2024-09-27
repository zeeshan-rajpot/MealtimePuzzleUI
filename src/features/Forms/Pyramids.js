// formulationApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../config"; // Assuming you have a base URL

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
        url: `/child/formulation/${urn}`,
        method: "POST",
        body: { domains },
      }),
    }),
  }),
});

export const { useAddFormulationMutation } = formulationApi;
