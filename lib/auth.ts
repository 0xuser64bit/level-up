import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import db from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "NEXTAUTH_SECRET",
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await db.user.findUnique({
          where: {
            email: user.email as string,
          },
        });
        if (!existingUser) {
          await db.user.create({
            data: {
              username: user.name as string,
              email: user.email as string,
            },
          });
          return true;
        }
      }
      return false;
    },
  },
});
