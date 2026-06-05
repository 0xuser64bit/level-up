# Level Up

A _Solo Leveling_–inspired productivity **SYSTEM**. Define daily quests, check
them off to earn XP, build streaks, and climb the hunter ranks (E → S).

<p align="center">
  <img src="public/level-up.png" alt="Level Up" width="400" />
</p>

## Stack

- Next.js 15 (App Router, React 19) + Turbopack
- PostgreSQL via Prisma 6
- NextAuth v4 (Google OAuth, JWT sessions)
- Tailwind v4 + shadcn/ui
- Bun (package manager + test runner)

## How it works

- **Task** — a reusable template you own (recurring or one-off).
- **DailyTask** — a concrete instance of a task for a given day; this is what you
  check off. XP/penalty are snapshotted so editing a template doesn't rewrite
  history. Today's instances are generated lazily on first dashboard load.
- **Mission** — the daily meta-goal: finish everything today for a bonus.
- **XP / level / streak / rank** — all computed server-side in `lib/leveling.ts`
  (unit-tested). Level = `floor(xp / 100) + 1`; rank is derived from level.
  Clients never set their own XP.
- **Daily settlement** (`lib/settlement.ts`) — when you return, the SYSTEM judges
  every day that has fully elapsed since your last visit: it deducts the
  snapshotted penalty for each missed quest, breaks your streak honestly, and
  shows a one-time **Daily Assessment**. Penalties never drop you below your
  current level's floor, so a hard-won rank is never stripped (level/rank only
  ever climb). Settlement is idempotent — each missed quest is stamped
  `settledAt` so it can never be charged twice. Runs on any protected page load;
  no cron required.
- **Feedback layer** — completing quests fires optimistic checks, floating
  `+XP`, toasts, achievement unlocks, and full-screen level-up / rank-up
  celebrations (`components/feedback/system-feedback.tsx`).
- **Activity log** — a 30-day consistency heatmap on the profile
  (`lib/stats.ts`).

## Getting started

```bash
bun install                 # also runs `prisma generate` via postinstall
cp .env.example .env         # then fill in the values (see below)

# Bring up Postgres — use a local server or:
docker compose up -d

bun run db:migrate           # apply migrations
bun run db:seed              # optional: a demo hunter + sample tasks
bun run dev                  # http://localhost:3000
```

### Environment

| Variable               | Required | Notes                                            |
| ---------------------- | -------- | ------------------------------------------------ |
| `DATABASE_URL`         | yes      | Postgres connection string                       |
| `NEXTAUTH_SECRET`      | yes      | `openssl rand -base64 32`                        |
| `NEXTAUTH_URL`         | yes      | `http://localhost:3000` in dev                   |
| `GOOGLE_CLIENT_ID`     | yes      | Google OAuth client                              |
| `GOOGLE_CLIENT_SECRET` | yes      | Authorized redirect: `/api/auth/callback/google` |

## Scripts

| Script               | Description                        |
| -------------------- | ---------------------------------- |
| `bun run dev`        | Dev server (Turbopack)             |
| `bun run build`      | Production build                   |
| `bun test`           | Unit tests (leveling + recurrence) |
| `bun run db:migrate` | Create/apply a migration           |
| `bun run db:seed`    | Seed demo data                     |
| `bun run db:studio`  | Prisma Studio                      |

## Known limitations

- **Time zones.** Day boundaries (settlement, streaks, the daily board) use the
  server's local day. Per-user time zones aren't handled yet — a user far from
  the server's zone may see a day roll over at an unexpected hour.
- **Settlement is visit-driven.** Penalties apply the next time you open the app,
  not at midnight. For real-time enforcement (e.g. a leaderboard) you'd add a
  cron that calls `settleUser` for all users; the logic is already idempotent.
