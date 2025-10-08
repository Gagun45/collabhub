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
};

export const editColumnTitle = async (
  columnPid: string,
  newColumntitle: string
) => {
  if (!newColumntitle) return;
  await prisma.column.update({
    where: { columnPid },
    data: { title: newColumntitle },
  });
};

export const deleteColumn = async (columnPid: string) => {
  await prisma.column.delete({ where: { columnPid } });
};

export const reorderSingleColumn = async (newTasksOrderPids: string[]) => {
  const updates = newTasksOrderPids.map((taskPid, index) =>
    prisma.task.update({ where: { taskPid }, data: { index: index + 1 } })
  );
  await prisma.$transaction(updates);
};

export const reorderTwoColumns = async (
  fromColumnPid: string,
  fromColumnTaskPids: string[],
  toColumnPid: string,
  toColumnTaskPids: string[]
) => {
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
