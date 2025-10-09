"use server";

import { prisma } from "../prisma";
import type { BoardType } from "../types";
import { verifyProjectAccessByProjectPidOrThrow } from "./helper";

export const getKanbanBoard = async (
  projectPid: string
): Promise<{ board: BoardType | null }> => {
  await verifyProjectAccessByProjectPidOrThrow(projectPid);
  try {
    const project = await prisma.project.findUnique({
      where: { projectPid },
      include: { Column: { include: { Task: true } } },
    });
    if (!project) return { board: null };
    return {
      board: {
        columns: project.Column,
        tasks: project.Column.flatMap((c) => c.Task),
      },
    };
  } catch {
    return { board: null };
  }
};

export const createNewColumn = async (projectPid: string, title: string) => {
  await verifyProjectAccessByProjectPidOrThrow(projectPid);
  await prisma.$transaction(async (tx) => {
    const count = await tx.column.count({
      where: { project: { projectPid } },
    });
    await tx.column.create({
      data: { title, project: { connect: { projectPid } }, index: count + 1 },
    });
  });
};

export const getProjectColumnsByProjectPid = async (projectPid: string) => {
  await verifyProjectAccessByProjectPidOrThrow(projectPid);
  const columns = await prisma.column.findMany({
    where: { project: { projectPid } },
  });
  return { columns };
};

export const reorderProjectColumns = async (
  newColumns: string[],
  projectPid: string
) => {
  await verifyProjectAccessByProjectPidOrThrow(projectPid);
  const updates = newColumns.map((columnPid, index) =>
    prisma.column.update({
      where: { columnPid },
      data: { index: index + 1 },
    })
  );

  await prisma.$transaction(updates);
};

export const editColumnTitle = async (
  columnPid: string,
  newColumntitle: string,
  projectPid: string
) => {
  if (!newColumntitle) return;
  await verifyProjectAccessByProjectPidOrThrow(projectPid);
  await prisma.column.update({
    where: { columnPid },
    data: { title: newColumntitle },
  });
};

export const deleteColumn = async (columnPid: string, projectPid: string) => {
  await verifyProjectAccessByProjectPidOrThrow(projectPid);
  await prisma.column.delete({ where: { columnPid } });
};

export const reorderSingleColumn = async (
  newTasksOrderPids: string[],
  projectPid: string
) => {
  await verifyProjectAccessByProjectPidOrThrow(projectPid);
  const updates = newTasksOrderPids.map((taskPid, index) =>
    prisma.task.update({ where: { taskPid }, data: { index: index + 1 } })
  );
  await prisma.$transaction(updates);
};

export const reorderTwoColumns = async (
  fromColumnPid: string,
  fromColumnTaskPids: string[],
  toColumnPid: string,
  toColumnTaskPids: string[],
  projectPid: string
) => {
  await verifyProjectAccessByProjectPidOrThrow(projectPid);
  await prisma.$transaction(async (tx) => {
    await Promise.all(
      fromColumnTaskPids.map((taskPid, index) =>
        tx.task.update({
          where: { taskPid },
          data: { index: index + 1, columnPid: fromColumnPid },
        })
      )
    );
    await Promise.all(
      toColumnTaskPids.map((taskPid, index) =>
        tx.task.update({
          where: { taskPid },
          data: { index: index + 1, columnPid: toColumnPid },
        })
      )
    );
  });
};

export const createNewTask = async (
  columnPid: string,
  taskTitle: string,
  projectPid: string
) => {
  if (!taskTitle) return;
  await verifyProjectAccessByProjectPidOrThrow(projectPid);
  await prisma.$transaction(async (tx) => {
    const count = await tx.task.count({
      where: { columnPid },
    });
    await tx.task.create({
      data: {
        title: taskTitle,
        column: { connect: { columnPid } },
        index: count + 1,
      },
    });
  });
};

export const deleteTask = async (taskPid: string, projectPid: string) => {
  await verifyProjectAccessByProjectPidOrThrow(projectPid);
  await prisma.$transaction(async (tx) => {
    const deletedTask = await tx.task.delete({ where: { taskPid } });
    const { columnPid } = deletedTask;
    const remainingTasks = await tx.task.findMany({
      where: { columnPid },
      orderBy: { index: "asc" },
    });
    await Promise.all(
      remainingTasks.map((t, index) =>
        tx.task.update({
          where: { taskPid: t.taskPid },
          data: { index: index + 1 },
        })
      )
    );
  });
};

export const editTaskTitle = async (
  taskPid: string,
  newTaskTitle: string,
  projectPid: string
) => {
  if (!newTaskTitle) throw new Error("Missing title");
  await verifyProjectAccessByProjectPidOrThrow(projectPid);
  await prisma.task.update({
    where: { taskPid },
    data: { title: newTaskTitle },
  });
};
