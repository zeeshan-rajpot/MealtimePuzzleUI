import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../config";

export const stepperApi = createApi({
  reducerPath: "stepperApi",
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
    addStepper: builder.mutation({
      query: ({ urn, domainId, FormData }) => ({
        url: `/child/${urn}/${domainId}`,
        method: "POST",
        body: FormData,
      }),
    }),
  }),
});

export const { useAddStepperMutation } = stepperApi;
