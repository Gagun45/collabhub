"use server";

import { prisma } from "../prisma";
import { getAuthUser } from "./helper";
import type {
  editProfileSchemaType,
  ProfilePageDataType,
  SuccessAndMessageType,
} from "../types";
import { Prisma } from "@prisma/client";
import { SMTH_WENT_WRONG } from "../constants";

export const getAvatarUrl = async (): Promise<
  SuccessAndMessageType & { avatarUrl: string }
> => {
  try {
    const user = await getAuthUser();
    if (!user)
      return { success: false, message: "Authorized only", avatarUrl: "" };
    const userBio = await prisma.userInformation.findUnique({
      where: { userId: user.id },
    });
    return {
      success: true,
      message: "Avatar url fetched",
      avatarUrl: userBio?.avatarUrl ?? user.image ?? "",
    };
  } catch (error) {
    console.log("Get avatar url error", error);
    return { success: false, message: SMTH_WENT_WRONG, avatarUrl: "" };
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
    return {
      success: true,
      message: "Profile data fetched",
      data: profilePageData,
    };
  } catch (error) {
    console.log("Get profile page data error: ", error);
    return { success: false, message: SMTH_WENT_WRONG, data: null };
  }
};

export const updateProfilePageData = async (
  values: editProfileSchemaType
): Promise<SuccessAndMessageType> => {
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
    return { success: true, message: "Profile updated" };
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return { success: false, message: "Username already taken" };
    }
    return { success: false, message: SMTH_WENT_WRONG };
  }
};
