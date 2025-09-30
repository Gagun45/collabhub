"use server";

import { prisma } from "../prisma";
import { getAuthUser } from "./helper";
import type { editProfileSchemaType, ProfilePageDataType } from "../types";

export const getAvatarUrl = async (): Promise<{ avatarUrl: string }> => {
  try {
    const user = await getAuthUser();
    if (!user) return { avatarUrl: "" };
    const userBio = await prisma.userInformation.findUnique({
      where: { userId: user.id },
    });
    return { avatarUrl: userBio?.avatarUrl ?? user.image ?? "" };
  } catch (error) {
    console.log("Get avatar url error", error);
    return { avatarUrl: "" };
  }
};

export const getProfilePageData = async (): Promise<ProfilePageDataType> => {
  try {
    const user = await getAuthUser();
    if (!user)
      return { success: false, message: "Authorized only", data: null };
    const profilePageData = await prisma.user.findUnique({
      where: { id: user.id },
      include: { UserInformation: true },
    });
    return { success: true, message: "", data: profilePageData };
  } catch (error) {
    console.log("Get profile page data error: ", error);
    return { success: false, message: "Something went wrong", data: null };
  }
};

export const updateProfilePageData = async (values: editProfileSchemaType) => {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, message: "Authorized only" };
    const { bio, birthDate, location, name, username } = values;
    await prisma.userInformation.update({
      where: { userId: user.id },
      data: {
        bio,
        location,
        name,
        username,
        birthDate,
      },
    });
    return { success: true, message: "" };
  } catch (error) {
    console.log("Update profile page data error: ", error);
    return { success: false, message: "Something went wrong" };
  }
};
