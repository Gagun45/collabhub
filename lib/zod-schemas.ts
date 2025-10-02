import { z } from "zod";

export const editProfileSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 chars long")
    .max(36, "Username can be at most 36 chars long"),
  name: z.string().max(54, "Name can be at most 54 chars long"),
  location: z.string().max(54, "Location can be at most 54 chars long"),
  bio: z.string().max(250, "Bio can be at most 250 chars long"),
  birthDate: z
    .date()
    .nullable()
    .refine(
      (val) => {
        if (!val) return true;
        return val <= new Date();
      },
      { message: "Wrong date" }
    ),
});

export const newTeamSchema = z.object({
  name: z
    .string()
    .min(5, "Team name must be at least 5 chars long")
    .max(64, "Team name can be at most 64 chars long"),
});

export const newProjectSchema = z.object({
  title: z
    .string()
    .min(5, "Project title must be at least 5 chars long")
    .max(64, "Project title can be at most 64 chars long"),
});
