import { Terminal, TerminalLine } from "@/components/ui/terminal";
import { levelProgressPct, rankFromLevel } from "@/lib/leveling";

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
  const progress = levelProgressPct(xp);
  const rank = rankFromLevel(level);

  return (
    <Terminal title="SUBJECT STATUS" className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <TerminalLine className="text-white/70">Hunter Rank:</TerminalLine>
        <span className="text-cyber-yellow glow-text-yellow text-3xl font-display tracking-widest">
          {rank}
        </span>
      </div>
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
      <div className="w-full bg-white/10 rounded-full h-2.5 mb-4 overflow-hidden">
        <div
          className="bg-cyber-blue h-2.5 rounded-full transition-[width] duration-700 ease-out shadow-[0_0_10px_rgba(12,255,225,0.5)]"
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
