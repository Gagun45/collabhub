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

export const authOnly = async () => {
  const user = await getAuthUser();
  if (!user || !user.id) throw new Error("Authorized only");
  return user;
};

export const verifyProjectAccessByProjectPid = async (projectPid: string) => {
  const user = await getAuthUser();
  if (!user || !user.id) throw new Error("Unauthorized");
  const project = await prisma.project.findUnique({
    where: { projectPid },
    include: { team: { include: { TeamMembers: true } } },
  });
  if (!project) throw new Error("Project not found");
  const isMember = project.team.TeamMembers.some((tm) => tm.userId === user.id);
  if (!isMember) throw new Error("Forbidden");
  return { user, project };
};

export const verifyTeamAccessByTeamPid = async (teamPid: string) => {
  const user = await getAuthUser();
  if (!user || !user.id) throw new Error("Unauthorized");
  const team = await prisma.team.findUnique({
    where: { teamPid },
    include: { TeamMembers: true },
  });
  if (!team) throw new Error("Team not found");
  const isMember = team.TeamMembers.some((tm) => tm.userId === user.id);
  if (!isMember) throw new Error("Forbidden");
  return { user, team };
};
