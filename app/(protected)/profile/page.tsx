import { Terminal, TerminalLine } from "@/components/ui/terminal";
import {
  computeAchievements,
  levelFromXp,
  levelProgressPct,
  rankFromLevel,
  xpToNextLevel,
} from "@/lib/leveling";
import { requireOnboardedUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import db from "@/lib/db";

export default async function ProfilePage() {
  const user = await requireOnboardedUser();
  const completedCount = await db.dailyTask.count({
    where: { userId: user.id, isCompleted: true },
  });

  const level = levelFromXp(user.xp);
  const rank = rankFromLevel(level);
  const nextLevelXP = level * 100;
  const progress = levelProgressPct(user.xp);
  const achievements = computeAchievements({
    level,
    longestStreak: user.longestStreak,
    completedCount,
  });

  return (
    <div className="space-y-6">
      <h1 className="cyber-heading text-2xl md:text-3xl">Subject Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Terminal title="SUBJECT INFORMATION">
          <div className="space-y-4">
            <div>
              <TerminalLine className="text-white/70">Subject ID:</TerminalLine>
              <TerminalLine className="text-cyber-blue font-bold">
                #{user.id.slice(-6).toUpperCase()}
              </TerminalLine>
            </div>
            <div>
              <TerminalLine className="text-white/70">Username:</TerminalLine>
              <TerminalLine className="text-cyber-blue font-bold">
                {user.username}
              </TerminalLine>
            </div>
            <div>
              <TerminalLine className="text-white/70">Email:</TerminalLine>
              <TerminalLine className="text-cyber-blue font-bold">
                {user.email}
              </TerminalLine>
            </div>
            <div>
              <TerminalLine className="text-white/70">Hunter Rank:</TerminalLine>
              <TerminalLine className="text-cyber-yellow glow-text-yellow font-bold text-xl">
                {rank}
              </TerminalLine>
            </div>
            <div>
              <TerminalLine className="text-white/70">Current Level:</TerminalLine>
              <TerminalLine className="text-cyber-yellow glow-text-yellow font-bold">
                {level}
              </TerminalLine>
            </div>
            <div>
              <TerminalLine className="text-white/70">Current XP:</TerminalLine>
              <TerminalLine className="text-cyber-blue font-bold">
                {user.xp} / {nextLevelXP} XP
              </TerminalLine>
            </div>
          </div>
        </Terminal>

        <Terminal title="PROGRESS ANALYSIS">
          <div className="space-y-4">
            <div>
              <TerminalLine className="text-white/70">Level Progress:</TerminalLine>
              <div className="w-full bg-white/10 rounded-full h-2.5 mb-2">
                <div
                  className="bg-cyber-blue h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <TerminalLine className="text-white/50 text-xs">
                {xpToNextLevel(user.xp)} XP needed for next level
              </TerminalLine>
            </div>
            <div>
              <TerminalLine className="text-white/70">Tasks Completed:</TerminalLine>
              <TerminalLine className="text-cyber-teal font-bold">
                {completedCount}
              </TerminalLine>
            </div>
            <div>
              <TerminalLine className="text-white/70">Current Streak:</TerminalLine>
              <TerminalLine className="text-cyber-teal font-bold">
                {user.currentStreak} days
              </TerminalLine>
            </div>
            <div>
              <TerminalLine className="text-white/70">Longest Streak:</TerminalLine>
              <TerminalLine className="text-cyber-teal font-bold">
                {user.longestStreak} days
              </TerminalLine>
            </div>
            <div>
              <TerminalLine className="text-white/70">System Assessment:</TerminalLine>
              <TerminalLine className="text-cyber-blue">
                Subject shows {level < 3 ? "minimal" : "acceptable"} progress.
                {user.currentStreak > 3
                  ? " Consistency metrics are promising."
                  : " Consistency requires improvement."}
              </TerminalLine>
            </div>
          </div>
        </Terminal>

        <Terminal title="ACHIEVEMENTS" className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((a) => (
              <div
                key={a.key}
                className={cn("cyber-panel p-3", !a.unlocked && "opacity-40")}
              >
                <div className="text-cyber-yellow font-display text-sm mb-1">
                  {a.title}
                </div>
                <div className="text-white/70 text-xs">{a.description}</div>
              </div>
            ))}
          </div>
        </Terminal>
      </div>
    </div>
  );
}
