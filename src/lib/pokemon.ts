// Re-exports static Pokémon data from the shared package.
// No more PokeAPI calls — all lookups are instant.

export { getPokemonData, getPokemonName, getFamilyId } from "pokemon-data";
export type { PokemonData } from "pokemon-data";

export const TRAINER_BASE = "https://play.pokemonshowdown.com/sprites/trainers";

export function getPokemonSprite(pokedexNumber: number): string {
  return `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/versions/generation-v/black-white/animated/${pokedexNumber}.gif`;
}

export function getPokedexSprite(pokedexNumber: number): string {
  return `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/${pokedexNumber}.png`;
}