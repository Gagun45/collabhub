"use server";

import { prisma } from "../prisma";

export const createNewTask = async (columnPid: string, taskTitle: string) => {
  await prisma.task.create({ data: { title: taskTitle, columnPid } });
};
