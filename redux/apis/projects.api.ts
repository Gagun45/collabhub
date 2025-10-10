import {
  addMemberToProjectByProjectPid,
  createNewProject,
  deleteProject,
  editProjectTitle,
  getProjectByProjectPid,
  getTeamMembersToInvite,
  getTeamProjectsByTeamPid,
} from "@/lib/actions/project.actions";
import { UNEXPECTED_ERROR } from "@/lib/constants";
import type {
  newProjectSchemaType,
  ProjectMembersToInvite,
  ProjectType,
  SuccessAndMessageType,
} from "@/lib/types";
import type { $Enums, Project } from "@prisma/client";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["teamProjects", "project", "membersToInvite"],
  endpoints: (builder) => ({
    addMemberToProjectByProjectPid: builder.mutation<
      { success: boolean },
      { projectPid: string; userId: number }
    >({
      queryFn: async ({ projectPid, userId }) => {
        try {
          await addMemberToProjectByProjectPid(projectPid, userId);
          return { data: { success: true } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      onQueryStarted: async (
        { projectPid, userId },
        { dispatch, queryFulfilled }
      ) => {
        const patch = dispatch(
          projectsApi.util.updateQueryData(
            "getTeamMembersToInvite",
            { projectPid },
            (draft) => {
              draft.members = draft.members.filter((u) => u.userId !== userId);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: (result, error, { projectPid }) => {
        if (result?.success)
          return [
            { type: "membersToInvite", id: projectPid },
            { type: "project", id: projectPid },
          ];
        return [];
      },
    }),
    getTeamMembersToInvite: builder.query<
      {
        members: ProjectMembersToInvite[];
      },
      { projectPid: string }
    >({
      queryFn: async ({ projectPid }) => {
        try {
          const members = await getTeamMembersToInvite(projectPid);
          return { data: { members } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      providesTags: (result, error, { projectPid }) => [
        { type: "membersToInvite", id: projectPid },
      ],
    }),

    deleteProject: builder.mutation<
      SuccessAndMessageType,
      { projectPid: string }
    >({
      queryFn: async ({ projectPid }) => {
        try {
          const result = await deleteProject(projectPid);
          return { data: { success: true, message: result.message } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      invalidatesTags: (result, error, { projectPid }) => [
        { type: "project", id: projectPid },
        "teamProjects",
      ],
    }),

    editProjectTitle: builder.mutation<
      { success: boolean },
      { newProjectTitle: string; projectPid: string; teamPid: string }
    >({
      queryFn: async ({ newProjectTitle, projectPid }) => {
        try {
          await editProjectTitle(projectPid, newProjectTitle);
          return { data: { success: true } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      onQueryStarted: async (
        { projectPid, newProjectTitle, teamPid },
        { dispatch, queryFulfilled }
      ) => {
        const patchResults = [
          dispatch(
            projectsApi.util.updateQueryData(
              "getProjectByProjectPid",
              { projectPid },
              (draft) => {
                draft.project!.title = newProjectTitle;
              }
            )
          ),
          dispatch(
            projectsApi.util.updateQueryData(
              "getTeamProjectsByTeamPid",
              { teamPid },
              (draft) => {
                draft.projects = draft.projects.map((p) =>
                  p.projectPid === projectPid
                    ? { ...p, title: newProjectTitle }
                    : p
                );
              }
            )
          ),
        ];
        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, { projectPid }) => [
        { type: "project", id: projectPid },
        "teamProjects",
      ],
    }),

    getProjectByProjectPid: builder.query<
      SuccessAndMessageType & {
        project: ProjectType | null;
        role: $Enums.ProjectRole | null;
      },
      { projectPid: string }
    >({
      queryFn: async ({ projectPid }) => {
        try {
          const result = await getProjectByProjectPid(projectPid);
          if (!result.success) return { error: result.message };
          return { data: result };
        } catch {
          return { error: "Unexpected error" };
        }
      },
      providesTags: (result, error, { projectPid }) => {
        if (result?.success) return [{ type: "project", id: projectPid }];
        return [];
      },
    }),
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

export const {
  useCreateNewProjectMutation,
  useGetTeamProjectsByTeamPidQuery,
  useGetProjectByProjectPidQuery,
  useEditProjectTitleMutation,
  useDeleteProjectMutation,
  useGetTeamMembersToInviteQuery,
  useAddMemberToProjectByProjectPidMutation,
} = projectsApi;
