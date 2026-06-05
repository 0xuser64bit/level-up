import { differenceInCalendarDays, startOfDay } from "date-fns";

// XP model: a level spans a fixed band of XP. xp is cumulative lifetime XP.
// Level 1 = [0,100), level 2 = [100,200), ... This matches the UI math
// (nextLevelXP = level * 100) and keeps progression predictable.
export const LEVEL_XP_SPAN = 100;

export function levelFromXp(xp: number): number {
  return Math.floor(Math.max(0, xp) / LEVEL_XP_SPAN) + 1;
}

// XP accumulated within the current level (0..LEVEL_XP_SPAN-1).
export function xpIntoLevel(xp: number): number {
  return Math.max(0, xp) % LEVEL_XP_SPAN;
}

// XP still required to reach the next level.
export function xpToNextLevel(xp: number): number {
  return LEVEL_XP_SPAN - xpIntoLevel(xp);
}

// Progress through the current level as a 0..100 percentage.
export function levelProgressPct(xp: number): number {
  return Math.round((xpIntoLevel(xp) / LEVEL_XP_SPAN) * 100);
}

export type Rank = "E" | "D" | "C" | "B" | "A" | "S";

// Solo-Leveling style rank derived from level.
export function rankFromLevel(level: number): Rank {
  if (level >= 50) return "S";
  if (level >= 35) return "A";
  if (level >= 20) return "B";
  if (level >= 10) return "C";
  if (level >= 5) return "D";
  return "E";
}

// Apply an XP delta (can be negative) and recompute level. XP is floored at 0.
// Used for completing/un-completing your own tasks, where reversing an action
// may legitimately move you back across a level boundary.
export function applyXpDelta(
  xp: number,
  delta: number,
): { xp: number; level: number } {
  const next = Math.max(0, xp + delta);
  return { xp: next, level: levelFromXp(next) };
}

// Cumulative XP at the start of a given level (the level's lower bound).
export function levelFloorXp(level: number): number {
  return (Math.max(1, level) - 1) * LEVEL_XP_SPAN;
}

// Apply a penalty (missed-task punishment). XP dips *within* the current level
// but never below the level's floor, so the SYSTEM never strips a rank you've
// already earned (product decision: level/rank only ever climb). Returns the
// actual XP removed after flooring so the UI can report the true cost.
export function applyPenalty(
  xp: number,
  level: number,
  penalty: number,
): { xp: number; level: number; xpLost: number } {
  const floor = levelFloorXp(level);
  const next = Math.max(floor, xp - Math.max(0, penalty));
  return { xp: next, level, xpLost: xp - next };
}

// An honest current-streak value given the last active day. A streak is only
// "alive" if the user was active today or yesterday; any larger gap means the
// chain is already broken, regardless of the last stored count.
export function settledStreak(
  currentStreak: number,
  lastActiveAt: Date | null,
  now: Date,
): number {
  if (!lastActiveAt) return 0;
  const gap = differenceInCalendarDays(startOfDay(now), startOfDay(lastActiveAt));
  return gap <= 1 ? currentStreak : 0;
}

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveAt: Date | null;
}

// Recompute streaks when the user completes their first task of the day.
// - same day as last activity  -> unchanged (already counted today)
// - exactly the next day        -> increment
// - any larger gap (or first)   -> reset to 1
export function updateStreakOnActivity(
  state: StreakState,
  now: Date,
): StreakState {
  const today = startOfDay(now);

  if (state.lastActiveAt) {
    const gap = differenceInCalendarDays(today, startOfDay(state.lastActiveAt));
    if (gap === 0) return state; // already active today
    if (gap === 1) {
      const currentStreak = state.currentStreak + 1;
      return {
        currentStreak,
        longestStreak: Math.max(state.longestStreak, currentStreak),
        lastActiveAt: today,
      };
    }
  }

  // First-ever activity or a missed day breaks the streak.
  return {
    currentStreak: 1,
    longestStreak: Math.max(state.longestStreak, 1),
    lastActiveAt: today,
  };
}

export interface AchievementView {
  key: string;
  title: string;
  description: string;
  unlocked: boolean;
}

// Achievements are derived from stats rather than stored. `completedCount` is
// the number of completed DailyTasks (queried by the caller).
export function computeAchievements(stats: {
  level: number;
  longestStreak: number;
  completedCount: number;
}): AchievementView[] {
  const { level, longestStreak, completedCount } = stats;
  return [
    {
      key: "early_adopter",
      title: "Early Adopter",
      description: "Joined the System",
      unlocked: true,
    },
    {
      key: "task_master",
      title: "Task Master",
      description: "Completed 10 tasks",
      unlocked: completedCount >= 10,
    },
    {
      key: "streak_starter",
      title: "Streak Starter",
      description: "Maintained a 3-day streak",
      unlocked: longestStreak >= 3,
    },
    {
      key: "consistency_king",
      title: "Consistency King",
      description: "Maintained a 7-day streak",
      unlocked: longestStreak >= 7,
    },
    {
      key: "level_10",
      title: "Level 10 Achiever",
      description: "Reached level 10",
      unlocked: level >= 10,
    },
    {
      key: "task_centurion",
      title: "Task Centurion",
      description: "Completed 100 tasks",
      unlocked: completedCount >= 100,
    },
  ];
}
