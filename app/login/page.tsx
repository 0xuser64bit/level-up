"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Terminal, TerminalLine } from "@/components/ui/terminal";
import Link from "next/link";
import { useEffect, useState } from "react";
import { loginUser } from "../actions/user";

export default function LoginPage() {
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
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const { status, message } = await loginUser(email, password);
      if (status !== 200) {
        setError(message);
        return;
      }
      alert("User logged in successfully");
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
            SYSTEM LOGIN
          </h1>
          <p className="text-white/70 font-mono text-sm">
            Authentication required
          </p>
        </div>

        <Terminal className="mb-6">
          <TerminalLine typing>Awaiting credentials...</TerminalLine>
          <TerminalLine className="text-cyber-blue" typing>
            Please provide your identification parameters.
          </TerminalLine>
          <TerminalLine showCursor />
        </Terminal>

        <form action={handleSubmit} className="space-y-6">
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
              autoComplete="current-password"
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
            {isLoading ? "Authenticating..." : "Login"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-white/70 font-mono">
            No account?{" "}
            <Link href="/register" className="text-cyber-blue hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
