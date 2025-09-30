"use server";

import { prisma } from "../prisma";
import { getUser } from "./helper";

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

export const getProfilePageUser = async () => {
  try {
    const user = await getUser();
    if (!user) return null;
    const profilePageData = await prisma.user.findUnique({
      where: { id: user.id },
      include: { UserInformation: true },
    });
    return profilePageData;
  } catch (error) {
    console.log("Get profile page user error: ", error);
    return null;
  }
};
