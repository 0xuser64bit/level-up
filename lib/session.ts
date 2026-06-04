import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export function getSession() {
  return getServerSession(authOptions);
}

// The full database user for the current session, or null if signed out.
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user?.id) return null;
  return db.user.findUnique({ where: { id: session.user.id } });
}

// Use in protected server components. Redirects to landing if signed out and to
// onboarding if the user hasn't picked a username yet.
export async function requireOnboardedUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (!user.username) redirect("/select-username");
  return user;
}
