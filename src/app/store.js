import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/authApi";
import { childApi } from "../features/Forms/ChildInfo";
import { formulationApi } from "../features/Forms/Pyramids";
import { stepperApi } from "../features/Forms/stepper";
import { profileApi } from "../features/Profile/profileApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [childApi.reducerPath]: childApi.reducer,
    [formulationApi.reducerPath]: formulationApi.reducer,
    [stepperApi.reducerPath]: stepperApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(childApi.middleware)
      .concat(formulationApi.middleware)
      .concat(stepperApi.middleware)
      .concat(profileApi.middleware),
});
