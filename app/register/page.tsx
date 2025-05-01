"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Terminal, TerminalLine } from "@/components/ui/terminal";
import Link from "next/link";
import { useEffect, useState } from "react";
import { registerUser } from "../actions/user";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 1500);
    }
  }, [error]);

  const handleSubmit = async (formData: FormData) => {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!email || !password || !username) {
      setError("All fields are required");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const { status, message } = await registerUser(username, email, password);
      if (status !== 200) {
        setError(message);
        return;
      }
      alert("User created successfully");
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="font-display text-3xl text-cyber-blue mb-2 tracking-wider">
            NEW SUBJECT REGISTRATION
          </h1>
          <p className="text-white/70 font-mono text-sm">
            Create your profile in the system
          </p>
        </div>

        <Terminal className="mb-6">
          <TerminalLine typing>
            Initializing new subject profile...
          </TerminalLine>
          <TerminalLine className="text-cyber-blue" typing>
            Provide identification parameters for monitoring.
          </TerminalLine>
          <TerminalLine className="text-cyber-yellow" typing>
            WARNING: All productivity data will be tracked.
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
              className="cyber-input"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-mono text-white/70">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="cyber-input"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-mono text-white/70"
            >
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              className="cyber-input"
              disabled={isLoading}
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
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Register"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-white/70 font-mono">
            Already registered?{" "}
            <Link href="/login" className="text-cyber-blue hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
