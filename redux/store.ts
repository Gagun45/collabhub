import { configureStore } from "@reduxjs/toolkit";
import { profileApi } from "./apis/profile.api";
import { teamsApi } from "./apis/teams.api";
import { projectsApi } from "./apis/projects.api";
import { kanbanApi } from "./apis/kanban.api";

export const store = configureStore({
  reducer: {
    [profileApi.reducerPath]: profileApi.reducer,
    [teamsApi.reducerPath]: teamsApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [kanbanApi.reducerPath]: kanbanApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(profileApi.middleware)
      .concat(teamsApi.middleware)
      .concat(kanbanApi.middleware)
      .concat(projectsApi.middleware),
});
