import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";
import ThemeProvider from "./providers";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: {
    default: "Level Up | Rise from E to S Rank",
    template: "%s | Level Up SYSTEM",
  },
  description:
    "A Solo Leveling inspired productivity SYSTEM that helps you track your daily quests, gain experience, and evolve from E to S rank through consistent habit development.",
  keywords: [
    "level up",
    "solo leveling",
    "SYSTEM",
    "productivity",
    "habits",
    "daily quests",
    "rank up",
    "personal growth",
    "gamified productivity",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "LEVEL UP SYSTEM",
    title: "Level Up | Rise from E to S Rank",
    description:
      "A Solo Leveling inspired productivity SYSTEM that helps you track your daily quests, gain experience, and evolve from E to S rank through consistent habit development.",
    images: [
      {
        url: "/level-up.png",
        width: 1200,
        height: 630,
        alt: "LEVEL UP SYSTEM - Track quests, gain experience, rise in rank",
      },
    ],
  },
  icons: {
    icon: "/level-up.png",
    shortcut: "/level-up.png",
    apple: "/level-up.png",
  },
  creator: "Level Up SYSTEM",
  category: "Productivity",
  applicationName: "Level Up SYSTEM",
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
