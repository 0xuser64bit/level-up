import { MissionBriefing } from "@/components/dashboard/mission-briefing";
import { TaskCard } from "@/components/dashboard/task-card";
import { XPDisplay } from "@/components/dashboard/xp-display";
import { Terminal, TerminalLine } from "@/components/ui/terminal";
import {
  getDemoDailyMission,
  getDemoDailyTasks,
  getDemoProgress,
  getDemoUser
} from "@/lib/demo-data";
import { format } from "date-fns";

export default function DashboardPage() {
  const user = getDemoUser();
  const progress = getDemoProgress();
  const dailyTasks = getDemoDailyTasks();
  const mission = getDemoDailyMission();
  const today = format(new Date(), "yyyy-MM-dd");

  const allTasksCompleted =
    dailyTasks.length > 0 && dailyTasks.every((task) => task.is_completed);

  return (
    <div className="space-y-6">
      <h1 className="cyber-heading text-2xl md:text-3xl">Daily Operations</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {mission && (
            <MissionBriefing
              id={mission.id}
              title={mission.title}
              description={mission.description}
              xpReward={mission.xp_reward}
              isCompleted={mission.is_completed}
              userId={user.id}
              date={today}
              allTasksCompleted={allTasksCompleted}
            />
          )}

          {/* Daily Tasks */}
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
                {dailyTasks.filter((task) => !task.is_completed).length}
              </span>
            </TerminalLine>
          </Terminal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyTasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                isCompleted={task.is_completed}
                xpReward={task.xp_reward}
                userId={user.id}
                date={today}
                isSideQuest={task.is_side_quest}
              />
            ))}
          </div>
        </div>

        <div>
          <XPDisplay
            xp={progress.xp}
            level={progress.level}
            streak={progress.current_streak}
            longestStreak={progress.longest_streak}
          />

          <Terminal title="PERFORMANCE METRICS">
            <TerminalLine className="mb-2 text-white/70">
              Tasks completed today:{" "}
              <span className="text-cyber-blue">
                {dailyTasks.filter((task) => task.is_completed).length}/
                {dailyTasks.length}
              </span>
            </TerminalLine>
            <TerminalLine className="mb-2 text-white/70">
              Completion rate:{" "}
              <span className="text-cyber-blue">
                {dailyTasks.length > 0
                  ? Math.round(
                      (dailyTasks.filter((task) => task.is_completed).length /
                        dailyTasks.length) *
                        100
                    )
                  : 0}
                %
              </span>
            </TerminalLine>
            <TerminalLine className="mb-2 text-white/70">
              XP earned today:{" "}
              <span className="text-cyber-blue">
                +
                {dailyTasks
                  .filter((task) => task.is_completed)
                  .reduce((sum, task) => sum + task.xp_reward, 0)}{" "}
                XP
              </span>
            </TerminalLine>
            <TerminalLine className="mb-2 text-white/70">
              Next level:{" "}
              <span className="text-cyber-blue">{progress.level + 1}</span>{" "}
              <span className="text-white/50">
                ({progress.level * 100 - progress.xp} XP needed)
              </span>
            </TerminalLine>
          </Terminal>
        </div>
      </div>
    </div>
  );
}
