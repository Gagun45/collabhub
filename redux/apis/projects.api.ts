import {
  createNewColumn,
  deleteColumn,
  editColumnTitle,
  reorderProjectColumns,
  reorderSingleColumn,
  reorderTwoColumns,
} from "@/lib/actions/column.actions";
import {
  createNewProject,
  deleteProject,
  editProjectTitle,
  getProjectByProjectPid,
  getTeamMembersToInvite,
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
        { type: "project", id: projectPid },
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
      invalidatesTags: (result, error, { projectPid }) => [
        { type: "project", id: projectPid },
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
    }),
    deleteTask: builder.mutation<
      { success: boolean },
      { taskPid: string; columnPid: string; projectPid: string }
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
      invalidatesTags: (result, error, { projectPid }) => [
        { type: "project", id: projectPid },
      ],
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
      queryFn: async ({ taskPid, newTaskTitle, projectPid }) => {
        try {
          await editTaskTitle(taskPid, newTaskTitle, projectPid);
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

      invalidatesTags: (result, error, { projectPid }) => [
        { type: "project", id: projectPid },
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
      invalidatesTags: (result, error, { projectPid }) => [
        { type: "project", id: projectPid },
      ],
    }),

    editProjectTitle: builder.mutation<
      { success: boolean },
      { newProjectTitle: string; projectPid: string }
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
        { projectPid, newProjectTitle },
        { dispatch, queryFulfilled }
      ) => {
        const patch = dispatch(
          projectsApi.util.updateQueryData(
            "getProjectByProjectPid",
            { projectPid },
            (draft) => {
              draft.project!.title = newProjectTitle;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["project", "teamProjects"],
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
          projectsApi.util.updateQueryData(
            "getProjectByProjectPid",
            { projectPid },
            (draft) => {
              draft.project!.Column = draft.project!.Column.map((c) =>
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
        { type: "project", id: projectPid },
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
        { type: "project", id: projectPid },
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
        { type: "project", id: projectPid },
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
        { type: "project", id: projectPid },
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
      invalidatesTags: (result, error, { projectPid }) => [
        { type: "project", id: projectPid },
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
      providesTags: (result, error, { projectPid }) =>
        result?.project
          ? [{ type: "project", id: projectPid }]
          : [{ type: "project", id: "list" }],
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
  useEditColumnTitleMutation,
  useDeleteColumnMutation,
  useCreateNewTaskMutation,
  useReorderSingleColumnMutation,
  useReorderTwoColumnsMutation,
  useDeleteTaskMutation,
  useEditTaskTitleMutation,
  useEditProjectTitleMutation,
  useDeleteProjectMutation,
  useGetTeamMembersToInviteQuery,
} = projectsApi;
