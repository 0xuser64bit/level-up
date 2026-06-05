import { differenceInCalendarDays, format, startOfDay, subDays } from "date-fns";
import db from "@/lib/db";
import { applyPenalty, settledStreak } from "@/lib/leveling";
import { Prisma, type User } from "@/generated/prisma";

// The verdict the SYSTEM renders when a user returns after missing quests. Shown
// once on the dashboard, then acknowledged. Stored on User.pendingAssessment.
export interface Assessment {
  through: string; // yyyy-MM-dd of the last fully-elapsed day that was judged
  missedCount: number; // quests left incomplete across the settled window
  xpLost: number; // XP actually removed (after level-floor protection)
  streakBroken: boolean; // whether the streak chain was reset to 0
  prevStreak: number; // the streak that was lost (0 if there was none)
}

// Settle every day that has fully elapsed since the user was last judged:
//   - deduct the snapshotted penalty for each missed quest (never below the
//     current level's floor — rank is protected),
//   - reset the streak honestly if a day was completely missed,
//   - record a one-time Assessment when the System actually acted.
//
// Concurrency-safe: protected pages call this from both the layout and the page,
// which Next may render in parallel. A single atomic "claim the day" update
// (UPDATE ... WHERE lastSettledDate < today) lets exactly one caller win and
// apply penalties; the row lock serializes the rest, who then just re-read.
// Doubly idempotent: each penalized quest is also stamped `settledAt`, so even a
// bypassed watermark can never charge the same quest twice. Returns a fresh user.
export async function settleUser(user: User): Promise<User> {
  const now = new Date();
  const today = startOfDay(now);

  // Fast path: already judged today (avoids opening a transaction).
  if (
    user.lastSettledDate &&
    differenceInCalendarDays(today, startOfDay(user.lastSettledDate)) <= 0
  ) {
    return user;
  }

  return db.$transaction(async (tx) => {
    // Atomically claim today's settlement. If another request already did, this
    // affects zero rows and we simply return the now-settled user.
    const claim = await tx.user.updateMany({
      where: {
        id: user.id,
        OR: [{ lastSettledDate: null }, { lastSettledDate: { lt: today } }],
      },
      data: { lastSettledDate: today },
    });
    if (claim.count === 0) {
      return tx.user.findUniqueOrThrow({ where: { id: user.id } });
    }

    // Every still-open quest on a day that is now in the past, not yet settled.
    const missed = await tx.dailyTask.findMany({
      where: {
        userId: user.id,
        isCompleted: false,
        settledAt: null,
        date: { lt: today },
      },
      select: { id: true, penalty: true },
    });

    const penaltySum = missed.reduce((sum, t) => sum + t.penalty, 0);
    const { xp, level, xpLost } = applyPenalty(user.xp, user.level, penaltySum);
    const newStreak = settledStreak(user.currentStreak, user.lastActiveAt, now);
    const streakBroken = newStreak === 0 && user.currentStreak > 0;

    // Only confront the user when the System took something from them.
    const hadConsequence = missed.length > 0 || xpLost > 0 || streakBroken;
    const assessment: Assessment | null = hadConsequence
      ? {
          through: format(subDays(today, 1), "yyyy-MM-dd"),
          missedCount: missed.length,
          xpLost,
          streakBroken,
          prevStreak: user.currentStreak,
        }
      : null;

    if (missed.length > 0) {
      await tx.dailyTask.updateMany({
        where: { id: { in: missed.map((t) => t.id) } },
        data: { settledAt: now },
      });
    }

    return tx.user.update({
      where: { id: user.id },
      data: {
        xp,
        level,
        currentStreak: newStreak,
        // Overwrite a stale unacknowledged verdict only when there's a new one.
        ...(assessment
          ? {
              pendingAssessment: assessment as unknown as Prisma.InputJsonValue,
            }
          : {}),
      },
    });
  });
}
