import type React from "react";
import { Header } from "@/components/layout/header";
import { getDemoUser } from "@/lib/demo-data";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getDemoUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Header username={user.username} />
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
  );
}
