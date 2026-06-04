import "server-only";
import { startOfDay } from "date-fns";
import db from "@/lib/db";
import { isDueOn } from "@/lib/recurrence";

// Returns today's board for a user, lazily generating the day's DailyTask
// instances and Mission the first time it's viewed. Idempotent: safe to call on
// every dashboard load (generation is deduped by the unique constraints).
export async function getTodayBoard(userId: string) {
  const today = startOfDay(new Date());

  const templates = await db.task.findMany({ where: { userId } });

  // Non-recurring templates should appear exactly once, ever.
  const instantiated = await db.dailyTask.findMany({
    where: { userId, taskId: { not: null } },
    select: { taskId: true },
    distinct: ["taskId"],
  });
  const instantiatedIds = new Set(instantiated.map((r) => r.taskId));

  const due = templates.filter((t) =>
    t.recurring ? isDueOn(t.pattern, today) : !instantiatedIds.has(t.id),
  );

  if (due.length > 0) {
    await db.dailyTask.createMany({
      data: due.map((t) => ({
        userId,
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
  }

  const mission = await db.mission.upsert({
    where: { userId_date: { userId, date: today } },
    update: {},
    create: {
      userId,
      date: today,
      title: "Daily Mission: Performance Evaluation",
      description:
        "Complete all assigned tasks to prove your worth to the System.",
      xpReward: 50,
    },
  });

  const dailyTasks = await db.dailyTask.findMany({
    where: { userId, date: today },
    orderBy: [{ isSideQuest: "asc" }, { createdAt: "asc" }],
  });

  return { dailyTasks, mission, today };
}
