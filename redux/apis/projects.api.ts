import {
  createNewColumn,
  deleteColumn,
  reorderProjectColumns,
  reorderSingleColumn,
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
      { columnPid: string; taskTitle: string; projectPid: string }
    >({
      queryFn: async ({ columnPid, taskTitle }) => {
        try {
          await createNewTask(columnPid, taskTitle);
          return { data: { success: true } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      onQueryStarted: async (
        { columnPid, taskTitle, projectPid },
        { dispatch, queryFulfilled }
      ) => {
        const patch = dispatch(
          projectsApi.util.updateQueryData(
            "getProjectByProjectPid",
            { projectPid },
            (draft) => {
              draft.project!.Column = draft.project!.Column.map((col) => {
                if (col.columnPid === columnPid) {
                  return {
                    ...col,
                    Task: [
                      ...col.Task,
                      {
                        columnPid,
                        id: 0,
                        index: col.Task.length + 1,
                        taskPid: "0",
                        title: taskTitle,
                      },
                    ],
                  };
                }
                return col;
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
    reorderSingleColumn: builder.mutation<
      { success: boolean },
      { projectPid: string; newTasksOrderPids: string[]; columnPid: string }
    >({
      queryFn: async ({ newTasksOrderPids }) => {
        try {
          await reorderSingleColumn(newTasksOrderPids);
          return { data: { success: true } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      onQueryStarted: async (
        { newTasksOrderPids, projectPid, columnPid },
        { dispatch, queryFulfilled }
      ) => {
        const patch = dispatch(
          projectsApi.util.updateQueryData(
            "getProjectByProjectPid",
            { projectPid },
            (draft) => {
              draft.project!.Column = draft.project!.Column.map((c) => {
                if (c.columnPid !== columnPid) return c;
                return {
                  ...c,
                  Task: c.Task.map((t) => {
                    const newIndex = newTasksOrderPids.findIndex(
                      (tpid) => tpid === t.taskPid
                    );
                    return { ...t, index: newIndex + 1 };
                  }),
                };
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
    reorderProjectColumns: builder.mutation<
      { success: boolean },
      { projectPid: string; newColumns: string[] }
    >({
      queryFn: async ({ newColumns }) => {
        try {
          await reorderProjectColumns(newColumns);
          return { data: { success: true } };
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
  useReorderSingleColumnMutation,
} = projectsApi;
