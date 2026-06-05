import type React from "react";
import { SystemFeedback } from "@/components/feedback/system-feedback";
import { Header } from "@/components/layout/header";
import { requireOnboardedUser } from "@/lib/session";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireOnboardedUser();

  return (
    <SystemFeedback>
      <div className="min-h-screen flex flex-col">
        <Header
          username={user.username as string}
          subjectId={user.id.slice(-6).toUpperCase()}
        />
        <main className="flex-1 container py-6">{children}</main>
        <footer className="border-t border-border py-4">
          <div className="container flex justify-center">
            <p className="text-xs text-muted-foreground font-mono">
              SYSTEM © {new Date().getFullYear()} • All human activity is
              monitored
            </p>
          </div>
        </footer>
      </div>
    </SystemFeedback>
  );
}
