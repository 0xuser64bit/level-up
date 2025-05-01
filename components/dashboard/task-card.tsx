"use client";

import { useState } from "react";
import { CheckCircle, Circle, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import { toggleTaskCompletion } from "@/app/actions";

interface TaskCardProps {
  id: number;
  title: string;
  description?: string | null;
  isCompleted: boolean;
  xpReward: number;
  userId: number;
  date: string;
  isSideQuest?: boolean;
}

export function TaskCard({
  id,
  title,
  description,
  isCompleted,
  xpReward,
  userId,
  date,
  isSideQuest = false,
}: TaskCardProps) {
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async () => {
    setIsPending(true);

    const formData = new FormData();
    formData.append("dailyTaskId", id.toString());
    formData.append("userId", userId.toString());
    formData.append("isCompleted", isCompleted.toString());
    formData.append("xpReward", xpReward.toString());
    formData.append("date", date);

    // await toggleTaskCompletion(formData);

    setIsPending(false);
  };

  return (
    <Card
      className={cn(
        "cyber-panel transition-all duration-300",
        isCompleted && "opacity-70 border-cyber-teal/30",
        isSideQuest && !isCompleted && "border-cyber-yellow/50",
        !isCompleted && !isSideQuest && "border-cyber-blue/30"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle
            className={cn(
              "text-lg font-display tracking-wide",
              isCompleted
                ? "text-cyber-teal line-through"
                : isSideQuest
                ? "text-cyber-yellow"
                : "text-cyber-blue"
            )}
          >
            {title}
          </CardTitle>
          <div
            className={cn(
              "px-2 py-1 rounded text-xs font-mono uppercase",
              isSideQuest
                ? "bg-cyber-yellow/10 text-cyber-yellow"
                : "bg-cyber-blue/10 text-cyber-blue"
            )}
          >
            {isSideQuest ? "Side Quest" : "Task"}
          </div>
        </div>
        {description && (
          <CardDescription className="text-white/70 font-mono text-sm">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm font-mono">
          <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">Due today</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t border-border">
        <div className="text-sm font-mono">
          <span
            className={cn(
              isSideQuest ? "text-cyber-yellow" : "text-cyber-blue"
            )}
          >
            +{xpReward} XP
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "font-mono text-xs",
            isCompleted
              ? "text-cyber-teal hover:text-cyber-teal/80"
              : isSideQuest
              ? "text-cyber-yellow hover:text-cyber-yellow/80"
              : "text-cyber-blue hover:text-cyber-blue/80"
          )}
          onClick={handleToggle}
          disabled={isPending}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="w-4 h-4 mr-1" />
              Completed
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 mr-1" />
              Mark Complete
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
