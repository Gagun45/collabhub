"use server";

import type { $Enums, Project } from "@prisma/client";
import { PROJECT_ROLE_HIERARCHY, SMTH_WENT_WRONG } from "../constants";
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
import { isAtLeastProjectAdmin, isAtLeastTeamAdmin } from "../utils";

export const createNewProject = async (
  teamPid: string,
  values: newProjectSchemaType
): Promise<SuccessAndMessageType> => {
  try {
    const { user, role } = await verifyTeamAccessByTeamPidOrThrow(teamPid);
    const { title } = values;
    if (!isAtLeastTeamAdmin(role)) throw new Error("Forbidden");
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
        data: { projectId: project.id, userId: user.id, role: "SUPERADMIN" },
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
    const { user } = await verifyTeamAccessByTeamPidOrThrow(teamPid);

    let projects: Project[] = [];

    projects = await prisma.project.findMany({
      where: {
        team: { teamPid },
        ProjectMember: { some: { userId: user.id } },
      },
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
    role: $Enums.ProjectRole | null;
  }
> => {
  try {
    const { role } = await verifyProjectAccessByProjectPidOrThrow(projectPid);
    const project = await prisma.project.findUnique({
      where: { projectPid },
      include: {
        ProjectMember: {
          include: { user: { include: { UserInformation: true } } },
        },
      },
    });
    if (!project)
      return {
        success: false,
        message: "Project not found",
        project: null,
        role: null,
      };
    return { success: true, message: "Project fetched", project, role };
  } catch (error) {
    console.log("Get project by project pid error: ", error);
    return {
      success: false,
      message: SMTH_WENT_WRONG,
      project: null,
      role: null,
    };
  }
};

export const editProjectTitle = async (
  projectPid: string,
  newProjectTitle: string
) => {
  if (!newProjectTitle) return;
  const { role } = await verifyProjectAccessByProjectPidOrThrow(projectPid);
  if (!isAtLeastProjectAdmin(role)) return;
  await prisma.project.update({
    where: { projectPid },
    data: { title: newProjectTitle },
  });
};

export const deleteProject = async (
  projectPid: string
): Promise<SuccessAndMessageType> => {
  const { role } = await verifyProjectAccessByProjectPidOrThrow(projectPid);
  if (!isAtLeastProjectAdmin(role)) throw new Error("Forbidden");
  await prisma.project.delete({ where: { projectPid } });
  return { message: "Project deleted", success: true };
};

export const getTeamMembersToInvite = async (projectPid: string) => {
  const { project } = await verifyProjectAccessByProjectPidOrThrow(projectPid);
  const teamPid = project.teamPid;
  const team = await prisma.team.findUnique({
    where: { teamPid },
    include: {
      TeamMembers: {
        include: { user: { include: { UserInformation: true } } },
      },
    },
  });
  const projectMembers = await prisma.projectMember.findMany({
    where: { project: { projectPid } },
  });
  if (!team) throw new Error("Team not found");
  const availableMembers = team.TeamMembers.filter(
    (tm) => !projectMembers.some((pm) => pm.userId === tm.userId)
  );
  return availableMembers;
};

export const addMemberToProjectByProjectPid = async (
  projectPid: string,
  userId: number
) => {
  const { role, project } = await verifyProjectAccessByProjectPidOrThrow(
    projectPid
  );
  if (!isAtLeastProjectAdmin(role)) throw new Error("Forbidden");
  await prisma.projectMember.create({
    data: { projectId: project.id, userId },
  });
};

export const deleteMemberFromProject = async (
  projectPid: string,
  userId: number
) => {
  const { role, project } = await verifyProjectAccessByProjectPidOrThrow(
    projectPid
  );
  if (!isAtLeastProjectAdmin(role)) throw new Error("Forbidden");
  await prisma.$transaction(async (tx) => {
    const member = await tx.projectMember.findUniqueOrThrow({
      where: { projectId_userId: { projectId: project.id, userId } },
    });
    if (member.role === "SUPERADMIN") throw new Error("Denied");
    if (PROJECT_ROLE_HIERARCHY[role] < PROJECT_ROLE_HIERARCHY[member.role])
      throw new Error("Denied");
    await tx.projectMember.delete({
      where: {
        projectId_userId: { projectId: project.id, userId },
      },
    });
  });
};
