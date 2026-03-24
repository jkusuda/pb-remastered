import type { PokemonInfo } from "@/types";

const POKEAPI_BASE = "https://pokeapi.co/api/v2";

export async function getPokemonInfo(pokedexNumber: number): Promise<PokemonInfo> {
  const [pokemonRes, speciesRes] = await Promise.all([
    fetch(`${POKEAPI_BASE}/pokemon/${pokedexNumber}`),
    fetch(`${POKEAPI_BASE}/pokemon-species/${pokedexNumber}`)
  ]);

  if (!pokemonRes.ok) throw new Error(`Failed to fetch Pokémon #${pokedexNumber}`);
  if (!speciesRes.ok) throw new Error(`Failed to fetch Pokémon species #${pokedexNumber}`);

  const [data, speciesData] = await Promise.all([
    pokemonRes.json(),
    speciesRes.json()
  ]);

  const getStat = (name: string) => data.stats.find((s: any) => s.stat.name === name)?.base_stat || 0;

  const flavorTextEntry = speciesData.flavor_text_entries.find(
    (entry: any) => entry.language.name === "en"
  );
  
  const description = flavorTextEntry 
    ? flavorTextEntry.flavor_text.replace(/[\n\f\t\v\r]/g, " ") 
    : "No description available.";

  return {
    id: data.id,
    name: data.name,
    sprite: data.sprites.front_default,
    types: data.types.map((t: { type: { name: string } }) => t.type.name),
    description,
    baseStats: {
      hp: getStat("hp"),
      atk: getStat("attack"),
      def: getStat("defense"),
      spAtk: getStat("special-attack"),
      spDef: getStat("special-defense"),
      speed: getStat("speed"),
    },
  };
}

export function getPokemonSprite(pokedexNumber: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokedexNumber}.png`;
}

export function getPokemonOfficialArt(pokedexNumber: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokedexNumber}.png`;
}
