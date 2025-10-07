"use server";

import { prisma } from "../prisma";

export const createNewTask = async (columnPid: string, taskTitle: string) => {
  await prisma.$transaction(async (tx) => {
    const count = await tx.task.count({
      where: { columnPid },
    });
    await tx.task.create({
      data: { title: taskTitle, columnPid, index: count + 1 },
    });
  });
};
