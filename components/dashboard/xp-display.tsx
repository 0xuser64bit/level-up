import { Terminal, TerminalLine } from "@/components/ui/terminal";

interface XPDisplayProps {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
}

export function XPDisplay({
  xp,
  level,
  streak,
  longestStreak,
}: XPDisplayProps) {
  // Calculate progress to next level (simple formula: 100 XP per level)
  const nextLevelXP = level * 100;
  const currentLevelXP = (level - 1) * 100;
  const progress =
    ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <Terminal title="SUBJECT STATUS" className="mb-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <TerminalLine className="text-white/70">Level:</TerminalLine>
          <TerminalLine className="text-cyber-yellow glow-text-yellow text-2xl font-display">
            {level}
          </TerminalLine>
        </div>
        <div>
          <TerminalLine className="text-white/70">XP:</TerminalLine>
          <TerminalLine className="text-cyber-blue glow-text text-2xl font-display">
            {xp}
          </TerminalLine>
        </div>
      </div>

      <TerminalLine className="text-white/70 mb-1">
        Progress to Level {level + 1}:
      </TerminalLine>
      <div className="w-full bg-white/10 rounded-full h-2.5 mb-4">
        <div
          className="bg-cyber-blue h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <TerminalLine className="text-white/70">Current Streak:</TerminalLine>
          <TerminalLine className="text-cyber-teal">
            {streak} {streak === 1 ? "day" : "days"}
          </TerminalLine>
        </div>
        <div>
          <TerminalLine className="text-white/70">Longest Streak:</TerminalLine>
          <TerminalLine className="text-cyber-teal">
            {longestStreak} {longestStreak === 1 ? "day" : "days"}
          </TerminalLine>
        </div>
      </div>
    </Terminal>
  );
}
