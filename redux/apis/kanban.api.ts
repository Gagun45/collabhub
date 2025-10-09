import {
  createNewColumn,
  createNewTask,
  deleteColumn,
  deleteTask,
  editColumnTitle,
  editTaskTitle,
  getKanbanBoard,
  reorderProjectColumns,
  reorderSingleColumn,
  reorderTwoColumns,
} from "@/lib/actions/kanban.actions";
import { UNEXPECTED_ERROR } from "@/lib/constants";
import type { Column, Task } from "@prisma/client";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const kanbanApi = createApi({
  reducerPath: "kanbanApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["board"],
  endpoints: (builder) => ({
    getKanbanBoard: builder.query<
      { columns: Column[]; tasks: Task[] },
      { projectPid: string }
    >({
      queryFn: async ({ projectPid }) => {
        try {
          const { board } = await getKanbanBoard(projectPid);
          if (!board) return { error: "Something went wrong" };
          const { columns, tasks } = board;
          return { data: { columns, tasks } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      providesTags: (result, error, { projectPid }) => [
        { type: "board", id: projectPid },
      ],
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
          kanbanApi.util.updateQueryData(
            "getKanbanBoard",
            { projectPid },
            (draft) => {
              const existingCols = draft.columns;
              existingCols.push({
                id: 0,
                columnPid: "0",
                index: existingCols.length + 1,
                projectPid: "0",
                title,
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
      invalidatesTags: (result, error, { projectPid }) => [
        { type: "board", id: projectPid },
      ],
    }),
    deleteColumn: builder.mutation<
      { success: boolean },
      { columnPid: string; projectPid: string }
    >({
      queryFn: async ({ columnPid, projectPid }) => {
        try {
          await deleteColumn(columnPid, projectPid);
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
          kanbanApi.util.updateQueryData(
            "getKanbanBoard",
            { projectPid },
            (draft) => {
              draft.columns = draft.columns.filter(
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
      invalidatesTags: (result, error, { projectPid }) => [
        { type: "board", id: projectPid },
      ],
    }),
    editColumnTitle: builder.mutation<
      { success: boolean },
      { columnPid: string; newColumnTitle: string; projectPid: string }
    >({
      queryFn: async ({ columnPid, newColumnTitle, projectPid }) => {
        try {
          await editColumnTitle(columnPid, newColumnTitle, projectPid);
          return { data: { success: true } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      onQueryStarted: async (
        { projectPid, columnPid, newColumnTitle },
        { dispatch, queryFulfilled }
      ) => {
        const patch = dispatch(
          kanbanApi.util.updateQueryData(
            "getKanbanBoard",
            { projectPid },
            (draft) => {
              draft.columns = draft.columns.map((c) =>
                c.columnPid === columnPid
                  ? {
                      ...c,
                      title: newColumnTitle,
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
      invalidatesTags: (result, error, { projectPid }) => [
        { type: "board", id: projectPid },
      ],
    }),
    reorderSingleColumn: builder.mutation<
      { success: boolean },
      { projectPid: string; newTasksOrderPids: string[]; columnPid: string }
    >({
      queryFn: async ({ newTasksOrderPids, projectPid }) => {
        try {
          await reorderSingleColumn(newTasksOrderPids, projectPid);
          return { data: { success: true } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },

      invalidatesTags: (result, error, { projectPid }) => [
        { type: "board", id: projectPid },
      ],
    }),
    reorderProjectColumns: builder.mutation<
      { success: boolean },
      { projectPid: string; newColumns: string[] }
    >({
      queryFn: async ({ newColumns, projectPid }) => {
        try {
          await reorderProjectColumns(newColumns, projectPid);
          return { data: { success: true } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      invalidatesTags: (result, error, { projectPid }) => [
        { type: "board", id: projectPid },
      ],
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
        projectPid,
      }) => {
        try {
          await reorderTwoColumns(
            fromColumnPid,
            fromColumnTaskPids,
            toColumnPid,
            toColumnTaskPids,
            projectPid
          );
          return { data: { success: true } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      invalidatesTags: (result, error, { projectPid }) => [
        { type: "board", id: projectPid },
      ],
    }),
    createNewTask: builder.mutation<
      { success: boolean },
      { columnPid: string; taskTitle: string; projectPid: string }
    >({
      queryFn: async ({ columnPid, taskTitle, projectPid }) => {
        try {
          await createNewTask(columnPid, taskTitle, projectPid);
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
          kanbanApi.util.updateQueryData(
            "getKanbanBoard",
            { projectPid },
            (draft) => {
              draft.tasks = [
                ...draft.tasks,
                {
                  columnPid,
                  id: 0,
                  index: draft.tasks.length + 1,
                  taskPid: "0",
                  title: taskTitle,
                },
              ];
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: (result, error, { projectPid }) => [
        { type: "board", id: projectPid },
      ],
    }),
    deleteTask: builder.mutation<
      { success: boolean },
      { taskPid: string; projectPid: string }
    >({
      queryFn: async ({ taskPid, projectPid }) => {
        try {
          await deleteTask(taskPid, projectPid);
          return { data: { success: true } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      onQueryStarted: async (
        { taskPid, projectPid },
        { dispatch, queryFulfilled }
      ) => {
        const patch = dispatch(
          kanbanApi.util.updateQueryData(
            "getKanbanBoard",
            { projectPid },
            (draft) => {
              draft.tasks = draft.tasks.filter((t) => t.taskPid !== taskPid);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: (result, error, { projectPid }) => [
        { type: "board", id: projectPid },
      ],
    }),
    editTaskTitle: builder.mutation<
      { success: boolean },
      {
        projectPid: string;
        taskPid: string;
        newTaskTitle: string;
      }
    >({
      queryFn: async ({ taskPid, newTaskTitle, projectPid }) => {
        try {
          await editTaskTitle(taskPid, newTaskTitle, projectPid);
          return { data: { success: true } };
        } catch {
          return { error: UNEXPECTED_ERROR };
        }
      },
      onQueryStarted: async (
        { taskPid, projectPid, newTaskTitle },
        { dispatch, queryFulfilled }
      ) => {
        const patch = dispatch(
          kanbanApi.util.updateQueryData(
            "getKanbanBoard",
            { projectPid },
            (draft) => {
              draft.tasks = draft.tasks.map((t) =>
                t.taskPid === taskPid ? { ...t, title: newTaskTitle } : t
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

      invalidatesTags: (result, error, { projectPid }) => [
        { type: "board", id: projectPid },
      ],
    }),
  }),
});

export const {
  useGetKanbanBoardQuery,
  useCreateNewColumnMutation,
  useDeleteColumnMutation,
  useEditColumnTitleMutation,
  useReorderSingleColumnMutation,
  useReorderProjectColumnsMutation,
  useReorderTwoColumnsMutation,
  useCreateNewTaskMutation,
  useDeleteTaskMutation,
  useEditTaskTitleMutation,
} = kanbanApi;
