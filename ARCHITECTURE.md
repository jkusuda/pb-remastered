# Pokebrowser — Architecture Plan

## Overview

Pokebrowser is a Pokémon Go-style experience for web browsing. Pokémon appear while users browse the web (via a browser extension), and caught Pokémon are stored in a central database accessible through a companion website.

**Phase 1 (current):** Build the website with auth, trainer profiles, and a Pokédex viewer.
**Phase 2 (later):** Build the browser extension that triggers encounters and talks to the same backend.

---

## Tech Stack

| Layer         | Technology                     |
|---------------|--------------------------------|
| Framework     | Next.js 14 (App Router)        |
| Language      | TypeScript                     |
| Styling       | Tailwind CSS                   |
| UI Components | shadcn/ui                      |
| Icons         | Lucide React                   |
| Backend / DB  | Supabase (Postgres + Auth)     |
| Auth          | Supabase Auth (Email, Google)  |
| Pokémon Data  | PokéAPI (first 151)            |
| Deployment    | Vercel (future)                |

---

## Supabase Schema

### `profiles` table
Extends Supabase Auth's built-in `auth.users`. Created automatically via a database trigger on sign-up.

| Column              | Type        | Notes                              |
|---------------------|-------------|------------------------------------|
| id                  | uuid (PK)   | References `auth.users.id`         |
| trainer_name        | text         | Chosen display name                |
| avatar_url          | text         | Profile picture URL                |
| favourite_pokemon   | int          | Pokédex number (1–151)             |
| total_caught        | int          | Running total of Pokémon caught    |
| xp                  | int          | Experience points                  |
| level               | int          | Derived from XP thresholds         |
| created_at          | timestamptz  | Join date                          |
| updated_at          | timestamptz  | Last profile update                |

### `caught_pokemon` table
Tracks each unique Pokémon species a trainer has caught (Pokédex entries).

| Column              | Type        | Notes                              |
|---------------------|-------------|------------------------------------|
| id                  | uuid (PK)   | Auto-generated                     |
| user_id             | uuid (FK)   | References `profiles.id`           |
| pokedex_number      | int          | 1–151                              |
| caught_count        | int          | Times this species was caught      |
| first_caught_at     | timestamptz  | When first encountered             |
| updated_at          | timestamptz  | Last catch timestamp               |

*Unique constraint on `(user_id, pokedex_number)`*

### `candies` table
Tracks candy per Pokémon species for a trainer (for future evolution/power-up mechanics).

| Column              | Type        | Notes                              |
|---------------------|-------------|------------------------------------|
| id                  | uuid (PK)   | Auto-generated                     |
| user_id             | uuid (FK)   | References `profiles.id`           |
| pokedex_number      | int          | 1–151                              |
| amount              | int          | Candy count                        |

*Unique constraint on `(user_id, pokedex_number)`*

---

## Row Level Security (RLS)

All tables have RLS enabled:

- **profiles:** Users can read any profile (public). Users can update only their own.
- **caught_pokemon:** Users can read/insert/update only their own rows.
- **candies:** Users can read/insert/update only their own rows.

---

## Folder Structure (Next.js App Router)

```
pb-remastered/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout (providers, global styles)
│   │   ├── page.tsx              # Landing / home page
│   │   ├── login/
│   │   │   └── page.tsx          # Login page (email + Google)
│   │   ├── signup/
│   │   │   └── page.tsx          # Sign-up page
│   │   ├── profile/
│   │   │   └── page.tsx          # Trainer profile (protected)
│   │   ├── pokedex/
│   │   │   └── page.tsx          # Pokédex grid (protected)
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts      # OAuth callback handler
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── auth/                 # Auth forms (login, signup)
│   │   ├── profile/              # Trainer card, edit form
│   │   └── pokedex/              # Pokédex grid, entry card
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser Supabase client
│   │   │   ├── server.ts         # Server Supabase client
│   │   │   └── middleware.ts     # Auth middleware helper
│   │   ├── pokemon.ts            # PokéAPI helpers (fetch sprite, name, etc.)
│   │   └── xp.ts                 # XP / level calculation utils
│   ├── types/
│   │   └── index.ts              # TypeScript types (Profile, CaughtPokemon, etc.)
│   └── middleware.ts             # Next.js middleware (protect routes)
├── supabase/
│   └── schema.sql                # Full database schema + RLS policies
├── public/                       # Static assets
├── .env.local.example            # Environment variable template
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## Auth Flow

1. **Sign up:** User creates account with email/password or Google OAuth.
2. **Trigger:** Supabase DB trigger auto-creates a row in `profiles` with defaults.
3. **Session:** Supabase Auth manages JWT sessions via cookies (using `@supabase/ssr`).
4. **Middleware:** Next.js middleware checks session on protected routes (`/profile`, `/pokedex`). Redirects to `/login` if unauthenticated.
5. **OAuth callback:** `/auth/callback` route exchanges the code for a session.

---

## Trainer Profile Page

Displays:
- **Trainer name** (editable)
- **Avatar** (upload or URL, editable)
- **Favourite Pokémon** (picker from caught Pokémon, shows sprite)
- **Trainer level & XP** (calculated from `xp` field using threshold table)
- **Total Pokémon caught** (from `total_caught`)
- **Pokédex completion** (unique species caught / 151, shown as ratio + progress bar)
- **Join date** (from `created_at`)

---

## Key Design Decisions

1. **Website first, extension later.** The website owns all data and auth. The extension will authenticate via the same Supabase session/token and call the same DB.
2. **Supabase handles auth + DB + RLS.** No custom backend needed. Next.js API routes or server actions can be added later if needed.
3. **PokéAPI for static Pokémon data.** Sprites, names, and types come from PokéAPI. We only store what the trainer has caught, not Pokémon metadata.
4. **Gen 1 only (151).** Keeps scope tight for now.
5. **Simple XP system.** Catching a Pokémon = XP. New species = bonus XP. Level thresholds are a simple array in code.

---

## What's NOT in scope yet

- Browser extension
- Encounter/catch mechanics (ball throwing, catch rates)
- Evolution system
- Trading
- Leaderboards
- Friend system
