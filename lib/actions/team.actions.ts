"use server";

import { nanoid } from "nanoid";
import { prisma } from "../prisma";
import type { newTeamSchemaType, SuccessAndMessageType } from "../types";
import { getAuthUser } from "./helper";
import type { Team } from "@prisma/client";
import { SMTH_WENT_WRONG } from "../constants";

export const createNewTeam = async (
  values: newTeamSchemaType
): Promise<SuccessAndMessageType> => {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, message: "Authorized only" };
    const { name } = values;
    const result = await prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: { name, teamPid: nanoid(5), creatorId: user.id },
      });
      await tx.teamMember.create({
        data: { teamId: team.id, userId: user.id },
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
): Promise<SuccessAndMessageType & { team: Team | null }> => {
  try {
    const team = await prisma.team.findUnique({ where: { teamPid } });
    if (!team) return { success: false, message: "Team not found", team: null };
    return { success: true, message: "Team fetched", team };
  } catch (error) {
    console.log("Get team by team pid: ", error);
    return { success: false, message: SMTH_WENT_WRONG, team: null };
  }
};
