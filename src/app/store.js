import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/authApi";
import { childApi } from "../features/Forms/ChildInfo";
import { formulationApi } from "../features/Forms/Pyramids";
import { profileApi } from "../features/Profile/profileApi";
import { interventionApi } from "../features/Forms/Intervention";


export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [childApi.reducerPath]: childApi.reducer,
    [formulationApi.reducerPath]: formulationApi.reducer,
    [interventionApi.reducerPath]: interventionApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(childApi.middleware)
      .concat(formulationApi.middleware)
      .concat(interventionApi.middleware)
      .concat(profileApi.middleware),
});
