"use server";

import type { Project } from "@prisma/client";
import { SMTH_WENT_WRONG } from "../constants";
import type {
  newProjectSchemaType,
  ProjectType,
  SuccessAndMessageType,
} from "../types";
import { getAuthUser } from "./helper";
import { prisma } from "../prisma";
import { nanoid } from "nanoid";

export const createNewProject = async (
  teamPid: string,
  values: newProjectSchemaType
): Promise<SuccessAndMessageType> => {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, message: "Authorized only" };
    const team = await prisma.team.findUnique({ where: { teamPid } });
    if (!team) return { success: false, message: "Team not found" };
    const { title } = values;
    await prisma.project.create({
      data: {
        title,
        createdById: user.id,
        teamId: team.id,
        projectPid: nanoid(6),
      },
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
    const user = await getAuthUser();
    if (!user)
      return { success: false, message: "Authorized only", projects: [] };
    const projects = await prisma.project.findMany({
      where: { team: { teamPid } },
    });
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
