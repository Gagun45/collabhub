import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import authConfig from "./auth.config";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  events: {
    async createUser({ user }) {
      if (user.id && user.email) {
        const username = user.email.split("@")[0];
        await prisma.userInformation.create({
          data: {
            userId: user.id,
            username,
            name: user.name ?? "",
            avatarUrl: user.image ?? "",
          },
        });
      }
    },
  },
});
