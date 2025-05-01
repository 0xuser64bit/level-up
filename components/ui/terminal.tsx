import type React from "react";
import { cn } from "@/lib/utils";

interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
  showScanline?: boolean;
}

export function Terminal({
  title = "SYSTEM TERMINAL",
  children,
  showScanline = true,
  className,
  ...props
}: TerminalProps) {
  return (
    <div className={cn("terminal", className)} {...props}>
      <div className="terminal-header">
        <div className="terminal-title">{title}</div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-cyber-orange"></div>
          <div className="w-2 h-2 rounded-full bg-cyber-yellow"></div>
          <div className="w-2 h-2 rounded-full bg-cyber-blue"></div>
        </div>
      </div>
      <div className="terminal-content">
        {showScanline && <div className="scan-line"></div>}
        <div className="terminal-text">{children}</div>
      </div>
    </div>
  );
}

interface TerminalLineProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  isPrompt?: boolean;
  showCursor?: boolean;
  typing?: boolean;
}

export function TerminalLine({
  children,
  isPrompt = false,
  showCursor = false,
  typing = false,
  className,
  ...props
}: TerminalLineProps) {
  return (
    <div
      className={cn(
        "mb-1",
        isPrompt && "terminal-prompt",
        typing && "overflow-hidden whitespace-nowrap animate-terminal-typing",
        className,
      )}
      {...props}
    >
      {children}
      {showCursor && <span className="terminal-cursor"></span>}
    </div>
  );
}
