"use server";

import { prisma } from "../prisma";
import { getUser } from "./helper";
import type { ProfilePageDataType } from "../types";

export const getAvatarUrl = async (): Promise<{ avatarUrl: string }> => {
  try {
    const user = await getUser();
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
    const user = await getUser();
    if (!user) return { success: false, message: "Access denied", data: null };
    const profilePageData = await prisma.user.findUnique({
      where: { id: user.id },
      include: { UserInformation: true },
    });
    return { success: true, message: "", data: profilePageData };
  } catch (error) {
    console.log("Get profile page user error: ", error);
    return { success: false, message: "Something went wrong", data: null };
  }
};
