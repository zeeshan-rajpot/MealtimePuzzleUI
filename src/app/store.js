import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/authApi"; // API slice for authentication
import { childApi } from "../features/Forms/ChildInfo"; // API slice for child information
import { formulationApi } from "../features/Forms/Pyramids"; // API slice for formulations
import { profileApi } from "../features/Profile/profileApi"; // API slice for user profiles
import { interventionApi } from "../features/Forms/Intervention"; // API slice for interventions

// Configure and export the Redux store
export const store = configureStore({
  reducer: {
    // Adding each API slice's reducer to the store
    [authApi.reducerPath]: authApi.reducer,
    [childApi.reducerPath]: childApi.reducer,
    [formulationApi.reducerPath]: formulationApi.reducer,
    [interventionApi.reducerPath]: interventionApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    // Adding middleware for each API slice to handle caching, invalidation, and other Redux-RTK features
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(childApi.middleware)
      .concat(formulationApi.middleware)
      .concat(interventionApi.middleware)
      .concat(profileApi.middleware),
});
