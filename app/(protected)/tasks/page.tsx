import { TasksClient } from "@/components/tasks/tasks-client";
import { requireOnboardedUser } from "@/lib/session";
import db from "@/lib/db";

export default async function TasksPage() {
  const user = await requireOnboardedUser();
  const tasks = await db.task.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return <TasksClient initialTasks={tasks} />;
}
