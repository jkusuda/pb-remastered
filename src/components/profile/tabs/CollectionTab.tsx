import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pokemon, PokemonInfo } from "@/types";
import { getPokemonSprite, getPokemonInfo } from "@/lib/pokemon";
import PokemonDetailsPanel from "./PokemonDetailsPanel";

const PANEL_TRANSITION_MS = 300;

export default function CollectionTab({ pokemon }: { pokemon: Pokemon[] }) {
  const [displayPokemon, setDisplayPokemon] = useState<Pokemon | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [infoCache, setInfoCache] = useState<Record<number, PokemonInfo>>({});
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; pokemon: Pokemon } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Fetch PokeAPI data whenever the displayed pokemon changes
  useEffect(() => {
    if (!displayPokemon) return;
    const dexNum = displayPokemon.pokedex_number;
    if (infoCache[dexNum]) return; // already cached
    getPokemonInfo(dexNum)
      .then((info) => setInfoCache((prev) => ({ ...prev, [dexNum]: info })))
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayPokemon?.pokedex_number]);

  const handleSelect = (p: Pokemon) => {
    if (displayPokemon && displayPokemon.id !== p.id && isPanelVisible) {
      // Different pokemon clicked while open: slide out, swap, slide in
      setIsPanelVisible(false);
      setTimeout(() => {
        setDisplayPokemon(p);
        setIsPanelVisible(true);
      }, PANEL_TRANSITION_MS);
    } else {
      setDisplayPokemon(p);
      setIsPanelVisible(true);
    }
  };

  const handleClose = () => {
    setIsPanelVisible(false);
    setTimeout(() => setDisplayPokemon(null), PANEL_TRANSITION_MS);
  };

  const handleContextMenu = (e: React.MouseEvent, p: Pokemon) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, pokemon: p });
  };

  const handleChangeNickname = async (p: Pokemon) => {
    const currentName = p.nickname || "this Pokémon";
    const newNick = window.prompt(`Enter a new nickname for ${currentName} (leave blank for default name):`, p.nickname || "");
    if (newNick !== null) {
      let finalNick = newNick.trim();

      if (!finalNick) {
        let defaultName = infoCache[p.pokedex_number]?.name;
        if (!defaultName) {
          try {
            const info = await getPokemonInfo(p.pokedex_number);
            defaultName = info.name;
            setInfoCache((prev) => ({ ...prev, [p.pokedex_number]: info }));
          } catch (err) {
            console.error(err);
            defaultName = `Pokemon #${p.pokedex_number}`;
          }
        }
        finalNick = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
      }

      const res = await fetch("/api/pokemon/nickname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pokemonId: p.id, nickname: finalNick }),
      });

      if (res.ok) {
        router.refresh();
        if (displayPokemon?.id === p.id) {
          setDisplayPokemon({ ...p, nickname: finalNick });
        }
      } else {
        const data = await res.json();
        console.error("Nickname update error:", data.error);
        alert("Failed to update nickname.");
      }
    }
  };

  const handleRelease = async (p: Pokemon) => {
    if (window.confirm(`Are you sure you want to release ${p.nickname || `#${p.pokedex_number}`}? This cannot be undone.`)) {
      const res = await fetch("/api/pokemon/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pokemonId: p.id }),
      });

      if (res.ok) {
        router.refresh();
        if (displayPokemon?.id === p.id) {
          setIsPanelVisible(false);
          setTimeout(() => setDisplayPokemon(null), PANEL_TRANSITION_MS);
        }
      } else {
        const data = await res.json();
        console.error("Release error:", data.error);
        alert("Failed to release Pokémon.");
      }
    }
  };

  if (pokemon.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className={`font-black tracking-widest uppercase text-[9px] text-[#3a5a00]/40 text-center leading-relaxed`}>
          NO POKÉMON YET<br />GO CATCH SOME!
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden w-full h-full">
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="grid grid-cols-4 gap-1 place-items-center">
          {pokemon.map((p) => (
            <div
              key={p.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleSelect(p)}
              onContextMenu={(e) => handleContextMenu(e, p)}
            >
              <img
                src={getPokemonSprite(p.pokedex_number)}
                alt={p.nickname || `#${p.pokedex_number}`}
                className="w-20 h-20 object-contain mb-0 drop-shadow-md hover:scale-100 transition-transform"
                style={{ imageRendering: "pixelated" }}
              />
              {p.nickname && (
                <p
                  className="font-black text-[14px] truncate w-[120%] text-center z-10"
                  style={{ color: "white", WebkitTextStroke: "0.75px black" }}
                >
                  {p.nickname}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <PokemonDetailsPanel
        pokemon={displayPokemon}
        pokemonInfo={displayPokemon ? infoCache[displayPokemon.pokedex_number] ?? null : null}
        isVisible={isPanelVisible}
        onClose={handleClose}
      />

      {contextMenu && (
        <div
          className={`font-black tracking-widest uppercase fixed z-50 bg-[#2a2a2a] border-2 border-[#555] rounded-md shadow-xl flex flex-col p-1 w-40 drop-shadow-2xl`}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="text-left px-3 py-2 text-[10px] text-white hover:bg-[#444] rounded-sm transition-colors uppercase"
            onClick={() => {
              console.log("Set buddy", contextMenu.pokemon);
              setContextMenu(null);
            }}
          >
            Set Buddy
          </button>
          <button
            className="text-left px-3 py-2 text-[10px] text-white hover:bg-[#444] rounded-sm transition-colors uppercase"
            onClick={() => {
              setContextMenu(null);
              handleChangeNickname(contextMenu.pokemon);
            }}
          >
            Change Nickname
          </button>
          <button
            className="text-left px-3 py-2 text-[10px] text-red-400 hover:bg-[#444] hover:text-red-300 rounded-sm transition-colors uppercase"
            onClick={() => {
              setContextMenu(null);
              handleRelease(contextMenu.pokemon);
            }}
          >
            Release
          </button>
        </div>
      )}
    </div>
  );
}
