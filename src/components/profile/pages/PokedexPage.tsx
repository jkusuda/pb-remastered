"use client";

import { PokedexOverlay } from "@/components/pokedex/PokedexOverlay";
import { Pokemon } from "@/types";

interface PokedexPageProps {
  pokemon?: Pokemon[];
}

export default function PokedexPage({ pokemon }: PokedexPageProps) {
  return (
    <div className="w-full flex-1 flex flex-col">
      <PokedexOverlay pokemon={pokemon} />
    </div>
  );
}
