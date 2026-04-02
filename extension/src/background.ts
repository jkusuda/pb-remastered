import { SESSION_KEY } from "./lib/constants";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nxshczmwkznapzgprkcc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54c2hjem13a3puYXB6Z3Bya2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNTIzMjUsImV4cCI6MjA4NzYyODMyNX0.c9o3R2Jp11rnd_jnVcpSW20SxOUeQNo6A36jpqkh-tE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: true, detectSessionInUrl: false },
});

import { getPokemonBaseXp, getFamilyId, getPokemonName } from "pokemon-data";

/* ── XP logic ──────────────────────── */

function getLevelFromXP(xp: number): number {
  return Math.floor(xp / 1000) + 1;
}

/* ── Message handler ─────────────────────────────────────────────────────── */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // Auth relay (unchanged)
  if (message?.type === "POKEBROWSE_AUTH_TOKENS") {
    const { access_token, refresh_token } = message.payload;
    chrome.storage.local.set({ [SESSION_KEY]: { access_token, refresh_token } });
    sendResponse({ ok: true });
  }

  if (message?.type === "POKEBROWSE_AUTH_SIGNOUT") {
    chrome.storage.local.remove(SESSION_KEY);
    sendResponse({ ok: true });
  }

  // Content script asks: "is user logged in?"
  if (message?.type === "GET_SESSION") {
    chrome.storage.local.get(SESSION_KEY).then(async (result) => {
      const session = result[SESSION_KEY] as
        | { access_token: string; refresh_token: string }
        | undefined;

      if (!session?.access_token || !session?.refresh_token) {
        sendResponse({ loggedIn: false });
        return;
      }

      const { data, error } = await supabase.auth.setSession(session);
      if (error || !data.user) {
        sendResponse({ loggedIn: false });
        return;
      }

      const { data: user } = await supabase.from("users").select("catch_limit").eq("id", data.user.id).single();
      const { count: pokemonCount } = await supabase.from("pokemon").select("*", { count: "exact", head: true }).eq("user_id", data.user.id);
      
      const catchLimit = user?.catch_limit ?? 200;
      const boxIsFull = (pokemonCount ?? 0) >= catchLimit;

      const pokedexNumber = Math.floor(Math.random() * 151) + 1;
      const isShiny = Math.random() < 1 / 512;
      const name = getPokemonName(pokedexNumber);
      const encounter = { pokedexNumber, isShiny, name };

      sendResponse({ loggedIn: true, userId: data.user.id, boxIsFull, encounter });
    });
    return true; // async
  }

  // Content script says: "user caught a pokemon"
  if (message?.type === "PERFORM_CATCH") {
    const { userId, pokedexNumber, isShiny, name, caughtOn } = message.payload;

    (async () => {
      try {
        // Re-auth
        const stored = await chrome.storage.local.get(SESSION_KEY);
        const session = stored[SESSION_KEY] as { access_token: string; refresh_token: string } | undefined;
        if (session) await supabase.auth.setSession(session);

        // 1. Check catch limit
        const { count: pokemonCount } = await supabase.from("pokemon").select("*", { count: "exact", head: true }).eq("user_id", userId);
        const { data: userData } = await supabase.from("users").select("catch_limit").eq("id", userId).single();
        const limit = userData?.catch_limit ?? 200;
        
        if ((pokemonCount ?? 0) >= limit) {
          sendResponse({ ok: false, error: "CATCH_LIMIT_REACHED" });
          return;
        }

        // 2. New species?
        const { data: existingDex } = await supabase
          .from("pokedex")
          .select("pokedex_number")
          .eq("user_id", userId)
          .eq("pokedex_number", pokedexNumber)
          .maybeSingle();

        const isNewSpecies = !existingDex;

        if (isNewSpecies) {
          await supabase.from("pokedex").insert({ user_id: userId, pokedex_number: pokedexNumber });
        }

        // 2. Insert pokemon
        const { error: pokemonError } = await supabase.from("pokemon").insert({
          user_id: userId,
          pokedex_number: pokedexNumber,
          nickname: name,
          is_shiny: isShiny,
          caught_on: caughtOn ?? null,
        });
        if (pokemonError) throw pokemonError;

        // 3. Candies (+3)
        const familyBaseId = getFamilyId(pokedexNumber);

        const { data: existingCandy } = await supabase
          .from("candies")
          .select("id, count")
          .eq("user_id", userId)
          .eq("pokedex_number", familyBaseId)
          .maybeSingle();

        if (existingCandy) {
          await supabase.from("candies").update({ count: existingCandy.count + 3 }).eq("id", existingCandy.id);
        } else {
          await supabase.from("candies").insert({ user_id: userId, pokedex_number: familyBaseId, count: 3 });
        }

        // 4. XP + level
        const { data: user } = await supabase.from("users").select("xp, level, catch_limit").eq("id", userId).single();
        if (user) {
          const xpGained = getPokemonBaseXp(pokedexNumber, isShiny);
          const newXp = user.xp + xpGained;
          const newLevel = getLevelFromXP(newXp);
          let newLimit = user.catch_limit;
          
          if (newLevel > user.level) {
            newLimit += (newLevel - user.level) * 200;
          }
          
          await supabase.from("users").update({ xp: newXp, level: newLevel, catch_limit: newLimit }).eq("id", userId);
        }

        sendResponse({ ok: true, isNewSpecies });
      } catch (err: any) {
        sendResponse({ ok: false, error: err.message });
      }
    })();
    return true; // async
  }

  return true;
});
