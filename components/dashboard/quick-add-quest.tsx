"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSystemFeedback } from "@/components/feedback/system-feedback";
import { addSideQuest } from "@/app/actions/daily";

// Inline "drop a quest right now" affordance on the dashboard, so the daily
// loop never requires a detour through Task Management.
export function QuickAddQuest() {
  const router = useRouter();
  const { notify } = useSystemFeedback();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await addSideQuest(formData);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      formRef.current?.reset();
      notify({ title: "Side quest deployed", variant: "info" });
      router.refresh();
    });
  };

  return (
    <form ref={formRef} action={onSubmit} className="cyber-panel">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          name="title"
          placeholder="Add a side quest for today…"
          className="cyber-input flex-1"
          maxLength={100}
          required
          disabled={isPending}
        />
        <Input
          name="xpReward"
          type="number"
          min={1}
          max={1000}
          defaultValue={15}
          aria-label="XP reward"
          className="cyber-input w-full sm:w-24"
          disabled={isPending}
        />
        <Button type="submit" className="cyber-button" disabled={isPending}>
          <Plus className="mr-1 h-4 w-4" />
          {isPending ? "Adding…" : "Deploy"}
        </Button>
      </div>
      {error && (
        <p className="mt-2 text-xs font-mono text-cyber-pink">{error}</p>
      )}
    </form>
  );
}
