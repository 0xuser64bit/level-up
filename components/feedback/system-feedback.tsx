"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronsUp, Sparkles, X } from "lucide-react";
import type { Rank } from "@/lib/leveling";
import { cn } from "@/lib/utils";

type ToastVariant = "xp" | "info" | "warn" | "achievement";

interface Toast {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface Celebration {
  level: number;
  rank: Rank;
  rankUp: boolean;
}

interface FeedbackApi {
  notify: (t: Omit<Toast, "id">) => void;
  celebrate: (c: Celebration) => void;
}

const FeedbackContext = createContext<FeedbackApi | null>(null);

export function useSystemFeedback(): FeedbackApi {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    throw new Error("useSystemFeedback must be used within <SystemFeedback>");
  }
  return ctx;
}

export function SystemFeedback({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const idRef = useRef(0);

  const notify = useCallback((t: Omit<Toast, "id">) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  const celebrate = useCallback((c: Celebration) => setCelebration(c), []);

  return (
    <FeedbackContext.Provider value={{ notify, celebrate }}>
      {children}
      <ToastStack toasts={toasts} />
      {celebration && (
        <LevelUpOverlay
          celebration={celebration}
          onDone={() => setCelebration(null)}
        />
      )}
    </FeedbackContext.Provider>
  );
}

const VARIANT_STYLES: Record<ToastVariant, string> = {
  xp: "border-cyber-blue/60 text-cyber-blue shadow-[0_0_20px_rgba(12,255,225,0.18)]",
  info: "border-cyber-teal/50 text-cyber-teal",
  warn: "border-cyber-pink/60 text-cyber-pink shadow-[0_0_20px_rgba(255,56,100,0.18)]",
  achievement:
    "border-cyber-yellow/60 text-cyber-yellow shadow-[0_0_20px_rgba(252,238,9,0.18)]",
};

function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-[280px] pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "cyber-panel px-3 py-2 font-mono text-sm animate-[toast-in_0.25s_ease-out]",
            VARIANT_STYLES[t.variant],
          )}
        >
          <div className="flex items-center gap-2">
            {t.variant === "achievement" && <Sparkles className="h-4 w-4" />}
            <span className="font-bold tracking-wide">{t.title}</span>
          </div>
          {t.description && (
            <p className="text-white/60 text-xs mt-0.5">{t.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function LevelUpOverlay({
  celebration,
  onDone,
}: {
  celebration: Celebration;
  onDone: () => void;
}) {
  const { level, rank, rankUp } = celebration;

  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-sm cursor-pointer"
      onClick={onDone}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(12,255,225,0.12)_0%,_transparent_60%)]" />

      <button
        className="absolute top-5 right-5 text-white/40 hover:text-white"
        onClick={onDone}
        aria-label="Dismiss"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="relative text-center animate-[levelup-in_0.5s_ease-out]">
        <ChevronsUp className="mx-auto h-16 w-16 text-cyber-blue glow-text animate-bounce" />
        <h2 className="mt-4 font-display tracking-[0.3em] text-cyber-blue glow-text text-3xl md:text-5xl uppercase">
          {rankUp ? "Rank Up" : "Level Up"}
        </h2>

        {rankUp ? (
          <div className="mt-6">
            <p className="font-mono text-white/60 text-sm mb-1">New Rank</p>
            <p className="font-display text-cyber-yellow glow-text-yellow text-7xl md:text-8xl tracking-widest">
              {rank}
            </p>
          </div>
        ) : (
          <div className="mt-6">
            <p className="font-mono text-white/60 text-sm mb-1">Level</p>
            <p className="font-display text-cyber-yellow glow-text-yellow text-6xl md:text-7xl">
              {level}
            </p>
          </div>
        )}

        <p className="mt-6 font-mono text-xs text-white/40 uppercase tracking-widest">
          The SYSTEM acknowledges your growth
        </p>
      </div>
    </div>
  );
}
