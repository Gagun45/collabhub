"use server";

import { prisma } from "../prisma";

export const createNewColumn = async (projectPid: string, title: string) => {
  await prisma.column.create({
    data: { title, project: { connect: { projectPid } } },
  });
  return { success: true };
};

export const getProjectColumnsByProjectPid = async (projectPid: string) => {
  const columns = await prisma.column.findMany({
    where: { project: { projectPid } },
  });
  return { columns };
};

export const reorderProjectColumns = async (newColumns: number[]) => {
  const updates = newColumns.map((id, index) =>
    prisma.column.update({
      where: { id },
      data: { index: index + 1 },
    })
  );

  await prisma.$transaction(updates);

  return { success: true };
};

export const updateColumnTitle = async (columnId: number, newTitle: string) => {
  const updatedCol = await prisma.column.update({
    where: { id: columnId },
    data: { title: newTitle },
  });
  if (!updatedCol) return { success: false };
  return { success: true };
};
