"use server";

import { revalidatePath } from "next/cache";
import { applyXpDelta, updateStreakOnActivity } from "@/lib/leveling";
import { getCurrentUser } from "@/lib/session";
import db from "@/lib/db";
import type { ActionResult } from "@/app/actions/tasks";

// Toggle a daily task's completion. Awards XP on completion and reverts it on
// un-completion so the XP total always reflects what's actually checked off.
// Streaks advance on completion only. All XP math is server-side.
export async function toggleDailyTask(
  dailyTaskId: string,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const dt = await db.dailyTask.findUnique({ where: { id: dailyTaskId } });
  if (!dt || dt.userId !== user.id) return { ok: false, error: "Not found" };

  const completing = !dt.isCompleted;
  const { xp, level } = applyXpDelta(
    user.xp,
    completing ? dt.xpReward : -dt.xpReward,
  );

  const userData: {
    xp: number;
    level: number;
    currentStreak?: number;
    longestStreak?: number;
    lastActiveAt?: Date | null;
  } = { xp, level };

  if (completing) {
    const streak = updateStreakOnActivity(
      {
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        lastActiveAt: user.lastActiveAt,
      },
      new Date(),
    );
    userData.currentStreak = streak.currentStreak;
    userData.longestStreak = streak.longestStreak;
    userData.lastActiveAt = streak.lastActiveAt;
  }

  await db.$transaction([
    db.dailyTask.update({
      where: { id: dt.id },
      data: {
        isCompleted: completing,
        completedAt: completing ? new Date() : null,
      },
    }),
    db.user.update({ where: { id: user.id }, data: userData }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  return { ok: true };
}

// Complete the daily mission for its bonus XP. Server-guarded: requires every
// one of the day's tasks to be done and refuses double-claims.
export async function completeMission(missionId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const mission = await db.mission.findUnique({ where: { id: missionId } });
  if (!mission || mission.userId !== user.id) {
    return { ok: false, error: "Not found" };
  }
  if (mission.isCompleted) {
    return { ok: false, error: "Mission already completed" };
  }

  const [total, remaining] = await Promise.all([
    db.dailyTask.count({ where: { userId: user.id, date: mission.date } }),
    db.dailyTask.count({
      where: { userId: user.id, date: mission.date, isCompleted: false },
    }),
  ]);
  if (total === 0 || remaining > 0) {
    return { ok: false, error: "Complete all tasks first" };
  }

  const { xp, level } = applyXpDelta(user.xp, mission.xpReward);
  await db.$transaction([
    db.mission.update({
      where: { id: mission.id },
      data: { isCompleted: true, completedAt: new Date() },
    }),
    db.user.update({ where: { id: user.id }, data: { xp, level } }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  return { ok: true };
}
