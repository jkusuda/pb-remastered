import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rollEncounter } from "@/lib/encounter";
import { getPokemonInfo } from "@/lib/pokemon";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pokedexNumber, isShiny } = rollEncounter();

    // Fetch name and sprite from PokeAPI to send to extension
    const info = await getPokemonInfo(pokedexNumber);

    return NextResponse.json({
      pokedexNumber,
      isShiny,
      name: info.name,
      sprite: info.sprite,
    });
  } catch (error: any) {
    console.error("Encounter API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
