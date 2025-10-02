"use server";

import { nanoid } from "nanoid";
import { prisma } from "../prisma";
import type { newTeamSchemaType, SuccessAndMessageType } from "../types";
import { getAuthUser } from "./helper";
import type { Team } from "@prisma/client";

export const createNewTeam = async (
  values: newTeamSchemaType
): Promise<SuccessAndMessageType & { team: Team | null }> => {
  try {
    const user = await getAuthUser();
    const { name } = values;
    if (!user)
      return { success: false, message: "Authorized only", team: null };
    const result = await prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: { name, teamPid: nanoid(5), creatorId: user.id },
      });
      await tx.teamMember.create({
        data: { teamId: team.id, userId: user.id },
      });
      return { success: true, message: "Team created", team };
    });
    return result;
  } catch (error) {
    console.log("Create new team error: ", error);
    return { success: false, message: "Something went wrong", team: null };
  }
};
