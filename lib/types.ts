import type z from "zod";
import type {
  editProfileSchema,
  newProjectSchema,
  newTeamSchema,
} from "./zod-schemas";
import type { Column, Prisma, Task } from "@prisma/client";

export type editProfileSchemaType = z.infer<typeof editProfileSchema>;
export type newTeamSchemaType = z.infer<typeof newTeamSchema>;
export type newProjectSchemaType = z.infer<typeof newProjectSchema>;

export type ProfilePageDataType = SuccessAndMessageType & {
  data: Prisma.UserGetPayload<{ include: { UserInformation: true } }> | null;
};

export type TeamType = Prisma.TeamGetPayload<{
  include: {
    TeamMembers: { include: { user: { include: { UserInformation: true } } } };
  };
}>;

export type ProjectType = Prisma.ProjectGetPayload<{
  include: {
    ProjectMember: {
      include: { user: { include: { UserInformation: true } } };
    };
  };
}>;

export type BoardType = {
  columns: Column[];
  tasks: Task[];
};

export type ProjectMembersToInvite = Prisma.TeamMemberGetPayload<{
  include: { user: { include: { UserInformation: true } } };
}>;

export type ColumnType = Prisma.ColumnGetPayload<{
  include: { Task: true };
}>;

export type SuccessAndMessageType = {
  success: boolean;
  message: string;
};
