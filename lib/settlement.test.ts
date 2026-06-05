import { afterAll, beforeEach, describe, expect, it } from "bun:test";
import { startOfDay, subDays } from "date-fns";
import { PrismaClient } from "@/generated/prisma";
import { settleUser } from "@/lib/settlement";
import type { Assessment } from "@/lib/settlement";

// Integration tests for the consequence engine. These hit the dev database, so
// they run inside a unique throwaway user and clean up after themselves.
const db = new PrismaClient();
const EMAIL = "settlement-test@level-up.dev";

async function freshUser(overrides: Record<string, unknown> = {}) {
  await db.user.deleteMany({ where: { email: EMAIL } });
  return db.user.create({
    data: {
      email: EMAIL,
      username: null,
      xp: 275, // level 3 (floor 200)
      level: 3,
      currentStreak: 5,
      longestStreak: 9,
      lastActiveAt: subDays(startOfDay(new Date()), 3), // active 3 days ago
      ...overrides,
    },
  });
}

async function missedTaskYesterday(userId: string, penalty: number) {
  return db.dailyTask.create({
    data: {
      userId,
      title: "Missed quest",
      xpReward: 20,
      penalty,
      date: subDays(startOfDay(new Date()), 1),
      isCompleted: false,
    },
  });
}

describe("settleUser", () => {
  beforeEach(async () => {
    await db.user.deleteMany({ where: { email: EMAIL } });
  });

  it("deducts penalties for missed past quests and seals them", async () => {
    const user = await freshUser();
    const dt = await missedTaskYesterday(user.id, 30);

    const settled = await settleUser(user);

    expect(settled.xp).toBe(245); // 275 - 30
    expect(settled.level).toBe(3); // unchanged
    const sealed = await db.dailyTask.findUniqueOrThrow({ where: { id: dt.id } });
    expect(sealed.settledAt).not.toBeNull();
  });

  it("never drops XP below the current level's floor", async () => {
    const user = await freshUser({ xp: 210 }); // level 3, floor 200
    await missedTaskYesterday(user.id, 999);

    const settled = await settleUser(user);

    expect(settled.xp).toBe(200);
    expect(settled.level).toBe(3); // rank protected
  });

  it("breaks the streak when a day was fully missed", async () => {
    const user = await freshUser(); // lastActiveAt = 3 days ago
    await missedTaskYesterday(user.id, 10);

    const settled = await settleUser(user);

    expect(settled.currentStreak).toBe(0);
    const a = settled.pendingAssessment as unknown as Assessment;
    expect(a.streakBroken).toBe(true);
    expect(a.prevStreak).toBe(5);
    expect(a.missedCount).toBe(1);
  });

  it("is idempotent — a second run charges nothing more", async () => {
    const user = await freshUser();
    await missedTaskYesterday(user.id, 30);

    const once = await settleUser(user);
    // Re-fetch and force another settlement attempt (bypass the same-day guard
    // by clearing the watermark) to prove row-level sealing protects us.
    await db.user.update({
      where: { id: user.id },
      data: { lastSettledDate: null },
    });
    const reloaded = await db.user.findUniqueOrThrow({ where: { id: user.id } });
    const twice = await settleUser(reloaded);

    expect(twice.xp).toBe(once.xp); // no double charge
  });

  it("charges only once under concurrent settlement (parallel renders)", async () => {
    const user = await freshUser();
    await missedTaskYesterday(user.id, 30);

    // Same pre-settlement snapshot handed to two parallel callers, mimicking a
    // layout + page rendering at once.
    const [a, b] = await Promise.all([settleUser(user), settleUser(user)]);

    const fresh = await db.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(fresh.xp).toBe(245); // 275 - 30, NOT 275 - 60
    expect([a.xp, b.xp]).toContain(245);
  });

  it("does nothing and records no verdict for a clean slate", async () => {
    const user = await freshUser({ lastActiveAt: startOfDay(new Date()) });
    const settled = await settleUser(user);

    expect(settled.xp).toBe(275);
    expect(settled.currentStreak).toBe(5);
    expect(settled.pendingAssessment).toBeNull();
  });
});

afterAll(async () => {
  await db.user.deleteMany({ where: { email: EMAIL } });
  await db.$disconnect();
});
