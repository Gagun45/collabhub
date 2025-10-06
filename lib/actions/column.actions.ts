"use server";

import { prisma } from "../prisma";

export const createNewColumn = async (projectPid: string, title: string) => {
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
  const columns = await prisma.column.findMany({
    where: { project: { projectPid } },
  });
  return { columns };
};

export const reorderProjectColumns = async (newColumns: string[]) => {
  const updates = newColumns.map((columnPid, index) =>
    prisma.column.update({
      where: { columnPid },
      data: { index: index + 1 },
    })
  );

  await prisma.$transaction(updates);

  return { success: true };
};

export const updateColumnTitle = async (columnId: number, newTitle: string) => {
  await prisma.column.update({
    where: { id: columnId },
    data: { title: newTitle },
  });
};

export const deleteColumn = async (columnId: number) => {
  await prisma.column.delete({ where: { id: columnId } });
};
