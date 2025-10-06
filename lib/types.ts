import type z from "zod";
import type {
  editProfileSchema,
  newProjectSchema,
  newTeamSchema,
} from "./zod-schemas";
import type { Prisma } from "@prisma/client";

export type editProfileSchemaType = z.infer<typeof editProfileSchema>;
export type newTeamSchemaType = z.infer<typeof newTeamSchema>;
export type newProjectSchemaType = z.infer<typeof newProjectSchema>;

export type ProfilePageDataType = SuccessAndMessageType & {
  data: Prisma.UserGetPayload<{ include: { UserInformation: true } }> | null;
};

export type ProjectType = Prisma.ProjectGetPayload<{
  include: { Column: { include: { Task: true }, } };
}>;

export type ColumnType = Prisma.ColumnGetPayload<{
  include: { Task: true };
}>;

export type SuccessAndMessageType = {
  success: boolean;
  message: string;
};
