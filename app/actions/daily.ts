"use server";

import { revalidatePath } from "next/cache";
import { startOfDay } from "date-fns";
import { z } from "zod";
import { Prisma } from "@/generated/prisma";
import {
  applyXpDelta,
  computeAchievements,
  rankFromLevel,
  updateStreakOnActivity,
  type Rank,
} from "@/lib/leveling";
import { getCurrentUser } from "@/lib/session";
import db from "@/lib/db";
import type { ActionResult } from "@/app/actions/tasks";

// Rich outcome returned to the client so it can play the right celebration:
// the new totals, whether a level/rank threshold was crossed, and any
// achievements unlocked by this action.
export type XpResult =
  | { ok: false; error: string }
  | {
      ok: true;
      completed: boolean;
      xpDelta: number;
      xp: number;
      level: number;
      leveledUp: boolean;
      rankUp: Rank | null;
      unlocked: string[];
    };

// Toggle a daily task's completion. Awards XP on completion and reverts it on
// un-completion so the XP total always reflects what's actually checked off.
// Streaks advance on completion only. All XP math is server-side.
export async function toggleDailyTask(dailyTaskId: string): Promise<XpResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const dt = await db.dailyTask.findUnique({ where: { id: dailyTaskId } });
  if (!dt || dt.userId !== user.id) return { ok: false, error: "Not found" };

  // History is immutable: once a day has been judged by the SYSTEM, its quests
  // can't be retroactively checked off to dodge penalties or farm XP.
  if (user.lastSettledDate && dt.date < user.lastSettledDate) {
    return { ok: false, error: "This quest belongs to a sealed day." };
  }

  const completing = !dt.isCompleted;
  const xpDelta = completing ? dt.xpReward : -dt.xpReward;
  const { xp, level } = applyXpDelta(user.xp, xpDelta);

  const userData: {
    xp: number;
    level: number;
    currentStreak?: number;
    longestStreak?: number;
    lastActiveAt?: Date | null;
  } = { xp, level };

  let newLongestStreak = user.longestStreak;
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
    newLongestStreak = streak.longestStreak;
  }

  // Count completed-before so we can detect newly-unlocked achievements.
  const completedBefore = await db.dailyTask.count({
    where: { userId: user.id, isCompleted: true },
  });

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

  const unlocked = completing
    ? newlyUnlocked(
        { level: user.level, longestStreak: user.longestStreak, completedCount: completedBefore },
        { level, longestStreak: newLongestStreak, completedCount: completedBefore + 1 },
      )
    : [];

  return {
    ok: true,
    completed: completing,
    xpDelta,
    xp,
    level,
    leveledUp: completing && level > user.level,
    rankUp:
      completing && rankFromLevel(level) !== rankFromLevel(user.level)
        ? rankFromLevel(level)
        : null,
    unlocked,
  };
}

// Titles of achievements that flip from locked → unlocked between two states.
function newlyUnlocked(
  before: { level: number; longestStreak: number; completedCount: number },
  after: { level: number; longestStreak: number; completedCount: number },
): string[] {
  const was = new Map(
    computeAchievements(before).map((a) => [a.key, a.unlocked]),
  );
  return computeAchievements(after)
    .filter((a) => a.unlocked && !was.get(a.key))
    .map((a) => a.title);
}

// Complete the daily mission for its bonus XP. Server-guarded: requires every
// one of the day's tasks to be done and refuses double-claims.
export async function completeMission(missionId: string): Promise<XpResult> {
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

  return {
    ok: true,
    completed: true,
    xpDelta: mission.xpReward,
    xp,
    level,
    leveledUp: level > user.level,
    rankUp:
      rankFromLevel(level) !== rankFromLevel(user.level)
        ? rankFromLevel(level)
        : null,
    unlocked: [],
  };
}

const sideQuestSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100),
  xpReward: z.coerce.number().int().min(1).max(1000),
});

// Drop an ad-hoc side quest onto today's board with no template behind it.
// One-off and immediate — it never recurs and carries no penalty.
export async function addSideQuest(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const parsed = sideQuestSchema.safeParse({
    title: formData.get("title"),
    xpReward: formData.get("xpReward") || 15,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  await db.dailyTask.create({
    data: {
      userId: user.id,
      title: parsed.data.title,
      xpReward: parsed.data.xpReward,
      penalty: 0,
      isSideQuest: true,
      date: startOfDay(new Date()),
    },
  });

  revalidatePath("/dashboard");
  return { ok: true };
}

// Dismiss the SYSTEM's daily verdict after the user has read it.
export async function acknowledgeAssessment(): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  await db.user.update({
    where: { id: user.id },
    data: { pendingAssessment: Prisma.DbNull },
  });

  revalidatePath("/dashboard");
  return { ok: true };
}
