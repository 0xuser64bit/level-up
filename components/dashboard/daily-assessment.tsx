"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { acknowledgeAssessment } from "@/app/actions/daily";
import type { Assessment } from "@/lib/settlement";

// The SYSTEM's verdict, shown full-screen when a user returns after missing
// quests. Deliberately confrontational — this is the "stick" of the loop.
export function DailyAssessment({ assessment }: { assessment: Assessment }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const acknowledge = () =>
    startTransition(async () => {
      await acknowledgeAssessment();
      router.refresh();
    });

  const { missedCount, xpLost, streakBroken, prevStreak } = assessment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_30%,_#000_80%)]" />

      <div className="relative w-full max-w-md cyber-panel border-cyber-pink/60 shadow-[0_0_40px_rgba(255,56,100,0.25)]">
        <div className="flex items-center gap-3 border-b border-cyber-pink/30 pb-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-cyber-pink animate-pulse" />
          <h2 className="font-display tracking-widest text-cyber-pink glow-text-pink text-lg uppercase">
            System Assessment
          </h2>
        </div>

        <p className="font-mono text-sm text-white/80 mb-5">
          You failed to clear all assigned quests. The SYSTEM has rendered its
          judgment.
        </p>

        <div className="space-y-2 font-mono text-sm mb-6">
          <Row label="Quests failed" value={`${missedCount}`} />
          <Row
            label="XP penalty"
            value={xpLost > 0 ? `−${xpLost} XP` : "0 XP (floor reached)"}
            danger={xpLost > 0}
          />
          <Row
            label="Streak"
            value={
              streakBroken
                ? `BROKEN (lost ${prevStreak} ${prevStreak === 1 ? "day" : "days"})`
                : "Intact"
            }
            danger={streakBroken}
          />
        </div>

        <p className="font-mono text-xs text-white/50 mb-6">
          Rank is protected — XP never falls below your current level. Rise
          again. Weakness is a bug, and it will be patched.
        </p>

        <Button
          className="cyber-button w-full border-cyber-pink/60 text-cyber-pink"
          style={{ textShadow: "0 0 5px rgba(255,56,100,1)" }}
          onClick={acknowledge}
          disabled={isPending}
        >
          {isPending ? "Acknowledging..." : "Acknowledge"}
        </Button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2">
      <span className="text-white/60">{label}</span>
      <span className={danger ? "text-cyber-pink font-bold" : "text-white/90"}>
        {value}
      </span>
    </div>
  );
}
