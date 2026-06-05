"use client";

import { signIn } from "next-auth/react";
import { Flame, Skull, Swords, TrendingUp } from "lucide-react";
import { CyberArrow } from "@/components/cyber-arrow";
import { Button } from "@/components/ui/button";
import { Terminal, TerminalLine } from "@/components/ui/terminal";

const PILLARS = [
  {
    icon: Swords,
    title: "Daily Quests",
    body: "Define your habits as quests. Recurring or one-off. Clear them each day to earn XP.",
  },
  {
    icon: TrendingUp,
    title: "Level & Rank",
    body: "XP compounds into levels and a hunter rank, E through S. Progress only ever climbs.",
  },
  {
    icon: Flame,
    title: "Streaks",
    body: "Show up every day to build a streak. Momentum is tracked, honestly, and rewarded.",
  },
  {
    icon: Skull,
    title: "Consequences",
    body: "Miss your quests and the SYSTEM settles the score — XP penalties and broken streaks.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="max-w-3xl w-full space-y-10 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <h1 className="font-display text-4xl md:text-6xl text-cyber-blue tracking-wider glow-text">
                LEVEL UP
              </h1>
              <CyberArrow />
            </div>
            <p className="text-white/70 font-mono text-sm md:text-base">
              A personal growth SYSTEM. Turn discipline into a game you can&apos;t
              put down.
            </p>
          </div>

          <Terminal>
            <TerminalLine typing>
              Deploying neural override protocol...
            </TerminalLine>
            <TerminalLine className="text-cyber-blue" typing>
              Subject identified: low-level human. Initiating upgrade sequence.
            </TerminalLine>
            <TerminalLine className="text-cyber-yellow" typing>
              WARNING: Weak habits will be eliminated. Excuses will be purged.
            </TerminalLine>
            <TerminalLine className="text-white/70" typing>
              Enter the gate. Survive. Evolve. Or perish trying.
            </TerminalLine>
            <TerminalLine showCursor />
          </Terminal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="cyber-panel">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-5 w-5 text-cyber-blue" />
                  <h3 className="font-display tracking-wide text-cyber-blue uppercase text-sm">
                    {title}
                  </h3>
                </div>
                <p className="text-white/60 font-mono text-xs leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3">
            <Button
              className="cyber-button w-full sm:w-auto px-8 cursor-pointer"
              onClick={() =>
                signIn("google", { redirect: true, callbackUrl: "/dashboard" })
              }
            >
              Accept Challenge & Level Up
            </Button>
            <p className="text-xs text-white/40 font-mono">
              Sign in with Google · free · no weakness tolerated
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-4">
        <div className="container flex justify-center">
          <p className="text-xs text-muted-foreground font-mono text-center">
            LEVEL UP © {new Date().getFullYear()} • Surveillance Active •
            Weakness is a bug — and it will be patched
          </p>
        </div>
      </footer>
    </div>
  );
}
