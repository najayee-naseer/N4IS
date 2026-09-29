import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/env";

const LOGIN = "/admin/login";

/**
 * Guards /admin. Refreshes the Supabase session cookie on every admin
 * request and sends anyone without a valid session to the login page.
 * This is the first gate only — every admin page re-checks the user's role
 * on the server, and the database enforces it again through RLS.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const onLogin = pathname === LOGIN;

  if (!isSupabaseConfigured) {
    return onLogin ? NextResponse.next() : NextResponse.redirect(new URL(LOGIN, request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (entries) => {
        entries.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        entries.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() validates the token with Supabase Auth — never trust the cookie alone
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const redirect = (path: string) => {
    const target = NextResponse.redirect(new URL(path, request.url));
    response.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));
    return target;
  };

  if (!user && !onLogin) return redirect(`${LOGIN}?next=${encodeURIComponent(pathname + search)}`);
  if (user && onLogin) return redirect("/admin");

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
