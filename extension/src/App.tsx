import { useAuth } from "./hooks/useAuth";
import { useRecentCatches } from "./hooks/useRecentCatches";

const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated";
const WEBSITE_URL = "http://localhost:3000";

function getPokemonSprite(pokedexNumber: number, isShiny: boolean) {
  return isShiny
    ? `${SPRITE_BASE}/shiny/${pokedexNumber}.gif`
    : `${SPRITE_BASE}/${pokedexNumber}.gif`;
}

export default function App() {
  const { user, loading, signOut, openLogin } = useAuth();
  const { catches, loading: catchesLoading } = useRecentCatches(user?.id, 6); // 2 rows × 3 cols

  /* ── Loading ─────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="popup-container">
        <div className="popup-card">
          <h1 className="popup-title">Pokebrowser</h1>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  /* ── Not logged in ───────────────────────────────────────────── */
  if (!user) {
    return (
      <div className="popup-container">
        <div className="popup-card">
          <div className="pokeball-icon">
            <svg viewBox="0 0 100 100" width="64" height="64">
              <circle cx="50" cy="50" r="48" stroke="#3a5a00" strokeWidth="4" fill="none" />
              <path d="M 2 50 L 98 50" stroke="#3a5a00" strokeWidth="4" />
              <circle cx="50" cy="50" r="14" stroke="#3a5a00" strokeWidth="4" fill="none" />
              <circle cx="50" cy="50" r="6" fill="#3a5a00" />
              <path d="M 2 50 A 48 48 0 0 1 98 50 Z" fill="#3a5a00" opacity="0.15" />
            </svg>
          </div>
          <h1 className="popup-title">Pokebrowser</h1>
          <p className="popup-subtitle">Gotta catch 'em all!</p>
          <button className="btn-primary" onClick={openLogin}>
            Login / Sign Up
          </button>
        </div>
      </div>
    );
  }

  /* ── Logged in ───────────────────────────────────────────────── */
  const openProfile = () => {
    chrome.tabs.create({ url: `${WEBSITE_URL}/profile` });
  };

  return (
    /* Full-bleed route101 background */
    <div className="w-full h-full flex flex-col gap-0" style={{
      backgroundImage: "url('./route101.webp')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>

      {/* ── Section 1: Recent Catches — TabPanel-style card with margin ── */}
      <div className="m-3 mb-0 bg-[#e0f4d9]/90 rounded-[8px] border-4 border-black shadow-[4px_4px_0_black] overflow-hidden flex flex-col p-3 gap-2">
        {/* Header */}
        <div className="flex items-center">
          <span
            className="font-black text-white text-sm tracking-widest uppercase"
            style={{ WebkitTextStroke: "1px black", textShadow: "0 2px 0 black" }}
          >
            RECENT CATCHES
          </span>
        </div>

        {/* Grid — 2 rows × 4 cols, no scroll */}
        <div>
          {catchesLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="spinner" />
            </div>
          ) : catches.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p
                className="font-['Press_Start_2P'] text-[9px] text-[#3a5a00]/40 text-center leading-relaxed"
              >
                NO POKÉMON YET<br />GO CATCH SOME!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 place-items-center">
              {catches.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col items-center cursor-pointer relative"
                >
                  {p.is_shiny && (
                    <span className="absolute top-0 right-0 text-[#f59e0b] text-[10px] leading-none drop-shadow-sm">
                      ✦
                    </span>
                  )}
                  <img
                    src={getPokemonSprite(p.pokedex_number, p.is_shiny)}
                    alt={p.nickname ?? `#${p.pokedex_number}`}
                    className="w-16 h-16 object-contain mb-0 drop-shadow-md"
                    style={{ imageRendering: "pixelated" }}
                  />
                  {p.nickname && (
                    <p
                      className="font-black text-[11px] truncate w-[110%] text-center z-10"
                      style={{ color: "white", WebkitTextStroke: "0.75px black" }}
                    >
                      {p.nickname}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Section 2: View Profile — matches LandingHero button ── */}
      <div className="px-3 pt-2">
        <button
          onClick={openProfile}
          className="group w-full inline-flex items-center justify-center gap-3 px-6 py-3 text-[11px] tracking-widest text-white font-black italic bg-[#6b9fff] border-4 border-black rounded-[8px] shadow-[4px_4px_0_black] transition-all duration-75 cursor-pointer uppercase hover:translate-y-px active:shadow-none"
        >
          {/* Pokeball icon matching landing hero */}
          <svg width="16" height="16" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="white" strokeWidth="8" fill="none"/><path d="M 2 50 L 98 50" stroke="white" strokeWidth="8"/><circle cx="50" cy="50" r="14" stroke="white" strokeWidth="8" fill="none"/><circle cx="50" cy="50" r="6" fill="white"/></svg>
          VIEW PROFILE
        </button>
      </div>

      {/* ── Section 3: Log Out — smaller version of SettingsPage style ── */}
      <div className="px-3 pb-3 pt-3 flex justify-center">
        <button
          onClick={signOut}
          className="w-1/2 py-1.5 px-4 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-black text-[10px] tracking-wider rounded-[6px] border-2 border-black shadow-[2px_2px_0_black] transition-all duration-75 cursor-pointer hover:translate-y-px active:shadow-none"
          style={{ WebkitTextStroke: "0.5px black", textShadow: "0px 1px 0px black" }}
        >
          LOG OUT
        </button>
      </div>
    </div>
  );
}
