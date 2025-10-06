import {
  createNewColumn,
  deleteColumn,
  reorderProjectColumns,
  updateColumnTitle,
} from "@/lib/actions/column.actions";
import {
  createNewProject,
  getProjectByProjectPid,
  getTeamProjectsByTeamPid,
} from "@/lib/actions/project.actions";
import { createNewTask } from "@/lib/actions/task.actions";
import { UNEXPECTED_ERROR } from "@/lib/constants";
import type {
  newProjectSchemaType,
  ProjectType,
  SuccessAndMessageType,
} from "@/lib/types";
import type { Project } from "@prisma/client";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["teamProjects", "project"],
  endpoints: (builder) => ({
    createNewTask: builder.mutation<
      { success: boolean },
      { columnPid: string; taskTitle: string }
    >({
      queryFn: async ({ columnPid, taskTitle }) => {
        try {
          await createNewTask(columnPid, taskTitle);
          return { data: { success: true } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      invalidatesTags: ["project"],
    }),
    deleteColumn: builder.mutation<
      { success: boolean },
      { columnPid: string; projectPid: string }
    >({
      queryFn: async ({ columnPid }) => {
        try {
          await deleteColumn(columnPid);
          return { data: { success: true } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      onQueryStarted: async (
        { columnPid, projectPid },
        { dispatch, queryFulfilled }
      ) => {
        const patch = dispatch(
          projectsApi.util.updateQueryData(
            "getProjectByProjectPid",
            { projectPid },
            (draft) => {
              draft.project!.Column = draft.project!.Column.filter(
                (c) => c.columnPid !== columnPid
              );
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["project"],
    }),
    updateColumnTitle: builder.mutation<
      { success: boolean },
      { columnPid: string; newTitle: string }
    >({
      queryFn: async ({ columnPid, newTitle }) => {
        try {
          await updateColumnTitle(columnPid, newTitle);
          return { data: { success: true } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      invalidatesTags: ["project"],
    }),
    reorderProjectColumns: builder.mutation<
      { success: boolean },
      { projectPid: string; newColumns: string[] }
    >({
      queryFn: async ({ newColumns }) => {
        try {
          const result = await reorderProjectColumns(newColumns);
          return { data: result };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      onQueryStarted: async (
        { newColumns, projectPid },
        { dispatch, queryFulfilled }
      ) => {
        const patch = dispatch(
          projectsApi.util.updateQueryData(
            "getProjectByProjectPid",
            { projectPid },
            (draft) => {
              draft.project!.Column = draft.project!.Column.map((c) => {
                const existing = newColumns.findIndex((e) => e === c.columnPid);
                return { ...c, index: existing + 1 };
              });
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["project"],
    }),
    createNewColumn: builder.mutation<
      { success: boolean },
      { projectPid: string; title: string }
    >({
      queryFn: async ({ projectPid, title }) => {
        try {
          await createNewColumn(projectPid, title);
          return { data: { success: true } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      onQueryStarted: async (
        { title, projectPid },
        { dispatch, queryFulfilled }
      ) => {
        const patch = dispatch(
          projectsApi.util.updateQueryData(
            "getProjectByProjectPid",
            { projectPid },
            (draft) => {
              const existing = draft.project!.Column;
              existing.push({
                id: 0,
                columnPid: "0",
                index: existing.length + 1,
                projectPid: "0",
                title,
                Task: [],
              });
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["project"],
    }),
    getProjectByProjectPid: builder.query<
      SuccessAndMessageType & {
        project: ProjectType | null;
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
      providesTags: ["project"],
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
  useCreateNewColumnMutation,
  useReorderProjectColumnsMutation,
  useUpdateColumnTitleMutation,
  useDeleteColumnMutation,
  useCreateNewTaskMutation,
} = projectsApi;
