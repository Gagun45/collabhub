import type z from "zod";
import type { editProfileSchema } from "./zod-schemas";
import type { Prisma } from "@prisma/client";

export type editProfileSchemaType = z.infer<typeof editProfileSchema>;

export type ProfilePageDataType = {
  success: boolean;
  message: string;
  data: Prisma.UserGetPayload<{ include: { UserInformation: true } }> | null;
};
