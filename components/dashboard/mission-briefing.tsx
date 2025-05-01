"use client";

import { useState } from "react";
import { Terminal, TerminalLine } from "@/components/ui/terminal";
import { Button } from "@/components/ui/button";

interface MissionBriefingProps {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  isCompleted: boolean;
  userId: number;
  date: string;
  allTasksCompleted: boolean;
}

export function MissionBriefing({
  id,
  title,
  description,
  xpReward,
  isCompleted,
  userId,
  date,
  allTasksCompleted,
}: MissionBriefingProps) {
  const [isPending, setIsPending] = useState(false);

  const handleComplete = async () => {
    setIsPending(true);

    const formData = new FormData();
    formData.append("missionId", id.toString());
    formData.append("userId", userId.toString());
    formData.append("xpReward", xpReward.toString());
    formData.append("date", date);

    console.log("missionId", id);
    console.log("userId", userId);
    console.log("xpReward", xpReward);
    console.log("date", date);

    setIsPending(false);
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
