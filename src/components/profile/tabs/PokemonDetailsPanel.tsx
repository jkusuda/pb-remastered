import { Pokemon, PokemonInfo } from "@/types";
import { getPokemonSprite } from "@/lib/pokemon";

import { getTypeColor, getTypeIconPath } from "@/lib/types";

// ─── Props ──────────────────────────────────────────────────────────────────
interface PokemonDetailsPanelProps {
  pokemon: Pokemon | null;
  pokemonInfo: PokemonInfo | null;
  isVisible: boolean;
  onClose: () => void;
}

export default function PokemonDetailsPanel({
  pokemon,
  pokemonInfo,
  isVisible,
  onClose,
}: PokemonDetailsPanelProps) {
  const types = pokemonInfo?.types ?? [];
  const primaryType = types[0] ?? "normal";
  const typeColors = getTypeColor(primaryType);

  return (
    <div
      className={`absolute top-2 bottom-2 right-2 w-[36%] rounded-[20px] shadow-lg transition-transform duration-300 z-20 overflow-hidden flex flex-col ${isVisible ? "translate-x-0" : "translate-x-[110%]"
        }`}
      style={{ backgroundColor: `${typeColors.background}cc` }}
    >
      {pokemon && (
        <div className="flex flex-col h-full relative">
          {/* ── Close button ── */}
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-white/70 hover:text-white text-xl font-bold z-30"
          >
            &times;
          </button>

          {/* ── Spacer to push everything to bottom ── */}
          <div className="flex-1" />

          {/* ── Sprite — positioned relative to the content below ── */}
          <div className="relative">
            <img
              src={getPokemonSprite(pokemon.pokedex_number)}
              alt={pokemon.nickname || `#${pokemon.pokedex_number}`}
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-20 h-20 object-contain object-bottom drop-shadow-lg z-20"
              style={{ imageRendering: "pixelated" }}
            />

            {/* ── White info card ── */}
            <div className="mx-3 mt-0 rounded-[16px] bg-white/90 shadow-sm p-3 pt-4 flex flex-col gap-2 flex-shrink-0">
              {/* Name + number */}
              <div className="text-center">
                <h3 className="text-lg font-bold capitalize leading-tight">
                  {pokemon.nickname || pokemonInfo?.name?.replace(/-/g, " ") || `Pokemon`}
                </h3>
                <p className="text-xs text-gray-500 font-semibold">
                  #{pokemon.pokedex_number.toString().padStart(3, "0")}
                </p>
              </div>

              {/* Weight | Types | Height row */}
              <div className="flex items-center justify-between text-center text-[11px] gap-1">
                {/* Weight */}
                <div className="flex-1">
                  <p className="font-bold text-sm">
                    {pokemonInfo ? `${pokemonInfo.weight}kg` : "—"}
                  </p>
                  <p className="text-gray-400 font-semibold text-[9px] uppercase tracking-wide">Weight</p>
                </div>

                <div className="w-px h-8 bg-gray-200" />

                {/* Types */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="flex gap-1 justify-center">
                    {types.length > 0 ? types.map((t) => (
                      <div
                        key={t}
                        className="w-5 h-5 rounded-full flex items-center justify-center shadow-sm overflow-hidden"
                        style={{ backgroundColor: getTypeColor(t).background, border: `1px solid ${getTypeColor(t).border}` }}
                        title={t}
                      >
                        <img
                          src={getTypeIconPath(t)}
                          alt={t}
                          className="w-3.5 h-3.5 object-contain"
                        />
                      </div>
                    )) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </div>
                  <p className="text-gray-400 font-semibold text-[9px] uppercase tracking-wide">
                    {types.length > 0 ? types.map(t => t.toUpperCase()).join(" / ") : "—"}
                  </p>
                </div>

                <div className="w-px h-8 bg-gray-200" />

                {/* Height */}
                <div className="flex-1">
                  <p className="font-bold text-sm">
                    {pokemonInfo ? `${pokemonInfo.height}m` : "—"}
                  </p>
                  <p className="text-gray-400 font-semibold text-[9px] uppercase tracking-wide">Height</p>
                </div>
              </div>
            </div>

            {/* ── Candy row ── */}
            <div className="mx-3 mt-1.5 rounded-[12px] bg-white/90 shadow-sm px-4 py-1.5 flex items-center justify-between flex-shrink-0">
              <span className="font-bold text-sm capitalize">
                {pokemonInfo?.name?.replace(/-/g, " ") ?? "Pokémon"} Candy
              </span>
              <span className="font-bold text-sm text-gray-600">—</span>
            </div>

            {/* ── Evolve button — visible if can evolve, spacer if not ── */}
            {pokemonInfo?.evolvesTo != null ? (
              <div className="mx-3 mt-1.5 rounded-[12px] bg-[#d4edbc] shadow-sm px-4 py-1.5 flex items-center justify-between flex-shrink-0 opacity-60">
                <span className="font-bold text-sm text-[#5a8a3c] uppercase tracking-wide">Evolve</span>
                <span className="font-bold text-sm text-[#5a8a3c]/70 bg-white/60 px-3 py-0.5 rounded-full text-xs">
                  {pokemonInfo.evolveCandyCost ?? "—"}
                </span>
              </div>
            ) : (
              <div className="mx-3 mt-1.5 rounded-[12px] px-4 py-4 flex-shrink-0" aria-hidden="true" />
            )}

            {/* ── Caught On footer ── */}
            <div className="mx-3 mt-1.5 mb-2 rounded-[12px] bg-white/70 px-4 py-2 text-center flex-shrink-0">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-0.5">
                Caught On
              </p>
              {pokemon.caught_on && (
                <p className="text-xs font-bold text-gray-700">{pokemon.caught_on}</p>
              )}
              <p className="text-xs text-gray-500">
                {pokemon.caught_at
                  ? new Date(pokemon.caught_at).toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                  })
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
