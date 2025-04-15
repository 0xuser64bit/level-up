import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";
import ThemeProvider from "./providers";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Level Up",
  description: "A futuristic productivity and habit-tracking application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${mono.className}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
