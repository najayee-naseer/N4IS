"use server";

import { headers } from "next/headers";
import { contactMessageSchema, fieldErrors } from "@/lib/cms/schemas";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { anonClient } from "@/lib/supabase/public";

export type ContactState =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "invalid"; errors: Record<string, string> }
  | { status: "error"; message: string };

// a small per-instance guard against a burst of submissions from one address
const recent = new Map<string, number[]>();
function tooMany(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((time) => now - time < 10 * 60_000);
  hits.push(now);
  recent.set(key, hits);
  return hits.length > 5;
}

/**
 * Stores a contact message in `contact_messages`. Visitors can insert but
 * never read (RLS); the studio reads them in /admin/contact.
 */
export async function sendContactMessage(_: ContactState, formData: FormData): Promise<ContactState> {
  // honeypot: a field people never see, bots always fill
  if (String(formData.get("website") ?? "").length > 0) return { status: "sent" };

  const parsed = contactMessageSchema.safeParse({
    name: formData.get("name"),
    email: String(formData.get("email") ?? "").trim(),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { status: "invalid", errors: fieldErrors(parsed.error) };

  if (!isSupabaseConfigured) {
    return { status: "error", message: "Messages can't be delivered yet — the studio's inbox is still being connected." };
  }

  const address = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(address)) {
    return { status: "error", message: "Too many messages in a short time. Please try again in a few minutes." };
  }

  const { error } = await anonClient().from("contact_messages").insert(parsed.data);
  if (error) {
    console.error(`[contact] ${error.message}`);
    return { status: "error", message: "Your message couldn't be sent. Please try again in a moment." };
  }
  return { status: "sent" };
}
