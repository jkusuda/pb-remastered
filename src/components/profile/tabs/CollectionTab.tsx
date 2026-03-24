import { Pokemon } from "@/types";
import { PIXEL } from "@/lib/styles";

const SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

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
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="grid grid-cols-4 gap-1 place-items-center">
        {pokemon.map((p) => (
          <div
            key={p.id}
            className="flex flex-col items-center"
          >
            <img
              src={`${SPRITE_BASE}/${p.pokedex_number}.png`}
              alt={p.nickname || `#${p.pokedex_number}`}
              className="w-28 h-28 object-contain -mb-3 drop-shadow-md hover:scale-110 transition-transform"
              style={{ imageRendering: "pixelated" }}
            />
            {p.nickname && (
              <p
                className="font-black text-[11px] truncate w-[120%] text-center z-10"
                style={{ color: "white", WebkitTextStroke: "0.5px black" }}
              >
                {p.nickname}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
