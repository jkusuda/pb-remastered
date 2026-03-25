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

  // ── Fetch evolution chain to determine if this Pokémon can evolve ──
  let evolvesTo: number | null = null;
  let evolveCandyCost: number | null = null;
  try {
    const evoChainUrl: string = speciesData.evolution_chain?.url;
    if (evoChainUrl) {
      const evoRes = await fetch(evoChainUrl);
      if (evoRes.ok) {
        const evoData = await evoRes.json();

        // Returns 0-indexed depth of targetName in the chain, or null if not found
        const getNodeDepth = (chain: any, targetName: string, depth = 0): number | null => {
          if (chain.species.name === targetName) return depth;
          for (const next of chain.evolves_to ?? []) {
            const result = getNodeDepth(next, targetName, depth + 1);
            if (result !== null) return result;
          }
          return null;
        };

        // Returns the max chain length (e.g. 3 for a 3-stage line)
        const getChainLength = (chain: any): number => {
          if (!chain.evolves_to?.length) return 1;
          return 1 + Math.max(...chain.evolves_to.map(getChainLength));
        };

        // Find the next species name for the current species
        const findNextEvolution = (chain: any, targetName: string): string | null => {
          if (chain.species.name === targetName) {
            return chain.evolves_to?.[0]?.species?.name ?? null;
          }
          for (const next of chain.evolves_to ?? []) {
            const result = findNextEvolution(next, targetName);
            if (result !== null) return result;
          }
          return null;
        };

        const nextSpeciesName = findNextEvolution(evoData.chain, data.name);
        if (nextSpeciesName) {
          // Resolve next species name → Pokédex number
          const nextSpeciesRes = await fetch(`${POKEAPI_BASE}/pokemon-species/${nextSpeciesName}`);
          if (nextSpeciesRes.ok) {
            const nextSpeciesData = await nextSpeciesRes.json();
            evolvesTo = nextSpeciesData.id as number;
          }

          // Compute candy cost based on chain position
          const depth = getNodeDepth(evoData.chain, data.name) ?? 0;
          const chainLength = getChainLength(evoData.chain);
          if (chainLength === 3) {
            evolveCandyCost = depth === 0 ? 25 : 100; // stage 1→2: 25, stage 2→3: 100
          } else {
            evolveCandyCost = 50; // 2-stage line: always 50
          }
        }
      }
    }
  } catch {
    // Evolution lookup is non-critical; leave both as null
  }

  return {
    id: data.id,
    name: data.name,
    sprite: data.sprites.front_default,
    weight: data.weight / 10,  // hectograms → kg
    height: data.height / 10,  // decimetres → m
    types: data.types.map((t: { type: { name: string } }) => t.type.name),
    description,
    evolvesTo,
    evolveCandyCost,
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
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokedexNumber}.gif`;
}

export function getPokemonOfficialArt(pokedexNumber: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokedexNumber}.png`;
}

export function getPokedexSprite(pokedexNumber: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokedexNumber}.png`;
}