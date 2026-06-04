"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { RecurrencePattern } from "@/generated/prisma";
import { getCurrentUser } from "@/lib/session";
import db from "@/lib/db";

export type ActionResult = { ok: true } | { ok: false; error: string };

const taskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100),
  description: z.string().trim().max(500).optional(),
  xpReward: z.coerce.number().int().min(1, "XP must be at least 1").max(1000),
  penalty: z.coerce.number().int().min(0).max(1000),
  recurring: z.coerce.boolean(),
  pattern: z.nativeEnum(RecurrencePattern),
  isSideQuest: z.coerce.boolean(),
});

function parseTaskForm(formData: FormData) {
  return taskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? undefined,
    xpReward: formData.get("xpReward"),
    penalty: formData.get("penalty"),
    recurring: formData.get("recurring"),
    pattern: formData.get("pattern"),
    isSideQuest: formData.get("isSideQuest"),
  });
}

export async function createTask(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const parsed = parseTaskForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const data = parsed.data;
  // A non-recurring task has no schedule.
  const pattern = data.recurring ? data.pattern : RecurrencePattern.NONE;

  await db.task.create({
    data: {
      userId: user.id,
      title: data.title,
      description: data.description || null,
      xpReward: data.xpReward,
      penalty: data.penalty,
      recurring: data.recurring,
      pattern,
      isSideQuest: data.isSideQuest,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateTask(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const taskId = formData.get("taskId");
  if (typeof taskId !== "string") return { ok: false, error: "Missing task" };

  const existing = await db.task.findUnique({ where: { id: taskId } });
  if (!existing || existing.userId !== user.id) {
    return { ok: false, error: "Task not found" };
  }

  const parsed = parseTaskForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const data = parsed.data;
  const pattern = data.recurring ? data.pattern : RecurrencePattern.NONE;

  await db.task.update({
    where: { id: taskId },
    data: {
      title: data.title,
      description: data.description || null,
      xpReward: data.xpReward,
      penalty: data.penalty,
      recurring: data.recurring,
      pattern,
      isSideQuest: data.isSideQuest,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteTask(taskId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const existing = await db.task.findUnique({ where: { id: taskId } });
  if (!existing || existing.userId !== user.id) {
    return { ok: false, error: "Task not found" };
  }

  await db.task.delete({ where: { id: taskId } });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { ok: true };
}
