"use server";

import { prisma } from "../prisma";
import { getAuthUser, verifyProjectAccessByProjectPidOrThrow } from "./helper";

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

export const editTaskTitle = async (taskPid: string, newTaskTitle: string) => {
  if (!newTaskTitle) return;
  const user = await getAuthUser();
  if (!user) return;
  await prisma.task.update({
    where: { taskPid },
    data: { title: newTaskTitle },
  });
};
