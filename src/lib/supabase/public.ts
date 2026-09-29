import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/** Every public content read is tagged with this, so one save can refresh the whole site. */
export const CMS_TAG = "cms";

/**
 * The anonymous, cookie-less client the public site reads through. It only
 * ever sees published content (RLS), so its responses are safe to cache:
 * they sit in Next's data cache until an admin save calls revalidateTag(CMS_TAG),
 * with a one-hour safety net in case an edit is made outside the admin.
 */
export function publicClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 3600, tags: [CMS_TAG] } }),
    },
  });
}

/** The same anonymous access, uncached — for writes such as contact messages. */
export function anonClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}
