"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Terminal, TerminalLine } from "@/components/ui/terminal";
import { Button } from "@/components/ui/button";
import { completeMission } from "@/app/actions/daily";

interface MissionBriefingProps {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  isCompleted: boolean;
  allTasksCompleted: boolean;
}

export function MissionBriefing({
  id,
  title,
  description,
  xpReward,
  isCompleted,
  allTasksCompleted,
}: MissionBriefingProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleComplete = () => {
    setError(null);
    startTransition(async () => {
      const res = await completeMission(id);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <Terminal title="MISSION BRIEFING" className="mb-6">
      <TerminalLine className="text-cyber-blue font-bold mb-2">
        {title}
      </TerminalLine>
      <TerminalLine className="mb-4 text-white/80">{description}</TerminalLine>
      <TerminalLine className="mb-2 text-white/70">
        Mission Parameters:
      </TerminalLine>
      <TerminalLine className="mb-1 pl-4 text-white/70">
        - Complete all assigned tasks
      </TerminalLine>
      <TerminalLine className="mb-4 pl-4 text-white/70">
        - Report back for evaluation
      </TerminalLine>
      <TerminalLine className="text-cyber-yellow">
        Reward: +{xpReward} XP
      </TerminalLine>

      {error && (
        <p className="mt-2 text-xs font-mono text-cyber-pink">{error}</p>
      )}

      <div className="mt-4 flex justify-end">
        {isCompleted ? (
          <Button
            disabled
            className="cyber-button bg-cyber-teal/10 border-cyber-teal/50 text-cyber-teal"
          >
            Mission Complete
          </Button>
        ) : (
          <Button
            className="cyber-button"
            disabled={!allTasksCompleted || isPending}
            onClick={handleComplete}
          >
            {isPending ? "Processing..." : "Complete Mission"}
          </Button>
        )}
      </div>
    </Terminal>
  );
}
