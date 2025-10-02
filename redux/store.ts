import { configureStore } from "@reduxjs/toolkit";
import { profileApi } from "./apis/profile.api";
import { teamsApi } from "./apis/teams.api";

export const store = configureStore({
  reducer: {
    [profileApi.reducerPath]: profileApi.reducer,
    [teamsApi.reducerPath]: teamsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(profileApi.middleware)
      .concat(teamsApi.middleware),
});
