import type { PokemonInfo } from "@/types";

const POKEAPI_BASE = "https://pokeapi.co/api/v2";

export async function getPokemonInfo(pokedexNumber: number): Promise<PokemonInfo> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon/${pokedexNumber}`);
  if (!res.ok) throw new Error(`Failed to fetch Pokémon #${pokedexNumber}`);
  const data = await res.json();

  return {
    id: data.id,
    name: data.name,
    sprite: data.sprites.front_default,
    types: data.types.map((t: { type: { name: string } }) => t.type.name),
  };
}

export function getPokemonSprite(pokedexNumber: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokedexNumber}.png`;
}

export function getPokemonOfficialArt(pokedexNumber: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokedexNumber}.png`;
}
