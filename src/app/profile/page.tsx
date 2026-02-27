import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TrainerCard from "@/components/profile/TrainerCard";
import ProfileContent from "@/components/profile/ProfileContent";
import { User, Pokemon, Friend } from "@/types";
import { BORDER } from "@/lib/styles";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/?modal=login");

  // Fetch all data in parallel
  const [profileResult, pokemonResult, friendsResult] = await Promise.all([
    supabase.from("users").select("*").eq("id", authUser.id).single(),
    supabase.from("pokemon").select("*").eq("user_id", authUser.id).order("caught_at", { ascending: false }),
    supabase.from("friends").select(`*, friend:friend_id(trainer_name, avatar_id, level)`).eq("user_id", authUser.id),
  ]);

  const userData = profileResult.data as User | null;
  if (!userData) redirect("/?modal=login");

  const favoritePokemon: Pokemon | null = userData.favorite_pokemon_id
    ? ((await supabase.from("pokemon").select("*").eq("id", userData.favorite_pokemon_id).single()).data as Pokemon)
    : null;

  const pokemon = (pokemonResult.data as Pokemon[]) ?? [];
  const friends = (friendsResult.data as any[]) ?? [];

  return (
    <div className="scanlines h-screen bg-[#d4ed7a] flex overflow-hidden">
      <ProfileContent
        initialTab="collection"
        pokemon={pokemon}
        friends={friends}
        user={userData}
        favoritePokemon={favoritePokemon}
      />
    </div>
  );
}
