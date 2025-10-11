import type { $Enums } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PROJECT_ROLE_HIERARCHY, TEAM_ROLE_HIERARCHY } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isAtLeastProjectAdmin = (role: $Enums.ProjectRole) => {
  return PROJECT_ROLE_HIERARCHY[role] >= PROJECT_ROLE_HIERARCHY.ADMIN;
};

export const isAtLeastTeamAdmin = (role: $Enums.TeamRole) => {
  return TEAM_ROLE_HIERARCHY[role] >= TEAM_ROLE_HIERARCHY.ADMIN;
};

export const isBiggerProjectRole = (
  first_role: $Enums.ProjectRole,
  second_role: $Enums.ProjectRole
) => {
  return (
    PROJECT_ROLE_HIERARCHY[first_role] > PROJECT_ROLE_HIERARCHY[second_role]
  );
};
