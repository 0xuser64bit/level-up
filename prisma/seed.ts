import { PrismaClient } from "../generated/prisma";

const db = new PrismaClient();

// Seeds a demo hunter with a handful of task templates so a fresh local
// database isn't empty. Safe to run repeatedly (idempotent on email).
async function main() {
  const email = "demo@level-up.dev";

  const user = await db.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Demo Hunter",
      username: "demo_hunter",
      xp: 275,
      level: 3,
      currentStreak: 5,
      longestStreak: 7,
    },
  });

  // Reset this user's templates so the seed is deterministic.
  await db.task.deleteMany({ where: { userId: user.id } });

  await db.task.createMany({
    data: [
      {
        userId: user.id,
        title: "Complete coding challenge",
        description: "Finish the daily algorithm challenge.",
        xpReward: 20,
        penalty: 10,
        recurring: true,
        pattern: "DAILY",
      },
      {
        userId: user.id,
        title: "Exercise",
        description: "30 minutes of physical activity.",
        xpReward: 15,
        penalty: 5,
        recurring: true,
        pattern: "WEEKDAYS",
      },
      {
        userId: user.id,
        title: "Read documentation",
        description: "Read technical docs for 20 minutes.",
        xpReward: 10,
        penalty: 5,
        recurring: false,
        pattern: "NONE",
      },
      {
        userId: user.id,
        title: "Meditate",
        description: "10 minutes of mindfulness.",
        xpReward: 15,
        penalty: 5,
        recurring: true,
        pattern: "DAILY",
        isSideQuest: true,
      },
    ],
  });

  console.log(`Seeded ${user.email} with task templates.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
