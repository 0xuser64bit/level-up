import "server-only";
import { eachDayOfInterval, format, startOfDay, subDays } from "date-fns";
import db from "@/lib/db";

export interface ActivityDay {
  date: string; // yyyy-MM-dd
  completed: number; // quests completed that day
  total: number; // quests scheduled that day
}

// A contiguous run of the last `days` calendar days (including empty ones) with
// per-day completion counts — the data behind the profile heatmap. One grouped
// query, bucketed in memory so days with no activity still appear.
export async function getActivity(
  userId: string,
  days = 30,
): Promise<ActivityDay[]> {
  const today = startOfDay(new Date());
  const since = subDays(today, days - 1);

  const rows = await db.dailyTask.findMany({
    where: { userId, date: { gte: since } },
    select: { date: true, isCompleted: true },
  });

  const totals = new Map<string, { completed: number; total: number }>();
  for (const r of rows) {
    const key = format(r.date, "yyyy-MM-dd");
    const bucket = totals.get(key) ?? { completed: 0, total: 0 };
    bucket.total += 1;
    if (r.isCompleted) bucket.completed += 1;
    totals.set(key, bucket);
  }

  return eachDayOfInterval({ start: since, end: today }).map((d) => {
    const key = format(d, "yyyy-MM-dd");
    const bucket = totals.get(key) ?? { completed: 0, total: 0 };
    return { date: key, completed: bucket.completed, total: bucket.total };
  });
}
