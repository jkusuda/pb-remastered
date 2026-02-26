-- ============================================================
-- Step 1: pokemon table first (users references it)
-- ============================================================

CREATE TABLE public.pokemon (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pokedex_number INTEGER NOT NULL CHECK (pokedex_number BETWEEN 1 AND 151),
  nickname       TEXT,
  is_shiny       BOOLEAN NOT NULL DEFAULT FALSE,
  caught_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  caught_on      TEXT
);

-- ============================================================
-- Step 2: users table (can now safely reference pokemon)
-- ============================================================

CREATE TABLE public.users (
  id                  UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  trainer_name        TEXT NOT NULL,
  favorite_pokemon_id UUID REFERENCES public.pokemon(id) ON DELETE SET NULL,
  level               INTEGER NOT NULL DEFAULT 1,
  xp                  INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Step 3: candies table
-- ============================================================

CREATE TABLE public.candies (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pokedex_number INTEGER NOT NULL CHECK (pokedex_number BETWEEN 1 AND 151),
  count          INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, pokedex_number)  -- fixed: was referencing wrong column name
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pokemon ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candies ENABLE ROW LEVEL SECURITY;

-- Users
CREATE POLICY "users: viewable by everyone"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "users: insert own row"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users: update own row"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Pokemon
CREATE POLICY "pokemon: select own"
  ON public.pokemon FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "pokemon: insert own"
  ON public.pokemon FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "pokemon: update own"
  ON public.pokemon FOR UPDATE
  USING (auth.uid() = user_id);

-- Candies
CREATE POLICY "candies: select own"
  ON public.candies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "candies: insert own"
  ON public.candies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "candies: update own"
  ON public.candies FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- Trigger: auto-create user row on signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, trainer_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'trainer_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();