"use server";

import { z } from "zod";
import { getCurrentUser } from "@/lib/session";
import db from "@/lib/db";
import type { ActionResult } from "@/app/actions/tasks";

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores");

// Set the user's public handle during onboarding. Enforces format and
// uniqueness server-side. The client redirects to /dashboard on success.
export async function setUsername(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const parsed = usernameSchema.safeParse(formData.get("username"));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const username = parsed.data;

  const taken = await db.user.findUnique({ where: { username } });
  if (taken && taken.id !== user.id) {
    return { ok: false, error: "Username already taken" };
  }

  await db.user.update({ where: { id: user.id }, data: { username } });
  return { ok: true };
}
