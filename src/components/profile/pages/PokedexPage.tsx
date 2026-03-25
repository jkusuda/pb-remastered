"use client";

import { PokedexOverlay } from "@/components/pokedex/PokedexOverlay";
import { Pokemon, PokedexUnlock } from "@/types";

interface PokedexPageProps {
  pokemon?: Pokemon[];
  pokedexUnlocks?: PokedexUnlock[];
}

export default function PokedexPage({ pokemon, pokedexUnlocks }: PokedexPageProps) {
  return (
    <div className="w-full flex-1 flex flex-col">
      <PokedexOverlay pokemon={pokemon} pokedexUnlocks={pokedexUnlocks} />
    </div>
  );
}
