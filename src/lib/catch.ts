import { SupabaseClient } from "@supabase/supabase-js";
import { XP_NEW_SPECIES_BONUS, XP_PER_CATCH, getLevelFromXP } from "./xp";
import { Pokemon } from "@/types";

export async function performCatch(
  supabase: SupabaseClient,
  userId: string,
  pokedexNumber: number,
  isShiny: boolean,
  caughtOn: string | null = null
) {
  // 1. Check if it's a new species for the user
  const { data: existingDex } = await supabase
    .from("pokedex")
    .select("pokedex_number")
    .eq("user_id", userId)
    .eq("pokedex_number", pokedexNumber)
    .maybeSingle();

  const isNewSpecies = !existingDex;

  // 2. Insert into pokedex if new
  if (isNewSpecies) {
    await supabase.from("pokedex").insert({
      user_id: userId,
      pokedex_number: pokedexNumber,
    });
  }

  // 3. Insert into pokemon
  const { data: newPokemon, error: pokemonError } = await supabase
    .from("pokemon")
    .insert({
      user_id: userId,
      pokedex_number: pokedexNumber,
      is_shiny: isShiny,
      caught_on: caughtOn,
    })
    .select()
    .single();

  if (pokemonError) throw pokemonError;

  // 4. Update candies (+3 per catch)
  const { data: existingCandy } = await supabase
    .from("candies")
    .select("id, count")
    .eq("user_id", userId)
    .eq("pokedex_number", pokedexNumber)
    .maybeSingle();

  if (existingCandy) {
    await supabase
      .from("candies")
      .update({ count: existingCandy.count + 3 })
      .eq("id", existingCandy.id);
  } else {
    await supabase.from("candies").insert({
      user_id: userId,
      pokedex_number: pokedexNumber,
      count: 3,
    });
  }

  // 5. Update user XP and level
  const { data: user } = await supabase
    .from("users")
    .select("xp")
    .eq("id", userId)
    .single();

  if (user) {
    const xpGained = XP_PER_CATCH + (isNewSpecies ? XP_NEW_SPECIES_BONUS : 0);
    const newXp = user.xp + xpGained;
    const newLevel = getLevelFromXP(newXp);

    await supabase
      .from("users")
      .update({ xp: newXp, level: newLevel })
      .eq("id", userId);
  }

  return {
    pokemon: newPokemon as Pokemon,
    isNewSpecies,
  };
}
