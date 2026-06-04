import { format } from "date-fns";
import { MissionBriefing } from "@/components/dashboard/mission-briefing";
import { TaskCard } from "@/components/dashboard/task-card";
import { XPDisplay } from "@/components/dashboard/xp-display";
import { Terminal, TerminalLine } from "@/components/ui/terminal";
import { getTodayBoard } from "@/lib/board";
import { xpToNextLevel } from "@/lib/leveling";
import { requireOnboardedUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await requireOnboardedUser();
  const { dailyTasks, mission } = await getTodayBoard(user.id);

  const completed = dailyTasks.filter((t) => t.isCompleted);
  const allTasksCompleted =
    dailyTasks.length > 0 && completed.length === dailyTasks.length;
  const xpEarnedToday = completed.reduce((sum, t) => sum + t.xpReward, 0);
  const completionRate =
    dailyTasks.length > 0
      ? Math.round((completed.length / dailyTasks.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <h1 className="cyber-heading text-2xl md:text-3xl">Daily Operations</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MissionBriefing
            id={mission.id}
            title={mission.title}
            description={mission.description}
            xpReward={mission.xpReward}
            isCompleted={mission.isCompleted}
            allTasksCompleted={allTasksCompleted}
          />

          <Terminal title="TASK LIST" className="mb-6">
            <TerminalLine className="mb-2">
              Current date:{" "}
              <span className="text-cyber-blue">
                {format(new Date(), "MMMM d, yyyy")}
              </span>
            </TerminalLine>
            <TerminalLine className="mb-4">
              Tasks requiring completion:{" "}
              <span className="text-cyber-blue">
                {dailyTasks.length - completed.length}
              </span>
            </TerminalLine>
          </Terminal>

          {dailyTasks.length === 0 ? (
            <Terminal>
              <TerminalLine className="text-white/70">
                No tasks scheduled for today. Define your protocols in{" "}
                <span className="text-cyber-blue">Task Management</span> to begin
                leveling up.
              </TerminalLine>
            </Terminal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  isCompleted={task.isCompleted}
                  xpReward={task.xpReward}
                  isSideQuest={task.isSideQuest}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <XPDisplay
            xp={user.xp}
            level={user.level}
            streak={user.currentStreak}
            longestStreak={user.longestStreak}
          />

          <Terminal title="PERFORMANCE METRICS">
            <TerminalLine className="mb-2 text-white/70">
              Tasks completed today:{" "}
              <span className="text-cyber-blue">
                {completed.length}/{dailyTasks.length}
              </span>
            </TerminalLine>
            <TerminalLine className="mb-2 text-white/70">
              Completion rate:{" "}
              <span className="text-cyber-blue">{completionRate}%</span>
            </TerminalLine>
            <TerminalLine className="mb-2 text-white/70">
              XP earned today:{" "}
              <span className="text-cyber-blue">+{xpEarnedToday} XP</span>
            </TerminalLine>
            <TerminalLine className="mb-2 text-white/70">
              Next level:{" "}
              <span className="text-cyber-blue">{user.level + 1}</span>{" "}
              <span className="text-white/50">
                ({xpToNextLevel(user.xp)} XP needed)
              </span>
            </TerminalLine>
          </Terminal>
        </div>
      </div>
    </div>
  );
}
