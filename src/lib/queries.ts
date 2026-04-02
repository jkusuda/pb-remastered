import { SupabaseClient } from "@supabase/supabase-js";
import { User, Pokemon, Friend, PokedexUnlock, Candy } from "@/types";

export async function getTrainerData(supabase: SupabaseClient, userId: string) {
  const [profileResult, pokemonResult, friendsResult, pokedexResult, candiesResult] = await Promise.all([
    supabase.from("users").select("*").eq("id", userId).single(),
    supabase.from("pokemon").select("*").eq("user_id", userId).order("caught_at", { ascending: false }),
    supabase.from("friends").select(`*, friend:friend_id(trainer_name, avatar_id, level)`).eq("user_id", userId),
    supabase.from("pokedex").select("pokedex_number, unlocked_at").eq("user_id", userId),
    supabase.from("candies").select("*").eq("user_id", userId),
  ]);

  if (profileResult.error) throw profileResult.error;

  const user = profileResult.data as User;
  const favoritePokemon = user.favorite_pokemon_id
    ? ((await supabase.from("pokemon").select("*").eq("id", user.favorite_pokemon_id).single()).data as Pokemon)
    : null;

  return {
    user,
    pokemon: (pokemonResult.data as Pokemon[]) ?? [],
    friends: (friendsResult.data as any[]) ?? [],
    pokedexUnlocks: (pokedexResult.data as PokedexUnlock[]) ?? [],
    favoritePokemon,
    candies: (candiesResult.data as Candy[]) ?? [],
  };
}

export async function updateTrainerProfile(supabase: SupabaseClient, userId: string, data: { trainerName: string; avatarId: string }) {
  const { error } = await supabase
    .from("users")
    .update({ trainer_name: data.trainerName, avatar_id: data.avatarId })
    .eq("id", userId);
  if (error) throw error;
}

export async function updatePokemonNickname(supabase: SupabaseClient, pokemonId: string, nickname: string) {
  const { error } = await supabase
    .from("pokemon")
    .update({ nickname })
    .eq("id", pokemonId);
  if (error) throw error;
}

export async function releasePokemon(supabase: SupabaseClient, pokemonId: string) {
  const { error } = await supabase
    .from("pokemon")
    .delete()
    .eq("id", pokemonId);
  if (error) throw error;
}
