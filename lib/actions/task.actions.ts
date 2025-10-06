"use server";

import { prisma } from "../prisma";

export const createNewTask = async (columnId: number, taskTitle: string) => {
  await prisma.task.create({ data: { title: taskTitle, columnId } });
};
