"use client";

import { Button } from "@/components/ui/button";
import { Terminal, TerminalLine } from "@/components/ui/terminal";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="max-w-3xl w-full space-y-8">
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-6xl text-cyber-blue mb-2 tracking-wider glow-text">
              LEVEL UP
            </h1>
            <p className="text-white/70 font-mono text-sm md:text-base">
              Productivity Protocol v1.0
            </p>
          </div>

          <Terminal className="mb-8">
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="cyber-button w-full cursor-pointer">
                Login
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button className="cyber-button w-full cursor-pointer">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-4">
        <div className="container flex justify-center">
          <p className="text-xs text-muted-foreground font-mono">
            LEVEL UP © {new Date().getFullYear()} • Surveillance Active •
            Weakness is a bug — and it will be patched
          </p>
        </div>
      </footer>
    </div>
  );
}
