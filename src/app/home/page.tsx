import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileContent from "@/components/profile/ProfileContent";
import { User, Pokemon, Friend } from "@/types";
import route101 from "@/assets/route101.webp";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/?modal=login");

  // Fetch all data in parallel
  const [profileResult, pokemonResult, friendsResult, pokedexResult] = await Promise.all([
    supabase.from("users").select("*").eq("id", authUser.id).single(),
    supabase.from("pokemon").select("*").eq("user_id", authUser.id).order("caught_at", { ascending: false }),
    supabase.from("friends").select(`*, friend:friend_id(trainer_name, avatar_id, level)`).eq("user_id", authUser.id),
    supabase.from("pokedex").select("pokedex_number, unlocked_at").eq("user_id", authUser.id),
  ]);

  const userData = profileResult.data as User | null;
  if (!userData) redirect("/?modal=login");

  const favoritePokemon: Pokemon | null = userData.favorite_pokemon_id
    ? ((await supabase.from("pokemon").select("*").eq("id", userData.favorite_pokemon_id).single()).data as Pokemon)
    : null;

  const pokemon = (pokemonResult.data as Pokemon[]) ?? [];
  const friends = (friendsResult.data as any[]) ?? [];
  const pokedexUnlocks = (pokedexResult.data as any[]) ?? [];

  return (
    <div
      className="h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${route101.src})` }}
    >
      <div className="absolute inset-0 bg-white/20 pointer-events-none z-0 mix-blend-overlay" />
      <ProfileContent
        initialTab="collection"
        pokemon={pokemon}
        friends={friends}
        pokedexUnlocks={pokedexUnlocks}
        user={userData}
        favoritePokemon={favoritePokemon}
      />
    </div>
  );
}
