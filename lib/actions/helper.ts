"use server";

import { auth } from "../auth";
import { prisma } from "../prisma";

export const getAuthUser = async () => {
  try {
    const session = await auth();
    if (!session || !session?.user?.email) return null;
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    return user;
  } catch (error) {
    console.log("Get user error: ", error);
    return null;
  }
};
