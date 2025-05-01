"use client";

import SystemLoader from "@/components/loader/system-loader";
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
import { getDemoTasks, getDemoUser } from "@/lib/demo-data";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function TasksPage() {
  // Todo: replace with real data
  const user = getDemoUser();
  const initialTasks = getDemoTasks();

  return <TasksClient initialTasks={initialTasks} userId={user.id} />;
}

function TasksClient({
  initialTasks,
  userId,
}: {
  initialTasks: any[];
  userId: number;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  const handleCreate = async (formData: FormData) => {
    formData.append("userId", userId.toString());
    console.log("userId", userId);
    console.log("task created successfully");
  };

  const handleUpdate = async (formData: FormData) => {
    console.log("task updated successfully");
  };

  const handleDelete = async (taskId: number) => {
    const formData = new FormData();
    formData.append("taskId", taskId.toString());

    console.log("task deleted successfully");
  };

  const openEditDialog = (task: any) => {
    setCurrentTask(task);
    setIsEditing(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMounted(true);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <SystemLoader hunterLevel="E" />;
  }

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

            <form action={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-mono text-white/70"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  required
                  className="cyber-input"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-mono text-white/70"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  className="cyber-input min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="xpReward"
                    className="text-sm font-mono text-white/70"
                  >
                    XP Reward
                  </Label>
                  <Input
                    id="xpReward"
                    name="xpReward"
                    type="number"
                    defaultValue="10"
                    className="cyber-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="xpPenalty"
                    className="text-sm font-mono text-white/70"
                  >
                    XP Penalty
                  </Label>
                  <Input
                    id="xpPenalty"
                    name="xpPenalty"
                    type="number"
                    defaultValue="5"
                    className="cyber-input"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="isRecurring" name="isRecurring" value="true" />
                <Label
                  htmlFor="isRecurring"
                  className="text-sm font-mono text-white/70"
                >
                  Recurring Task
                </Label>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="recurrencePattern"
                  className="text-sm font-mono text-white/70"
                >
                  Recurrence Pattern
                </Label>
                <Select name="recurrencePattern" defaultValue="none">
                  <SelectTrigger className="cyber-input">
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekdays">Weekdays</SelectItem>
                    <SelectItem value="weekends">Weekends</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="cyber-button">
                  Create Task
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="cyber-panel">
            <DialogHeader>
              <DialogTitle className="cyber-heading text-xl">
                Edit Task
              </DialogTitle>
            </DialogHeader>

            {currentTask && (
              <form action={handleUpdate} className="space-y-4 mt-4">
                <input type="hidden" name="taskId" value={currentTask.id} />

                <div className="space-y-2">
                  <Label
                    htmlFor="edit-title"
                    className="text-sm font-mono text-white/70"
                  >
                    Title
                  </Label>
                  <Input
                    id="edit-title"
                    name="title"
                    defaultValue={currentTask.title}
                    required
                    className="cyber-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit-description"
                    className="text-sm font-mono text-white/70"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={currentTask.description || ""}
                    className="cyber-input min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-xpReward"
                      className="text-sm font-mono text-white/70"
                    >
                      XP Reward
                    </Label>
                    <Input
                      id="edit-xpReward"
                      name="xpReward"
                      type="number"
                      defaultValue={currentTask.xp_reward}
                      className="cyber-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-xpPenalty"
                      className="text-sm font-mono text-white/70"
                    >
                      XP Penalty
                    </Label>
                    <Input
                      id="edit-xpPenalty"
                      name="xpPenalty"
                      type="number"
                      defaultValue={currentTask.xp_penalty}
                      className="cyber-input"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isRecurring"
                    name="isRecurring"
                    value="true"
                    defaultChecked={currentTask.is_recurring}
                  />
                  <Label
                    htmlFor="edit-isRecurring"
                    className="text-sm font-mono text-white/70"
                  >
                    Recurring Task
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit-recurrencePattern"
                    className="text-sm font-mono text-white/70"
                  >
                    Recurrence Pattern
                  </Label>
                  <Select
                    name="recurrencePattern"
                    defaultValue={currentTask.recurrence_pattern || "none"}
                  >
                    <SelectTrigger className="cyber-input">
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekdays">Weekdays</SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" className="cyber-button">
                    Update Task
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Terminal title="TASK DATABASE" className="mb-6">
        <TerminalLine className="mb-2">
          Total tasks: <span className="text-cyber-blue">{tasks.length}</span>
        </TerminalLine>
        <TerminalLine>
          Recurring tasks:{" "}
          <span className="text-cyber-blue">
            {tasks.filter((task) => task.is_recurring).length}
          </span>
        </TerminalLine>
      </Terminal>

      <div className="cyber-panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-mono text-cyber-blue">Title</TableHead>
              <TableHead className="font-mono text-cyber-blue">
                Description
              </TableHead>
              <TableHead className="font-mono text-cyber-blue">
                XP Reward
              </TableHead>
              <TableHead className="font-mono text-cyber-blue">
                Recurring
              </TableHead>
              <TableHead className="font-mono text-cyber-blue">
                Pattern
              </TableHead>
              <TableHead className="font-mono text-cyber-blue w-[100px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground font-mono"
                >
                  No tasks found. Create your first task to begin.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
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
                      <span className="text-muted-foreground/50">
                        No description
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-cyber-blue">
                    +{task.xp_reward} XP
                  </TableCell>
                  <TableCell>
                    {task.is_recurring ? (
                      <span className="text-cyber-teal">Yes</span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.recurrence_pattern ? (
                      <span className="capitalize">
                        {task.recurrence_pattern}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(task)}
                      >
                        <Edit className="h-4 w-4 text-cyber-blue" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(task.id)}
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
