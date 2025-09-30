import type z from "zod";
import type { editProfileSchema } from "./zod-schemas";

export type editProfileSchemaType = z.infer<typeof editProfileSchema>