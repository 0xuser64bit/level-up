// Demo user
export const demoUser = {
  id: 1,
  username: "commander_shepard",
  email: "shepard@alliance.gov",
};

// Demo user progress
export const demoProgress = {
  id: 1,
  user_id: 1,
  xp: 275,
  level: 3,
  current_streak: 5,
  longest_streak: 7,
  last_active_date: new Date().toISOString().split("T")[0],
};

// Demo tasks
export const demoTasks = [
  {
    id: 1,
    user_id: 1,
    title: "Complete coding challenge",
    description: "Finish the daily algorithm challenge on CodeWars",
    xp_reward: 20,
    xp_penalty: 10,
    is_recurring: true,
    recurrence_pattern: "daily",
  },
  {
    id: 2,
    user_id: 1,
    title: "Exercise",
    description:
      "30 minutes of physical activity to maintain optimal performance",
    xp_reward: 15,
    xp_penalty: 5,
    is_recurring: true,
    recurrence_pattern: "weekdays",
  },
  {
    id: 3,
    user_id: 1,
    title: "Read documentation",
    description:
      "Read technical documentation for 20 minutes to expand knowledge base",
    xp_reward: 10,
    xp_penalty: 5,
    is_recurring: false,
    recurrence_pattern: null,
  },
  {
    id: 4,
    user_id: 1,
    title: "Meditate",
    description:
      "10 minutes of mindfulness meditation to optimize neural pathways",
    xp_reward: 15,
    xp_penalty: 5,
    is_recurring: true,
    recurrence_pattern: "daily",
  },
  {
    id: 5,
    user_id: 1,
    title: "Project planning",
    description: "Update project roadmap and prioritize next development tasks",
    xp_reward: 25,
    xp_penalty: 10,
    is_recurring: true,
    recurrence_pattern: "monday",
  },
];

// Demo daily tasks
export const demoDailyTasks = [
  {
    id: 1,
    task_id: 1,
    user_id: 1,
    date: new Date().toISOString().split("T")[0],
    is_completed: true,
    completed_at: new Date().toISOString(),
    is_side_quest: false,
    title: "Complete coding challenge",
    description: "Finish the daily algorithm challenge on CodeWars",
    xp_reward: 20,
    xp_penalty: 10,
  },
  {
    id: 2,
    task_id: 2,
    user_id: 1,
    date: new Date().toISOString().split("T")[0],
    is_completed: false,
    completed_at: null,
    is_side_quest: false,
    title: "Exercise",
    description:
      "30 minutes of physical activity to maintain optimal performance",
    xp_reward: 15,
    xp_penalty: 5,
  },
  {
    id: 3,
    task_id: 4,
    user_id: 1,
    date: new Date().toISOString().split("T")[0],
    is_completed: false,
    completed_at: null,
    is_side_quest: false,
    title: "Meditate",
    description:
      "10 minutes of mindfulness meditation to optimize neural pathways",
    xp_reward: 15,
    xp_penalty: 5,
  },
  {
    id: 4,
    task_id: 999,
    user_id: 1,
    date: new Date().toISOString().split("T")[0],
    is_completed: false,
    completed_at: null,
    is_side_quest: true,
    title: "Optimize hydration levels",
    description:
      "Consume 2 liters of water throughout the day for peak biological function",
    xp_reward: 25,
    xp_penalty: 0,
  },
];

// Demo daily mission
export const demoDailyMission = {
  id: 1,
  user_id: 1,
  title: "Daily Mission: Performance Evaluation",
  description: "Complete all assigned tasks to prove your worth to the System.",
  xp_reward: 50,
  date: new Date().toISOString().split("T")[0],
  is_completed: false,
  completed_at: null,
};

// Demo data access functions
export function getDemoUser() {
  return demoUser;
}

export function getDemoProgress() {
  return demoProgress;
}

export function getDemoTasks() {
  return demoTasks;
}

export function getDemoDailyTasks() {
  return demoDailyTasks;
}

export function getDemoDailyMission() {
  return demoDailyMission;
}

// Demo data mutation functions
export function completeDemoTask(taskId: number) {
  const taskIndex = demoDailyTasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    demoDailyTasks[taskIndex].is_completed = true;
    demoDailyTasks[taskIndex].completed_at = new Date().toISOString();

    // Add XP to user
    demoProgress.xp += demoDailyTasks[taskIndex].xp_reward;

    return demoDailyTasks[taskIndex];
  }
  return null;
}

export function uncompleteDemoTask(taskId: number) {
  const taskIndex = demoDailyTasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    demoDailyTasks[taskIndex].is_completed = false;
    demoDailyTasks[taskIndex].completed_at = null;

    // Remove XP from user
    demoProgress.xp -= demoDailyTasks[taskIndex].xp_reward;

    return demoDailyTasks[taskIndex];
  }
  return null;
}

export function completeDemoMission() {
  demoDailyMission.is_completed = true;
  // demoDailyMission?.completed_at = new Date().toISOString();

  // Add XP to user
  demoProgress.xp += demoDailyMission.xp_reward;
  return demoDailyMission;
}

export function createDemoTask(taskData: any) {
  const newTask = {
    id: demoTasks.length + 1,
    user_id: 1,
    ...taskData,
  };

  demoTasks.push(newTask);
  return newTask;
}

export function updateDemoTask(taskId: number, taskData: any) {
  const taskIndex = demoTasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    demoTasks[taskIndex] = {
      ...demoTasks[taskIndex],
      ...taskData,
    };
    return demoTasks[taskIndex];
  }
  return null;
}

export function deleteDemoTask(taskId: number) {
  const taskIndex = demoTasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    demoTasks.splice(taskIndex, 1);
    return true;
  }
  return false;
}
