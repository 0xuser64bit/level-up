"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Terminal, TerminalLine } from "@/components/ui/terminal";
import { setUsername } from "@/app/actions/onboarding";

export function UsernameForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await setUsername(formData);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="font-display text-3xl text-cyber-blue mb-2 tracking-wider">
            CHOOSE YOUR DESIGNATION
          </h1>
          <p className="text-white/70 font-mono text-sm">
            Select a unique handle for the System
          </p>
        </div>

        <Terminal className="mb-6">
          <TerminalLine typing>Identity verified.</TerminalLine>
          <TerminalLine className="text-cyber-blue" typing>
            Assign a permanent designation to proceed.
          </TerminalLine>
          <TerminalLine showCursor />
        </Terminal>

        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-sm font-mono text-white/70"
            >
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="3-20 letters, numbers or underscores"
              className="cyber-input"
              disabled={isPending}
              autoFocus
            />
          </div>

          {error && (
            <div className="text-cyber-pink text-sm font-mono p-2 border border-cyber-pink/30 bg-cyber-pink/10 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="cyber-button w-full cursor-pointer"
            disabled={isPending}
          >
            {isPending ? "Registering..." : "Enter the System"}
          </Button>
        </form>
      </div>
    </div>
  );
}
