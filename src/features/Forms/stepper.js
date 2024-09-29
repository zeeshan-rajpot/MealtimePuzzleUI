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
      query: ({ childUrn, domains }) => ({
        url: `/post/Intervention`,
        method: "POST",
        body: { childUrn, domains },
      }),
    }),
  }),
});

export const { useAddStepperMutation } = stepperApi;
