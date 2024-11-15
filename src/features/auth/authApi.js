import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../config"; // Base URL for the API

// Define the authApi slice
export const authApi = createApi({
  reducerPath: "authApi", // Unique key for the slice
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }), // Base URL for all requests
  
  // Prepare headers for each request
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token"); // Retrieve the auth token from local storage
    if (token) {
      headers.set("authorization", `Bearer ${token}`); // Set the token in authorization header
    }
    return headers;
  },

  // Custom response handler to manage different content types
  responseHandler: async (response) => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json(); // Parse JSON if content type is application/json
    }
    return response.text(); // Return text for plain text responses
  },

  endpoints: (builder) => ({
    // Endpoint for signing up a new user
    signupUser: builder.mutation({
      query: (userData) => ({
        url: "/sign-up",
        method: "POST",
        body: userData, // Pass user data as the request body
      }),
    }),

    // Endpoint for logging in a user
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials, // Pass credentials as the request body
      }),
    }),

    // Endpoint for changing the user's password
    changePassword: builder.mutation({
      query: (credentials) => ({
        url: "/change-password",
        method: "POST",
        body: credentials, // Pass new password details as the request body
      }),
    }),
  }),
});

// Export hooks for each mutation, auto-generated by RTK Query
export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useChangePasswordMutation,
} = authApi;
