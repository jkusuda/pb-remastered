# Pokebrowser — Architecture

## Overview

Pokebrowser is a Pokémon Go-style experience for web browsing. Pokémon appear while users browse the web (via a browser extension), and caught Pokémon are stored in a central database accessible through a companion website.

**Phase 1 (complete):** Website with auth, trainer profiles, Pokédex viewer.
**Phase 2 (next):** Browser extension that triggers encounters and writes to the same Supabase backend.

---

## Tech Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Framework     | Next.js 14 (App Router)             |
| Language      | TypeScript                          |
| Styling       | Tailwind CSS v4                     |
| UI Components | shadcn/ui                           |
| Backend / DB  | Supabase (Postgres + Auth)          |
| Auth          | Supabase Auth (Email + Google OAuth)|
| Trainer Sprites | Pokémon Showdown sprite CDN       |
| Pokémon Data  | PokéAPI (Gen 1, first 151)          |
| Deployment    | Vercel (planned)                    |

---

## Supabase Schema

### `pokemon` table
One row per caught Pokémon instance per trainer.

| Column         | Type        | Notes                              |
|----------------|-------------|------------------------------------|
| id             | uuid (PK)   | Auto-generated                     |
| user_id        | uuid (FK)   | References `auth.users.id`         |
| pokedex_number | int         | 1–151                              |
| nickname       | text        | Optional trainer-given name        |
| is_shiny       | bool        | Whether the catch was shiny        |
| caught_at      | timestamptz | Timestamp of catch                 |
| caught_on      | text        | Website URL where caught (Phase 2) |

### `users` table
Trainer profile. Auto-created on signup via trigger.

| Column              | Type        | Notes                                     |
|---------------------|-------------|-------------------------------------------|
| id                  | uuid (PK)   | References `auth.usersid`                |
| trainer_name        | text        | Displayname                              |
| avatar_id           | text        | Pokémon Showdown trainer sprite key (e.g. `ash`) |
| friend_code         | text        | Unique 8-char alphanumeric code           |
| favorite_pokemon_id | uuid (FK)   | References `pokemon.id`, nullable         |
| level               | int         | Trainer level (derived from XP)           |
| xp                  | int         | Total experience points                   |
| created_at          | timestamptz | Join date                                 |

### `candies` table
Candy count per species per trainer (for future mechanics).

| Column         | Type        | Notes                        |
|----------------|-------------|------------------------------|
| id             | uuid (PK)   | Auto-generated               |
| user_id        | uuid (FK)   | References `auth.users.id`   |
| pokedex_number | int         | 1–151                        |
| count          | int         | Candy count                  |

*Unique constraint on `(user_id, pokedex_number)`*

### `friends` table
Friend relationships between trainers.

| Column    | Type        | Notes                                          |
|-----------|-------------|------------------------------------------------|
| id        | uuid (PK)   | Auto-generated                                 |
| user_id   | uuid (FK)   | Requester — references `auth.users.id`         |
| friend_id | uuid (FK)   | Recipient — references `auth.users.id`         |
| status    | text        | `pending` or `accepted`                        |
| created_at| timestamptz | When request was sent                          |

*Unique constraint on `(user_id, friend_id)`*

---

## Row Level Security (RLS)

All tables have RLS enabled. All policies are owner-only unless noted:

- **pokemon:** select/insert/update/delete own rows only
- **users:** select any row (public profiles), update own row only
- **candies:** select/insert/update own rows only
- **friends:** select rows where `user_id = auth.uid()` OR `friend_id = auth.uid()`; insert where `user_id = auth.uid()`; update where either party

---

## Signup Trigger

On `auth.users` insert, a trigger auto-creates a `users` row:
- `trainer_name`: from `raw_user_meta_data->>'trainer_name'` or email prefix
- `avatar_id`: defaults to `'ash'`
- `friend_code`: `upper(substr(md5(random()::text), 1, 8))` — e.g. `A3F7K2B9`

---

## Auth Flow

1. User clicks **LOGIN** or **VIEW POKÉDEX** on the landing page → modal opens (`?modal=login`)
2. User signs up or logs in (email/password or Google OAuth)
3. On success, `router.push("/profile")` + `router.refresh()` — Server Components re-run, session cookie is live
4. Google OAuth: redirects to `/auth/callback`, exchanges code for session, redirects to `/profile`
5. Middleware on every request: refreshes session cookie, redirects unauthenticated users away from `/profile` and `/pokedex` back to `/?modal=login`
6. `/signup` and `/login` both redirect to `/?modal=login` (modal is the canonical auth entry point)

---

## Folder Structure

```
pb-remastered/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Landing page (Server Component, reads ?modal=login)
│   │   ├── globals.css                 # Global styles + .scanlines utility
│   │   ├── login/page.tsx              # Redirects to /?modal=login
│   │   ├── signup/page.tsx             # Redirects to /?modal=login
│   │   ├── profile/page.tsx            # Trainer profile (protected, Server Component)
│   │   ├── pokedex/page.tsx            # Pokédex grid (protected, TODO)
│   │   └── auth/callback/route.ts      # OAuth callback handler
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthForm.tsx            # Login/signup form (email + Google)
│   │   │   └── AuthModal.tsx           # Modal wrapper (backdrop, close, Escape key)
│   │   ├── landing/
│   │   │   ├── LandingNav.tsx          # Nav bar (LOGIN ↔ VIEW PROFILE button)
│   │   │   └── LandingHero.tsx         # Hero section (title, buttons)
│   │   ├── profile/
│   │   │   ├── ProfileContent.tsx      # Client Component — owns tab state, full layout
│   │   │   ├── ProfileNav.tsx          # Tab nav buttons (client-side switching)
│   │   │   ├── TrainerCard.tsx         # Trainer sprite + name + edit button
│   │   │   ├── EditProfileModal.tsx    # Edit trainer name + avatar picker
│   │   │   └── tabs/
│   │   │       ├── CollectionTab.tsx   # Caught Pokémon grid
│   │   │       └── FriendsTab.tsx      # Friends list (accepted + pending)
│   │   └── ui/
│   │       └── PokeballIcon.tsx        # Reusable Pokéball SVG
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts               # Browser Supabase client
│   │   │   ├── server.ts               # Server Supabase client
│   │   │   └── middleware.ts           # Session refresh + route protection
│   │   ├── pokemon.ts                  # PokéAPI helpers + sprite URL builders
│   │   ├── xp.ts                       # XP/level thresholds and calculations
│   │   └── styles.ts                   # Shared Tailwind class constants (BORDER, PIXEL)
│   ├── types/
│   │   └── index.ts                    # TypeScript interfaces (User, Pokemon, Friend, etc.)
│   └── middleware.ts                   # Next.js middleware entry point
├── supabase/
│   └── schema.sql                      # Full DB schema + RLS + trigger
├── public/
├── .env.local                          # NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
├── .env.local.example
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## Profile Page Architecture

The profile page uses a **Server → Client handoff** pattern:

1. `profile/page.tsx` (Server Component): authenticates user, fetches all data in parallel (`Promise.all`), passes everything to `ProfileContent`
2. `ProfileContent` (Client Component): owns `activeTab` state, renders `TrainerCard` + `ProfileNav` + right panel — tab switching is instant with zero server round-trips
3. `TrainerCard` (Client Component): renders trainer sprite + edit button, manages `EditProfileModal` open/close state
4. `EditProfileModal` (Client Component): saves to Supabase, calls `router.refresh()` to re-run Server Component and reflect changes

---

## Key Design Decisions

1. **Modal-first auth.** Login/signup is a URL-driven modal (`?modal=login`) rather than a separate page. Bookmarkable, no page navigation, falls back gracefully.
2. **Server Component data fetching.** All Supabase queries happen server-side. Client Components receive plain data as props — no client-side fetch waterfalls.
3. **Client-side tab switching.** All tab data fetched upfront; switching tabs is instant `useState`, no re-renders.
4. **Pokémon Showdown trainer sprites.** Avatars use `https://play.pokemonshowdown.com/sprites/trainers/{name}.png` — named keys stored as `avatar_id` (text).
5. **PokéAPI for Pokémon data.** Sprites, names, and types fetched on demand. Only catch metadata stored in DB.
6. **Gen 1 only (151).** Keeps scope tight for Phase 1.
7. **XP system in code.** Level thresholds in `src/lib/xp.ts`. XP is stored in DB, level computed client-side.
8. **Friend codes.** Auto-generated 8-char uppercase alphanumeric on signup. Used to add friends by lookup.
9. **Extension auth (Phase 2).** Extension will use the same Supabase anon key + user session token to write catches directly to the `pokemon` table. No separate backend needed.

---

## XP & Level System

- Base reward: **25 XP** per catch (`XP_PER_CATCH`)
- New species bonus: **+100 XP** (`XP_NEW_SPECIES_BONUS`)
- 20 levels, thresholds defined in `src/lib/xp.ts`
- `getXPProgress(xp)` returns `{ current, needed, percentage }` for progress bar display

---

## Phase 2: Browser Extension (Planned)

- Manifest V3 Chrome extension
- Content script detects page load → triggers random Pokémon encounter
- Popup UI for the catch mechanic (Pokéball throw)
- Authenticates via stored Supabase session token (user must be logged in on the website first)
- On successful catch: `INSERT` into `pokemon` table with `caught_on = window.location.hostname`
- Candy upsert: `INSERT INTO candies ... ON CONFLICT DO UPDATE SET count = count + 1`
- XP update: `UPDATE users SET xp = xp + ?, level = ?`

---

## What's NOT in scope yet

- Browser extension (Phase 2)
- Encounter/catch mechanics (Pokéball throw, catch rates)
- Pokédex page (next up)
- Evolution system
- Trading
- Leaderboards
- Stats / Achievements tab data
