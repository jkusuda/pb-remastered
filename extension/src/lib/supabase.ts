import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nxshczmwkznapzgprkcc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54c2hjem13a3puYXB6Z3Bya2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNTIzMjUsImV4cCI6MjA4NzYyODMyNX0.c9o3R2Jp11rnd_jnVcpSW20SxOUeQNo6A36jpqkh-tE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,  // Extension manages sessions via cookies
    autoRefreshToken: true, // Allow setSession to refresh expired access tokens
    detectSessionInUrl: false,
  },
});