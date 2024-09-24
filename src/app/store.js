import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import { childApi } from '../features/Forms/ChildInfo';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [childApi.reducerPath]: childApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(childApi.middleware), 
});
