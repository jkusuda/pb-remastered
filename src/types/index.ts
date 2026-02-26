export interface Profile {
  id: string;
  trainer_name: string;
  avatar_url: string | null;
  favourite_pokemon: number | null;
  total_caught: number;
  xp: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface CaughtPokemon {
  id: string;
  user_id: string;
  pokedex_number: number;
  caught_count: number;
  first_caught_at: string;
  updated_at: string;
}

export interface Candy {
  id: string;
  user_id: string;
  pokedex_number: number;
  amount: number;
}

export interface PokemonInfo {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}
