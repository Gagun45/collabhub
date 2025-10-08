import {
  createNewColumn,
  deleteColumn,
  reorderProjectColumns,
  reorderSingleColumn,
  reorderTwoColumns,
  updateColumnTitle,
} from "@/lib/actions/column.actions";
import {
  createNewProject,
  getProjectByProjectPid,
  getTeamProjectsByTeamPid,
} from "@/lib/actions/project.actions";
import {
  createNewTask,
  deleteTask,
  editTaskTitle,
} from "@/lib/actions/task.actions";
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
    deleteTask: builder.mutation<
      { success: boolean },
      { taskPid: string; columnPid: string; projectPid: string }
    >({
      queryFn: async ({ taskPid }) => {
        try {
          await deleteTask(taskPid);
          return { data: { success: true } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      onQueryStarted: async (
        { taskPid, projectPid, columnPid },
        { dispatch, queryFulfilled }
      ) => {
        const patch = dispatch(
          projectsApi.util.updateQueryData(
            "getProjectByProjectPid",
            { projectPid },
            (draft) => {
              draft.project!.Column = draft.project!.Column.map((c) =>
                c.columnPid === columnPid
                  ? {
                      ...c,
                      Task: c.Task.filter((t) => t.taskPid !== taskPid).map(
                        (t, index) => ({ ...t, index })
                      ),
                    }
                  : c
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
    editTaskTitle: builder.mutation<
      { success: boolean },
      {
        projectPid: string;
        taskPid: string;
        newTaskTitle: string;
        columnPid: string;
      }
    >({
      queryFn: async ({ taskPid, newTaskTitle }) => {
        try {
          await editTaskTitle(taskPid, newTaskTitle);
          return { data: { success: true } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      onQueryStarted: async (
        { taskPid, projectPid, columnPid, newTaskTitle },
        { dispatch, queryFulfilled }
      ) => {
        const patch = dispatch(
          projectsApi.util.updateQueryData(
            "getProjectByProjectPid",
            { projectPid },
            (draft) => {
              draft.project!.Column = draft.project!.Column.map((c) =>
                c.columnPid === columnPid
                  ? {
                      ...c,
                      Task: c.Task.map((t) =>
                        t.taskPid === taskPid
                          ? { ...t, title: newTaskTitle }
                          : t
                      ),
                    }
                  : c
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
    reorderTwoColumns: builder.mutation<
      { success: boolean },
      {
        projectPid: string;
        fromColumnPid: string;
        fromColumnTaskPids: string[];
        toColumnPid: string;
        toColumnTaskPids: string[];
      }
    >({
      queryFn: async ({
        fromColumnTaskPids,
        toColumnTaskPids,
        fromColumnPid,
        toColumnPid,
      }) => {
        try {
          await reorderTwoColumns(
            fromColumnPid,
            fromColumnTaskPids,
            toColumnPid,
            toColumnTaskPids
          );
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
  useReorderTwoColumnsMutation,
  useDeleteTaskMutation,
  useEditTaskTitleMutation,
} = projectsApi;
