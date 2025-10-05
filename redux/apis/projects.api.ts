import {
  createNewColumn,
  reorderProjectColumns,
  updateColumnTitle,
} from "@/lib/actions/column.actions";
import {
  createNewProject,
  getProjectByProjectPid,
  getTeamProjectsByTeamPid,
} from "@/lib/actions/project.actions";
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
    updateColumnTitle: builder.mutation<
      { success: boolean },
      { columnId: number; newTitle: string }
    >({
      queryFn: async ({ columnId, newTitle }) => {
        try {
          const result = await updateColumnTitle(columnId, newTitle);
          return { data: result };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      invalidatesTags: ["project"],
    }),
    reorderProjectColumns: builder.mutation<
      { success: boolean },
      { projectPid: string; newColumns: number[] }
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
                const existing = newColumns.findIndex((e) => e === c.id);
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
          const result = await createNewColumn(projectPid, title);
          return { data: result };
        } catch {
          return { error: UNEXPECTED_ERROR };
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
} = projectsApi;
