import { configureStore } from "@reduxjs/toolkit";
import { profileApi } from "./apis/profile.api";

export const store = configureStore({
  reducer: {
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(profileApi.middleware),
});
