// One-off verification of the core data loop against the live database.
// Run: bun run scripts/verify-core.ts   (not part of the app)
import { startOfDay } from "date-fns";
import { PrismaClient } from "../generated/prisma";
import { isDueOn } from "../lib/recurrence";
import { applyXpDelta, updateStreakOnActivity } from "../lib/leveling";

const db = new PrismaClient();

async function main() {
  const user = await db.user.findUniqueOrThrow({
    where: { email: "demo@level-up.dev" },
  });
  const today = startOfDay(new Date());

  // --- board generation (mirrors lib/board.ts) ---
  const templates = await db.task.findMany({ where: { userId: user.id } });
  const instantiated = await db.dailyTask.findMany({
    where: { userId: user.id, taskId: { not: null } },
    select: { taskId: true },
    distinct: ["taskId"],
  });
  const ids = new Set(instantiated.map((r) => r.taskId));
  const due = templates.filter((t) =>
    t.recurring ? isDueOn(t.pattern, today) : !ids.has(t.id),
  );
  await db.dailyTask.createMany({
    data: due.map((t) => ({
      userId: user.id,
      taskId: t.id,
      title: t.title,
      description: t.description,
      xpReward: t.xpReward,
      penalty: t.penalty,
      isSideQuest: t.isSideQuest,
      date: today,
    })),
    skipDuplicates: true,
  });
  const mission = await db.mission.upsert({
    where: { userId_date: { userId: user.id, date: today } },
    update: {},
    create: {
      userId: user.id,
      date: today,
      title: "Daily Mission",
      description: "Complete all tasks.",
      xpReward: 50,
    },
  });
  const board = await db.dailyTask.findMany({
    where: { userId: user.id, date: today },
  });
  console.log(`Generated ${board.length} daily tasks (due=${due.length}).`);
  console.log(`Mission: ${mission.id} completed=${mission.isCompleted}`);

  // --- toggle one task (mirrors toggleDailyTask) ---
  const target = board.find((t) => !t.isCompleted);
  if (target) {
    const xpBefore = user.xp;
    const { xp, level } = applyXpDelta(user.xp, target.xpReward);
    const streak = updateStreakOnActivity(
      {
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        lastActiveAt: user.lastActiveAt,
      },
      new Date(),
    );
    await db.$transaction([
      db.dailyTask.update({
        where: { id: target.id },
        data: { isCompleted: true, completedAt: new Date() },
      }),
      db.user.update({
        where: { id: user.id },
        data: {
          xp,
          level,
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          lastActiveAt: streak.lastActiveAt,
        },
      }),
    ]);
    const after = await db.user.findUniqueOrThrow({ where: { id: user.id } });
    console.log(
      `Completed "${target.title}": xp ${xpBefore} -> ${after.xp} (+${target.xpReward}), level ${after.level}, streak ${after.currentStreak}`,
    );
  }

  // --- mission guard ---
  const remaining = await db.dailyTask.count({
    where: { userId: user.id, date: today, isCompleted: false },
  });
  console.log(
    `Mission claimable: ${remaining === 0 ? "yes" : `no (${remaining} left)`}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
