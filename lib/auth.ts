import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import db from "@/lib/db";

if (!process.env.NEXTAUTH_SECRET) {
  // Fail loud instead of silently signing sessions with a guessable key.
  throw new Error("NEXTAUTH_SECRET is not set");
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    // Provision the user row on first sign-in. Returning users just pass through
    // (the old code rejected them here — that was the login-breaking bug).
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return false;
      await db.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          name: user.name,
          image: user.image,
          // username stays null until the user picks one in onboarding.
        },
      });
      return true;
    },

    // Carry our database id + username on the token. Best-effort re-fetch while
    // the username is still unset so it self-heals after onboarding.
    async jwt({ token }) {
      if (token.email && (!token.uid || !token.username)) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
          select: { id: true, username: true },
        });
        if (dbUser) {
          token.uid = dbUser.id;
          token.username = dbUser.username ?? null;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.username = (token.username as string | null) ?? null;
      }
      return session;
    },
  },
};
