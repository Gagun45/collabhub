import {
  createNewProject,
  getTeamProjectsByTeamPid,
} from "@/lib/actions/project.actions";
import { UNEXPECTED_ERROR } from "@/lib/constants";
import type { newProjectSchemaType, SuccessAndMessageType } from "@/lib/types";
import type { Project } from "@prisma/client";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["teamProjects"],
  endpoints: (builder) => ({
    getTeamProjectsByTeamPid: builder.query<
      SuccessAndMessageType & { projects: Project[] },
      { teamPid: string }
    >({
      queryFn: async ({ teamPid }) => {
        try {
          const result = await getTeamProjectsByTeamPid(teamPid);
          if (!result.success) return { error: result.message };
          return { data: result };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      providesTags: ["teamProjects"],
    }),
    createNewProject: builder.mutation<
      SuccessAndMessageType,
      { teamPid: string; values: newProjectSchemaType }
    >({
      queryFn: async ({ teamPid, values }) => {
        try {
          const result = await createNewProject(teamPid, values);
          if (!result.success) return { error: result.message };
          return { data: result };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      invalidatesTags: ["teamProjects"],
    }),
  }),
});

export const { useCreateNewProjectMutation, useGetTeamProjectsByTeamPidQuery } =
  projectsApi;
