"use client";

import { useState, useMemo, useEffect } from "react";
import { getPokedexSprite, getPokemonSprite, getPokemonInfo } from "@/lib/pokemon";
import { Pokemon, PokemonInfo, PokedexUnlock } from "@/types";
import { TYPE_COLORS } from "@/lib/types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PokedexEntry {
  id: number;
  name: string;
  isCaught: boolean;
  types?: string[];
  baseStats?: {
    hp: number;
    atk: number;
    def: number;
    spAtk: number;
    spDef: number;
    speed: number;
  };
  description?: string;
  caughtData?: {
    is_shiny: boolean;
    caught_at: string;
    nickname: string | null;
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STAT_COLORS: Record<string, string> = {
  hp: "#FF5959", atk: "#F5AC78", def: "#FAE078",
  spAtk: "#9DB7F5", spDef: "#A7DB8D", speed: "#FA92B2",
};

const STAT_MAX: Record<string, number> = {
  hp: 255, atk: 255, def: 255, spAtk: 255, spDef: 255, speed: 255,
};

// No more mock data here

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatBar({ label, value, statKey }: { label: string; value: number; statKey: string }) {
  const max = STAT_MAX[statKey] ?? 255;
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = STAT_COLORS[statKey] ?? "#aaa";
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-12 shrink-0 font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] font-['Press_Start_2P'] text-[7px] leading-none">
        {label}
      </span>
      <span className="w-6 shrink-0 text-right text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] font-mono text-[10px]">{value}</span>
      <div className="flex-1 h-2.5 bg-[#0a1929] rounded-sm border border-[#364d4e] overflow-hidden">
        <div
          className="h-full rounded-sm transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 4px ${color}88` }}
        />
      </div>
    </div>
  );
}

function GridCell({
  entry,
  isSelected,
  onClick,
}: {
  entry: PokedexEntry;
  isSelected: boolean;
  onClick: () => void;
}) {
  const id = entry.id.toString().padStart(4, "0");
  return (
    <button
      onClick={onClick}
      className={`relative group flex flex-col items-center justify-center overflow-hidden rounded border-2 transition-all duration-150 aspect-square ${isSelected
        ? "border-[#84feff] bg-[#77ecf1]/30 shadow-[0_0_8px_rgba(68,179,200,0.6)]"
        : "border-[#84feff]/60 bg-[#5ecddb]/80 hover:border-[#84feff]/80 hover:bg-[#77ecf1]/80"
        }`}
    >
      <span className="absolute top-0.5 left-1 font-['Press_Start_2P'] text-[12px] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] leading-none z-10">
        {id}
      </span>

      {entry.isCaught && (
        <div className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-white/60 bg-linear-to-b from-red-500 from-50% to-white to-50% z-10" />
      )}

      {entry.isCaught ? (
        <img
          src={getPokedexSprite(entry.id)}
          alt={entry.name}
          className="w-36 h-36 object-contain mt-3"
          style={{ imageRendering: "pixelated" }}
        />
      ) : (
        <div className="flex items-center justify-center mt-3 w-32 h-32">
          <span className="font-['Press_Start_2P'] text-lg text-white/30 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">?</span>
        </div>
      )}
    </button>
  );
}

function DetailPanel({ entry }: { entry: PokedexEntry }) {
  const [activeTab, setActiveTab] = useState<"entry" | "stats">("entry");
  const id = entry.id.toString().padStart(4, "0");
  const name = entry.isCaught ? entry.name.replace(/-/g, " ").toUpperCase() : "???";

  return (
    // Detail panel fills its parent column — no scroll here
    <div className="flex flex-col h-full bg-[#3a96b6]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#74eaf0] border-b-4 border-[#3a96b6] shrink-0">
        <span className="font-['Press_Start_2P'] text-[10px] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">{id}</span>
        <span className="flex-1 font-bold text-lg tracking-widest text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] uppercase">{name}</span>
        {entry.isCaught && (
          <div className="w-5 h-5 rounded-full border-2 border-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] bg-linear-to-b from-red-500 from-50% to-white to-50%" />
        )}
      </div>

      {/* Sprite area */}
      <div
        className="relative flex items-center justify-center bg-[#74eaf0] border-b-4 border-[#3a96b6] shrink-0"
        style={{ minHeight: 160 }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-36 h-36 rounded-full bg-white blur-2xl" />
        </div>

        {entry.isCaught ? (
          <img
            src={getPokemonSprite(entry.id)}
            alt={entry.name}
            className="relative z-10 h-24 w-24 object-contain drop-shadow-lg"
          />
        ) : (
          <div className="relative z-10 font-['Press_Start_2P'] text-6xl text-white/20 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">?</div>
        )}

        {entry.isCaught && entry.types && (
          <div className="absolute bottom-2 left-3 flex gap-1.5 z-10">
            {entry.types.map((t) => (
              <span
                key={t}
                className="text-[8px] font-bold text-white uppercase px-2 py-0.5 rounded font-['Press_Start_2P'] leading-none shadow border border-white/20"
                style={{ backgroundColor: TYPE_COLORS[t] ?? "#666" }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content Area — fills remaining height, no scroll */}
      <div className="flex-1 p-3 bg-[#44b3c8]/10 flex flex-col">
        {activeTab === "stats" ? (
          entry.isCaught && entry.baseStats ? (
            <>
              <div className="font-['Press_Start_2P'] text-[8px] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] mb-3 tracking-widest uppercase">
                Base Stats
              </div>
              <div className="flex flex-col gap-2.5">
                <StatBar label="HP" value={entry.baseStats.hp} statKey="hp" />
                <StatBar label="Atk" value={entry.baseStats.atk} statKey="atk" />
                <StatBar label="Def" value={entry.baseStats.def} statKey="def" />
                <StatBar label="Sp.Atk" value={entry.baseStats.spAtk} statKey="spAtk" />
                <StatBar label="Sp.Def" value={entry.baseStats.spDef} statKey="spDef" />
                <StatBar label="Speed" value={entry.baseStats.speed} statKey="speed" />
              </div>

              {entry.caughtData && (
                <div className="mt-3 pt-3 border-t border-[#364d4e] grid grid-cols-2 gap-2 text-[9px] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                  <div>
                    <div className="text-[7px] font-['Press_Start_2P'] text-white/70 mb-0.5">CAUGHT</div>
                    <div>{new Date(entry.caughtData.caught_at).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-[7px] font-['Press_Start_2P'] text-white/70 mb-0.5">SHINY</div>
                    <div>{entry.caughtData.is_shiny ? "✨ Yes" : "No"}</div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 opacity-40">
              <div className="font-['Press_Start_2P'] text-[9px] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">DATA UNKNOWN</div>
              <div className="text-xs text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] text-center">
                Catch this Pokémon to reveal its data
              </div>
            </div>
          )
        ) : (
          /* Entry View */
          <div className="flex flex-col items-center justify-center h-full gap-2">
            {entry.isCaught ? (
              <div className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] font-['Press_Start_2P'] text-[8px] leading-relaxed text-center px-2">
                {entry.description || "Loading description..."}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 opacity-40">
                <div className="font-['Press_Start_2P'] text-[9px] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">DATA UNKNOWN</div>
                <div className="text-xs text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] text-center">
                  Catch this Pokémon to reveal its data
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toggle Buttons */}
      <div className="shrink-0 flex items-center justify-center gap-2 px-3 py-2 bg-[#3a96b6] border-t-4 border-[#364d4e]">
        <button
          onClick={() => setActiveTab("entry")}
          className={`flex-1 py-1.5 rounded transition-all font-['Press_Start_2P'] text-[8px] border-2 ${activeTab === "entry"
            ? "bg-[#74eaf0] border-white text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] shadow-[0_0_8px_rgba(116,234,240,0.6)]"
            : "bg-[#44b3c8] border-[#364d4e] text-white/70 hover:bg-[#5ecddb]"
            }`}
        >
          ENTRY
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`flex-1 py-1.5 rounded transition-all font-['Press_Start_2P'] text-[8px] border-2 ${activeTab === "stats"
            ? "bg-[#74eaf0] border-white text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] shadow-[0_0_8px_rgba(116,234,240,0.6)]"
            : "bg-[#44b3c8] border-[#364d4e] text-white/70 hover:bg-[#5ecddb]"
            }`}
        >
          STATS
        </button>
      </div>
    </div>
  );
}

// ─── Left Panel (static shell + scrollable grid) ──────────────────────────────

function LeftPanel({
  entries,
  filtered,
  caught,
  total,
  search,
  onSearchChange,
  selectedId,
  onSelect,
}: {
  entries: PokedexEntry[];
  filtered: PokedexEntry[];
  caught: number;
  total: number;
  search: string;
  onSearchChange: (v: string) => void;
  selectedId: number;
  onSelect: (id: number) => void;
}) {
  return (
    // This column is a fixed flex column — only the grid div scrolls
    <div className="flex flex-col bg-[#3a96b6] border-r-4 border-[#364d4e]" style={{ width: "65%" }}>

      {/* ── Static: caught counter ── */}
      <div className="shrink-0 flex items-center justify-end px-3 py-2 bg-[#3a96b6] border-b-2 border-[#364d4e]">
        <div className="flex items-center gap-1 font-['Press_Start_2P'] text-[7px] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
          <div className="w-3 h-3 rounded-full border border-white/60 bg-linear-to-b from-red-500 from-50% to-white to-50% mr-1" />
          <span>{caught.toString().padStart(4, "0")}</span>
          <span className="text-white/40 mx-1">/</span>
          <span>{total.toString().padStart(4, "0")}</span>
        </div>
      </div>

      {/* ── Static: search bar ── */}
      <div className="shrink-0 px-2 py-2 bg-[#3a96b6] border-b-2 border-[#364d4e]">
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#4a7aaa] text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full pl-8 pr-3 py-1.5 rounded bg-[#44b3c8] text-white placeholder-white/50 text-xs font-bold outline-none focus:ring-2 focus:ring-[#4a90c8] border-2 border-[#3a96b6]"
          />
        </div>
      </div>

      {/* ── Scrollable: grid only ── */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 custom-scrollbar bg-[#5ecddb]">
        <div className="grid grid-cols-6 gap-1.5">
          {filtered.map((entry) => (
            <GridCell
              key={entry.id}
              entry={entry}
              isSelected={entry.id === selectedId}
              onClick={() => onSelect(entry.id)}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-32 font-['Press_Start_2P'] text-[9px] text-white/40">
            NO RESULTS
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Overlay ─────────────────────────────────────────────────────────────

interface PokedexOverlayProps {
  pokemon?: Pokemon[];
  pokedexUnlocks?: PokedexUnlock[];
}

export function PokedexOverlay({ pokemon = [], pokedexUnlocks = [] }: PokedexOverlayProps) {
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [fetchedDetails, setFetchedDetails] = useState<Record<number, PokemonInfo>>({});

  // Use pokedex unlocks size for the total caught count if available, otherwise fallback to unique pokemon owned
  const caught = pokedexUnlocks.length > 0
    ? pokedexUnlocks.length
    : new Set(pokemon.map((p) => p.pokedex_number)).size;
  const total = 151;

  const entries = useMemo(() => {
    return Array.from({ length: total }, (_, i) => {
      const id = i + 1;
      const caughtRecord = pokemon.find((p) => p.pokedex_number === id);
      const isUnlocked = pokedexUnlocks.some((u) => u.pokedex_number === id);
      const isCaught = isUnlocked || !!caughtRecord;
      const details = fetchedDetails[id];

      return {
        id,
        name: details ? details.name : `pokemon-${id}`,
        isCaught,
        types: details ? details.types : undefined,
        baseStats: details ? details.baseStats : undefined,
        description: details ? details.description : undefined,
        caughtData: caughtRecord ? {
          is_shiny: caughtRecord.is_shiny,
          caught_at: caughtRecord.caught_at,
          nickname: caughtRecord.nickname,
        } : undefined,
      };
    });
  }, [pokemon, pokedexUnlocks, fetchedDetails]);

  // Fetch details for selected pokemon if caught and not yet fetched.
  // fetchedDetails is intentionally excluded from deps: the guard inside
  // (`!fetchedDetails[selectedId]`) prevents duplicate fetches without
  // needing to re-run the effect every time a new entry is cached.
  useEffect(() => {
    const selectedRecord = pokemon.find(p => p.pokedex_number === selectedId);
    if (selectedRecord && !fetchedDetails[selectedId]) {
      getPokemonInfo(selectedId)
        .then(info => setFetchedDetails(prev => ({ ...prev, [selectedId]: info })))
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, pokemon]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.id.toString().includes(q) ||
        e.id.toString().padStart(4, "0").includes(q)
    );
  }, [entries, search]);

  const selectedEntry = entries.find((e) => e.id === selectedId) ?? entries[0];

  return (
    /*
     * Outer wrapper: px/pt/pb create the visible margin around the device frame.
     * It does NOT scroll — the page/parent is responsible for its own height.
     * The inner frame is a fixed-height flex column; only the grid inside scrolls.
     */
    <div className="w-full px-1 pt-4 pb-2">
      {/* ── Device frame ── */}
      <div
        className="flex flex-col rounded-[8px] border-4 border-[#364d4e] shadow-[4px_4px_0_#364d4e] overflow-hidden"
        style={{ height: 560 }}   /* fixed height keeps bottom margin always visible */
      >
        {/* ── Body: left (grid) + right (detail), both static in height ── */}
        <div className="flex flex-1 min-h-0">
          <LeftPanel
            entries={entries}
            filtered={filtered}
            caught={caught}
            total={total}
            search={search}
            onSearchChange={setSearch}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          {/* Right panel: completely static, no scroll */}
          <div className="flex flex-col flex-1 min-h-0 bg-[#44b3c8] border-l-2 border-[#364d4e]">
            <DetailPanel entry={selectedEntry!} />
          </div>
        </div>
      </div>
    </div>
  );
}