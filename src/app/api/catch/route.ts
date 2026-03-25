import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { performCatch } from "@/lib/catch";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // The middleware and createServerClient automatically handle checking the 
    // Authorization header (Bearer token) if it exists, or the cookie. 
    // Both website and extension will be able to authenticate.
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { pokedexNumber, isShiny, caughtOn } = body;

    if (!pokedexNumber || typeof pokedexNumber !== "number") {
      return NextResponse.json({ error: "Invalid pokedexNumber" }, { status: 400 });
    }

    const result = await performCatch(supabase, user.id, pokedexNumber, isShiny, caughtOn);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Catch API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
