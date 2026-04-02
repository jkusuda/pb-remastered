// public.users — trainer profile
export interface User {
  id: string;
  trainer_name: string;
  favorite_pokemon_id: string | null;
  avatar_id: string;
  friend_code: string;
  level: number;
  xp: number;
  created_at: string;
  catch_limit: number;
}

// public.friends — friend relationships
export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: "pending" | "accepted";
  created_at: string;
}

// public.pokemon — individual caught instance
export interface Pokemon {
  id: string;
  user_id: string;
  pokedex_number: number;
  nickname: string | null;
  is_shiny: boolean;
  caught_at: string;
  caught_on: string | null;
}

// public.candies — candy per species per trainer
export interface Candy {
  id: string;
  user_id: string;
  pokedex_number: number;
  count: number;
}

// public.pokedex — unlocked species history
export interface PokedexUnlock {
  user_id: string;
  pokedex_number: number;
  unlocked_at: string;
}

// Static Pokémon data — re-exported from the shared package
export type { PokemonData as PokemonInfo } from "pokemon-data";
