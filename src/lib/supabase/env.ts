/**
 * Supabase connection settings. Both values are public by design: the anon
 * key only grants what the row level security policies allow.
 *
 * The service role key is deliberately NOT read anywhere in the app — it is
 * used only by the local seed script (scripts/seed-cms.mjs), never shipped.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
