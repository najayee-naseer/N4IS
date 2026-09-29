import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { serverClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type Role = "owner" | "admin" | "editor";

export type AdminSession = {
  supabase: SupabaseClient;
  user: User;
  roles: Role[];
  canEdit: boolean;
  isAdmin: boolean;
  isOwner: boolean;
};

/**
 * The signed-in CMS user and their roles, read on the server. The role list
 * comes from `user_roles` through RLS — it is only used to shape the UI and
 * fail early; the database re-checks every write regardless.
 */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  if (!isSupabaseConfigured) return null;
  const supabase = await serverClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
  const roles = (data ?? []).map((row) => row.role as Role);
  return {
    supabase,
    user,
    roles,
    canEdit: roles.length > 0,
    isAdmin: roles.includes("owner") || roles.includes("admin"),
    isOwner: roles.includes("owner"),
  };
});

/** For admin pages: signed in with a CMS role, or sent away. */
export async function requireEditorPage(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (!session.canEdit) redirect("/admin/login?error=no-access");
  return session;
}

export type ActionResult<T = undefined> =
  | ({ ok: true } & (T extends undefined ? object : { data: T }))
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** For server actions: returns the session, or a ready-made failure result. */
export async function actionSession(level: "editor" | "admin" = "editor") {
  const session = await getAdminSession();
  if (!session) return { session: null, failure: { ok: false as const, error: "Your session has expired. Sign in again." } };
  const allowed = level === "admin" ? session.isAdmin : session.canEdit;
  if (!allowed) {
    return {
      session: null,
      failure: {
        ok: false as const,
        error: level === "admin" ? "Only an admin or owner can do that." : "Your account has no CMS role.",
      },
    };
  }
  return { session, failure: null };
}

/** Postgres errors, translated into something an editor can act on. */
export function explainDbError(error: { code?: string; message: string }): string {
  if (error.code === "23505") return "That slug is already used by another entry. Choose a different one.";
  if (error.code === "42501" || /row-level security/i.test(error.message)) {
    return "The database refused this change — your role doesn't allow it.";
  }
  if (error.code === "23514") return "One of the values isn't allowed by the database. Check the highlighted fields.";
  return error.message;
}
