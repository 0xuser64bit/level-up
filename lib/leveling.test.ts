import { describe, expect, it } from "bun:test";
import {
  applyXpDelta,
  computeAchievements,
  levelFromXp,
  levelProgressPct,
  rankFromLevel,
  updateStreakOnActivity,
  xpToNextLevel,
} from "./leveling";

describe("levelFromXp", () => {
  it("starts at level 1", () => {
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(99)).toBe(1);
  });
  it("crosses level boundaries at multiples of 100", () => {
    expect(levelFromXp(100)).toBe(2);
    expect(levelFromXp(275)).toBe(3);
  });
  it("never goes below level 1 for negative xp", () => {
    expect(levelFromXp(-50)).toBe(1);
  });
});

describe("xpToNextLevel / progress", () => {
  it("matches the dashboard math (275 xp -> 25 to next, 75%)", () => {
    expect(xpToNextLevel(275)).toBe(25);
    expect(levelProgressPct(275)).toBe(75);
  });
});

describe("rankFromLevel", () => {
  it("maps the E..S ladder", () => {
    expect(rankFromLevel(1)).toBe("E");
    expect(rankFromLevel(5)).toBe("D");
    expect(rankFromLevel(10)).toBe("C");
    expect(rankFromLevel(20)).toBe("B");
    expect(rankFromLevel(35)).toBe("A");
    expect(rankFromLevel(50)).toBe("S");
  });
});

describe("applyXpDelta", () => {
  it("adds xp and recomputes level", () => {
    expect(applyXpDelta(90, 20)).toEqual({ xp: 110, level: 2 });
  });
  it("floors at zero on penalty", () => {
    expect(applyXpDelta(10, -50)).toEqual({ xp: 0, level: 1 });
  });
});

describe("updateStreakOnActivity", () => {
  const base = { currentStreak: 4, longestStreak: 7, lastActiveAt: null };

  it("starts a streak on first activity", () => {
    const r = updateStreakOnActivity(base, new Date("2026-06-05T10:00:00"));
    expect(r.currentStreak).toBe(1);
    expect(r.longestStreak).toBe(7);
  });

  it("does not double-count the same day", () => {
    const state = {
      ...base,
      lastActiveAt: new Date("2026-06-05T08:00:00"),
    };
    const r = updateStreakOnActivity(state, new Date("2026-06-05T20:00:00"));
    expect(r.currentStreak).toBe(4);
  });

  it("increments on a consecutive day and tracks the record", () => {
    const state = {
      currentStreak: 7,
      longestStreak: 7,
      lastActiveAt: new Date("2026-06-04T08:00:00"),
    };
    const r = updateStreakOnActivity(state, new Date("2026-06-05T09:00:00"));
    expect(r.currentStreak).toBe(8);
    expect(r.longestStreak).toBe(8);
  });

  it("resets after a missed day", () => {
    const state = {
      currentStreak: 9,
      longestStreak: 12,
      lastActiveAt: new Date("2026-06-02T08:00:00"),
    };
    const r = updateStreakOnActivity(state, new Date("2026-06-05T09:00:00"));
    expect(r.currentStreak).toBe(1);
    expect(r.longestStreak).toBe(12);
  });
});

describe("computeAchievements", () => {
  it("unlocks based on stats", () => {
    const a = computeAchievements({
      level: 3,
      longestStreak: 5,
      completedCount: 12,
    });
    const by = Object.fromEntries(a.map((x) => [x.key, x.unlocked]));
    expect(by.early_adopter).toBe(true);
    expect(by.task_master).toBe(true); // 12 >= 10
    expect(by.streak_starter).toBe(true); // 5 >= 3
    expect(by.consistency_king).toBe(false); // 5 < 7
    expect(by.level_10).toBe(false); // 3 < 10
    expect(by.task_centurion).toBe(false);
  });
});
