import { Terminal, TerminalLine } from "@/components/ui/terminal";
import { getDemoProgress, getDemoUser } from "@/lib/demo-data";

export default function ProfilePage() {
  const user = getDemoUser();
  const progress = getDemoProgress();

  // Calculate next level XP
  const nextLevelXP = progress.level * 100;
  const currentLevelXP = (progress.level - 1) * 100;
  const xpToNextLevel = nextLevelXP - progress.xp;
  const levelProgress =
    ((progress.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="space-y-6">
      <h1 className="cyber-heading text-2xl md:text-3xl">Subject Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Terminal title="SUBJECT INFORMATION">
          <div className="space-y-4">
            <div>
              <TerminalLine className="text-white/70">Subject ID:</TerminalLine>
              <TerminalLine className="text-cyber-blue font-bold">
                #{user.id}
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
              <TerminalLine className="text-white/70">
                Current Level:
              </TerminalLine>
              <TerminalLine className="text-cyber-yellow glow-text-yellow font-bold">
                {progress.level}
              </TerminalLine>
            </div>

            <div>
              <TerminalLine className="text-white/70">Current XP:</TerminalLine>
              <TerminalLine className="text-cyber-blue font-bold">
                {progress.xp} / {nextLevelXP} XP
              </TerminalLine>
            </div>
          </div>
        </Terminal>

        <Terminal title="PROGRESS ANALYSIS">
          <div className="space-y-4">
            <div>
              <TerminalLine className="text-white/70">
                Level Progress:
              </TerminalLine>
              <div className="w-full bg-white/10 rounded-full h-2.5 mb-2">
                <div
                  className="bg-cyber-blue h-2.5 rounded-full"
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
              <TerminalLine className="text-white/50 text-xs">
                {xpToNextLevel} XP needed for next level
              </TerminalLine>
            </div>

            <div>
              <TerminalLine className="text-white/70">
                Current Streak:
              </TerminalLine>
              <TerminalLine className="text-cyber-teal font-bold">
                {progress.current_streak} days
              </TerminalLine>
            </div>

            <div>
              <TerminalLine className="text-white/70">
                Longest Streak:
              </TerminalLine>
              <TerminalLine className="text-cyber-teal font-bold">
                {progress.longest_streak} days
              </TerminalLine>
            </div>

            <div>
              <TerminalLine className="text-white/70">
                System Assessment:
              </TerminalLine>
              <TerminalLine className="text-cyber-blue">
                Subject shows {progress.level < 3 ? "minimal" : "acceptable"}{" "}
                progress.
                {progress.current_streak > 3
                  ? " Consistency metrics are promising."
                  : " Consistency requires improvement."}
              </TerminalLine>
            </div>
          </div>
        </Terminal>

        <Terminal title="ACHIEVEMENTS" className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="cyber-panel p-3">
              <div className="text-cyber-yellow font-display text-sm mb-1">
                Early Adopter
              </div>
              <div className="text-white/70 text-xs">Joined the System</div>
            </div>

            <div className="cyber-panel p-3">
              <div className="text-cyber-yellow font-display text-sm mb-1">
                Task Master
              </div>
              <div className="text-white/70 text-xs">Completed 10 tasks</div>
            </div>

            <div className="cyber-panel p-3">
              <div className="text-cyber-yellow font-display text-sm mb-1">
                Streak Starter
              </div>
              <div className="text-white/70 text-xs">
                Maintained a 3-day streak
              </div>
            </div>

            <div className="cyber-panel p-3 opacity-40">
              <div className="text-cyber-yellow font-display text-sm mb-1">
                Consistency King
              </div>
              <div className="text-white/70 text-xs">
                Maintained a 7-day streak
              </div>
            </div>

            <div className="cyber-panel p-3 opacity-40">
              <div className="text-cyber-yellow font-display text-sm mb-1">
                Level 10 Achiever
              </div>
              <div className="text-white/70 text-xs">Reached level 10</div>
            </div>

            <div className="cyber-panel p-3 opacity-40">
              <div className="text-cyber-yellow font-display text-sm mb-1">
                Task Centurion
              </div>
              <div className="text-white/70 text-xs">Completed 100 tasks</div>
            </div>
          </div>
        </Terminal>
      </div>
    </div>
  );
}
