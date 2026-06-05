"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

// The System is a dark-only interface. We render children immediately (no
// mount gate) so the server-rendered HTML is the first paint — the previous
// `mounted ? children : null` guard blanked the entire app until hydration.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        forcedTheme="dark"
        enableSystem={false}
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
