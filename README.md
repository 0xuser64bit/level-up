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

- **Penalties** are captured per task but not yet auto-applied for missed tasks —
  that needs a scheduled job (cron) which isn't wired up.
- **Streak/day boundaries** use the server's local day; multi-timezone
  correctness is not handled yet.
