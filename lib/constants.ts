import type { $Enums } from "@prisma/client";

export const UNEXPECTED_ERROR = "Unexpected error";
export const SMTH_WENT_WRONG = "Something went wrong";

export const PROJECT_ROLE_HIERARCHY: Record<$Enums.ProjectRole, number> = {
  SUPERADMIN: 3,
  ADMIN: 2,
  USER: 1,
};
