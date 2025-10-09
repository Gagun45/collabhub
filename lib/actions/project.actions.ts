"use server";

import type { Project } from "@prisma/client";
import { SMTH_WENT_WRONG } from "../constants";
import type {
  newProjectSchemaType,
  ProjectType,
  SuccessAndMessageType,
} from "../types";
import {
  verifyProjectAccessByProjectPidOrThrow,
  verifyTeamAccessByTeamPidOrThrow,
} from "./helper";
import { prisma } from "../prisma";
import { nanoid } from "nanoid";

export const createNewProject = async (
  teamPid: string,
  values: newProjectSchemaType
): Promise<SuccessAndMessageType> => {
  try {
    const { user } = await verifyTeamAccessByTeamPidOrThrow(teamPid);
    const { title } = values;
    await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          title,
          createdById: user.id,
          teamPid: teamPid,
          projectPid: nanoid(6),
        },
      });
      await tx.projectMember.create({
        data: { projectId: project.id, userId: user.id, role: "ADMIN" },
      });
    });
    return { success: true, message: "Project created" };
  } catch (error) {
    console.log("Create new project error: ", error);
    return { success: false, message: SMTH_WENT_WRONG };
  }
};

export const getTeamProjectsByTeamPid = async (
  teamPid: string
): Promise<SuccessAndMessageType & { projects: Project[] }> => {
  try {
    const { user, role } = await verifyTeamAccessByTeamPidOrThrow(teamPid);

    let projects: Project[] = [];

    if (role === "ADMIN") {
      projects = await prisma.project.findMany({
        where: {
          team: { teamPid },
        },
      });
    } else if (role === "USER") {
      projects = await prisma.project.findMany({
        where: {
          team: { teamPid },
          ProjectMember: { some: { userId: user.id } },
        },
      });
    }

    return { success: true, message: "Team projects fetched", projects };
  } catch (error) {
    console.log("Get team projects by team pid error: ", error);
    return { success: false, message: SMTH_WENT_WRONG, projects: [] };
  }
};

export const getProjectByProjectPid = async (
  projectPid: string
): Promise<
  SuccessAndMessageType & {
    project: ProjectType | null;
  }
> => {
  await verifyProjectAccessByProjectPidOrThrow(projectPid);
  try {
    const project = await prisma.project.findUnique({
      where: { projectPid },
      include: { Column: { include: { Task: true } } },
    });
    if (!project)
      return { success: false, message: "Project not found", project: null };
    return { success: true, message: "Project fetched", project };
  } catch (error) {
    console.log("Get project by project pid error: ", error);
    return { success: false, message: SMTH_WENT_WRONG, project: null };
  }
};

export const editProjectTitle = async (
  projectPid: string,
  newProjectTitle: string
) => {
  if (!newProjectTitle) return;
  await verifyProjectAccessByProjectPidOrThrow(projectPid);
  await prisma.project.update({
    where: { projectPid },
    data: { title: newProjectTitle },
  });
};

export const deleteProject = async ({}) => {};
