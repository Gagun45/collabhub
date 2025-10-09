"use server";

import { auth } from "../auth";
import { prisma } from "../prisma";

export const getAuthUser = async () => {
  try {
    const session = await auth();
    if (!session || !session?.user?.email) return null;
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    return user;
  } catch (error) {
    console.log("Get user error: ", error);
    return null;
  }
};

export const getAuthUserOrThrow = async () => {
  const user = await getAuthUser();
  if (!user || !user.id) throw new Error("Authorized only");
  return user;
};

export const verifyProjectAccessByProjectPidOrThrow = async (
  projectPid: string
) => {
  const user = await getAuthUserOrThrow();
  const project = await prisma.project.findUnique({
    where: { projectPid },
    include: { ProjectMember: true },
  });
  if (!project) throw new Error("Project not found");
  const member = project.ProjectMember.find((tm) => tm.userId === user.id);
  if (!member) throw new Error("Forbidden");
  const role = member.role;
  return { user, project, role };
};

export const verifyTeamAccessByTeamPidOrThrow = async (teamPid: string) => {
  const user = await getAuthUser();
  if (!user || !user.id) throw new Error("Unauthorized");
  const team = await prisma.team.findUnique({
    where: { teamPid },
    include: { TeamMembers: true },
  });
  if (!team) throw new Error("Team not found");
  const member = team.TeamMembers.find((tm) => tm.userId === user.id);
  if (!member) throw new Error("Forbidden");
  const role = member.role;
  return { user, team, role };
};
