import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import type { ActivityDay } from "@/lib/stats";

// GitHub-style activity grid. Intensity reflects completion ratio for the day,
// so a glance shows how consistently the user has been clearing their quests.
function intensity(day: ActivityDay): string {
  if (day.total === 0) return "bg-white/5";
  const ratio = day.completed / day.total;
  if (day.completed === 0) return "bg-cyber-pink/20"; // had quests, did none
  if (ratio >= 1) return "bg-cyber-blue shadow-[0_0_6px_rgba(12,255,225,0.6)]";
  if (ratio >= 0.5) return "bg-cyber-blue/60";
  return "bg-cyber-blue/30";
}

export function ActivityHeatmap({ activity }: { activity: ActivityDay[] }) {
  const activeDays = activity.filter((d) => d.completed > 0).length;

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {activity.map((day) => (
          <div
            key={day.date}
            title={`${format(parseISO(day.date), "MMM d")} — ${day.completed}/${day.total} quests`}
            className={cn("h-4 w-4 rounded-sm transition-colors", intensity(day))}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs font-mono text-white/40">
        <span>Last {activity.length} days</span>
        <span className="text-cyber-teal">{activeDays} active</span>
      </div>
    </div>
  );
}
