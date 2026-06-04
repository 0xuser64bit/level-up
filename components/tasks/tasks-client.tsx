"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Terminal, TerminalLine } from "@/components/ui/terminal";
import { Textarea } from "@/components/ui/textarea";
import { RECURRENCE_OPTIONS } from "@/lib/recurrence";
import { createTask, deleteTask, updateTask } from "@/app/actions/tasks";
import type { RecurrencePattern } from "@/generated/prisma";

export interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  xpReward: number;
  penalty: number;
  recurring: boolean;
  pattern: RecurrencePattern;
  isSideQuest: boolean;
}

function PatternSelect({ defaultValue }: { defaultValue: RecurrencePattern }) {
  return (
    <Select name="pattern" defaultValue={defaultValue}>
      <SelectTrigger className="cyber-input">
        <SelectValue placeholder="Select pattern" />
      </SelectTrigger>
      <SelectContent>
        {RECURRENCE_OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function TasksClient({ initialTasks }: { initialTasks: TaskRow[] }) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [editing, setEditing] = useState<TaskRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const run = (action: () => Promise<{ ok: boolean; error?: string }>) => {
    setError(null);
    startTransition(async () => {
      const res = await action();
      if (!res.ok) {
        setError(res.error ?? "Something went wrong");
        return;
      }
      setIsCreating(false);
      setEditing(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="cyber-heading text-2xl md:text-3xl">Task Management</h1>

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="cyber-button">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="cyber-panel">
            <DialogHeader>
              <DialogTitle className="cyber-heading text-xl">
                Create New Task
              </DialogTitle>
            </DialogHeader>
            <form action={(fd) => run(() => createTask(fd))} className="space-y-4 mt-4">
              <TaskFields />
              {error && (
                <p className="text-sm font-mono text-cyber-pink">{error}</p>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="cyber-button" disabled={isPending}>
                  {isPending ? "Saving..." : "Create Task"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
          <DialogContent className="cyber-panel">
            <DialogHeader>
              <DialogTitle className="cyber-heading text-xl">Edit Task</DialogTitle>
            </DialogHeader>
            {editing && (
              <form action={(fd) => run(() => updateTask(fd))} className="space-y-4 mt-4">
                <input type="hidden" name="taskId" value={editing.id} />
                <TaskFields task={editing} />
                {error && (
                  <p className="text-sm font-mono text-cyber-pink">{error}</p>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" className="cyber-button" disabled={isPending}>
                    {isPending ? "Saving..." : "Update Task"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Terminal title="TASK DATABASE" className="mb-6">
        <TerminalLine className="mb-2">
          Total tasks:{" "}
          <span className="text-cyber-blue">{initialTasks.length}</span>
        </TerminalLine>
        <TerminalLine>
          Recurring tasks:{" "}
          <span className="text-cyber-blue">
            {initialTasks.filter((t) => t.recurring).length}
          </span>
        </TerminalLine>
      </Terminal>

      <div className="cyber-panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-mono text-cyber-blue">Title</TableHead>
              <TableHead className="font-mono text-cyber-blue">Description</TableHead>
              <TableHead className="font-mono text-cyber-blue">XP Reward</TableHead>
              <TableHead className="font-mono text-cyber-blue">Recurring</TableHead>
              <TableHead className="font-mono text-cyber-blue">Pattern</TableHead>
              <TableHead className="font-mono text-cyber-blue w-[100px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialTasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground font-mono"
                >
                  No tasks found. Create your first task to begin.
                </TableCell>
              </TableRow>
            ) : (
              initialTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {task.description ? (
                      task.description.length > 50 ? (
                        `${task.description.substring(0, 50)}...`
                      ) : (
                        task.description
                      )
                    ) : (
                      <span className="text-muted-foreground/50">No description</span>
                    )}
                  </TableCell>
                  <TableCell className="text-cyber-blue">+{task.xpReward} XP</TableCell>
                  <TableCell>
                    {task.recurring ? (
                      <span className="text-cyber-teal">Yes</span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">
                      {task.pattern === "NONE"
                        ? "-"
                        : task.pattern.toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditing(task)}
                      >
                        <Edit className="h-4 w-4 text-cyber-blue" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isPending}
                        onClick={() => run(() => deleteTask(task.id))}
                      >
                        <Trash2 className="h-4 w-4 text-cyber-pink" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Shared form fields for create + edit. `task` pre-fills for edits.
function TaskFields({ task }: { task?: TaskRow }) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-mono text-white/70">
          Title
        </Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={task?.title}
          className="cyber-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-mono text-white/70">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={task?.description ?? ""}
          className="cyber-input min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="xpReward" className="text-sm font-mono text-white/70">
            XP Reward
          </Label>
          <Input
            id="xpReward"
            name="xpReward"
            type="number"
            min={1}
            defaultValue={task?.xpReward ?? 10}
            className="cyber-input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="penalty" className="text-sm font-mono text-white/70">
            XP Penalty
          </Label>
          <Input
            id="penalty"
            name="penalty"
            type="number"
            min={0}
            defaultValue={task?.penalty ?? 5}
            className="cyber-input"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="recurring"
            name="recurring"
            value="true"
            defaultChecked={task?.recurring}
          />
          <Label htmlFor="recurring" className="text-sm font-mono text-white/70">
            Recurring
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="isSideQuest"
            name="isSideQuest"
            value="true"
            defaultChecked={task?.isSideQuest}
          />
          <Label htmlFor="isSideQuest" className="text-sm font-mono text-white/70">
            Side Quest
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pattern" className="text-sm font-mono text-white/70">
          Recurrence Pattern
        </Label>
        <PatternSelect defaultValue={task?.pattern ?? "NONE"} />
      </div>
    </>
  );
}
