import { Pokemon } from "@/types";

const SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
const PIXEL = "font-['Press_Start_2P']";

export default function CollectionTab({ pokemon }: { pokemon: Pokemon[] }) {
  if (pokemon.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className={`${PIXEL} text-[9px] text-[#3a5a00]/40 text-center leading-relaxed`}>
          NO POKÉMON YET<br />GO CATCH SOME!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="grid grid-cols-4 gap-3">
        {pokemon.map((p) => (
          <div
            key={p.id}
            className="bg-[#c8e070]/50 rounded-xl border-[2px] border-[#3a5a00]/20 p-3 flex flex-col items-center gap-1 hover:border-[#3a5a00]/50 transition-colors"
          >
            <img
              src={`${SPRITE_BASE}/${p.pokedex_number}.png`}
              alt={`#${p.pokedex_number}`}
              className="w-14 h-14 object-contain"
              style={{ imageRendering: "pixelated" }}
            />
            {p.is_shiny && (
              <span className="text-[8px] font-['DM_Sans'] text-yellow-600 font-bold">✦ SHINY</span>
            )}
            {p.nickname && (
              <p className="font-['DM_Sans'] text-[10px] text-[#3a5a00] font-semibold truncate w-full text-center">
                {p.nickname}
              </p>
            )}
            <p className={`${PIXEL} text-[7px] text-[#4a6600]`}>#{p.pokedex_number}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
