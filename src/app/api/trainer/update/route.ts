import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateTrainerProfile } from "@/lib/queries";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { trainerName, avatarId } = body;

    if (!trainerName || !avatarId) {
       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await updateTrainerProfile(supabase, user.id, { trainerName, avatarId });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Trainer update API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
