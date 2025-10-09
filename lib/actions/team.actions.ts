"use server";

import { nanoid } from "nanoid";
import { prisma } from "../prisma";
import type {
  newTeamSchemaType,
  SuccessAndMessageType,
  TeamType,
} from "../types";
import {
  getAuthUser,
  getAuthUserOrThrow,
  verifyTeamAccessByTeamPidOrThrow,
} from "./helper";
import type { $Enums, Team } from "@prisma/client";
import { SMTH_WENT_WRONG } from "../constants";

export const createNewTeam = async (
  values: newTeamSchemaType
): Promise<SuccessAndMessageType> => {
  try {
    const user = await getAuthUser();
    if (!user || !user.id)
      return { success: false, message: "Authorized only" };
    const { name } = values;
    const result = await prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: { name, teamPid: nanoid(5), creatorId: user.id },
      });
      await tx.teamMember.create({
        data: { teamId: team.id, userId: user.id, role: "ADMIN" },
      });
      return { success: true, message: "Team created" };
    });
    return result;
  } catch (error) {
    console.log("Create new team error: ", error);
    return { success: false, message: SMTH_WENT_WRONG };
  }
};

export const getMyTeams = async (): Promise<
  SuccessAndMessageType & { teams: Team[] }
> => {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, message: "Authorized only", teams: [] };
    const teams = await prisma.team.findMany({
      where: { TeamMembers: { some: { userId: user.id } } },
    });
    return { success: true, message: "My teams fetched", teams };
  } catch (error) {
    console.log("Get my teams error: ", error);
    return { success: false, message: SMTH_WENT_WRONG, teams: [] };
  }
};

export const getTeamByTeamPid = async (
  teamPid: string
): Promise<
  SuccessAndMessageType & {
    team: TeamType | null;
    role: $Enums.TeamRole | null;
  }
> => {
  try {
    const { role } = await verifyTeamAccessByTeamPidOrThrow(teamPid);
    const team = await prisma.team.findUnique({
      where: { teamPid },
      include: {
        TeamMembers: {
          include: { user: { include: { UserInformation: true } } },
        },
      },
    });
    if (!team)
      return {
        success: false,
        message: "Team not found",
        team: null,
        role: null,
      };
    return { success: true, message: "Team fetched", team, role };
  } catch (error) {
    console.log("Get team by team pid: ", error);
    return { success: false, message: SMTH_WENT_WRONG, team: null, role: null };
  }
};

export const getTeamByInviteToken = async (inviteToken: string) => {
  const user = await getAuthUserOrThrow();
  if (!inviteToken) return null;
  const team = await prisma.team.findUnique({
    where: { inviteToken },
    include: {
      creator: { include: { UserInformation: true } },
      TeamMembers: true,
    },
  });
  if (!team) return null;
  const isMember = team.TeamMembers.some((tm) => tm.userId === user.id);
  return { team, isMember };
};

export const joinTeamByInviteToken = async (inviteToken: string) => {
  const user = await getAuthUserOrThrow();
  const teamPid = await prisma.$transaction(async (tx) => {
    const team = await tx.team.findUnique({
      where: { inviteToken },
      include: { TeamMembers: true },
    });
    if (!team) throw new Error("Invalid token");
    const isMember = team.TeamMembers.some((tm) => tm.userId === user.id);
    if (isMember) throw new Error("Already a member");
    await tx.teamMember.create({ data: { userId: user.id, teamId: team.id } });
    return team.teamPid;
  });
  return teamPid;
};
