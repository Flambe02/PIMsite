import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED = ["/dashboard", "/calculadora"];

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: unknown) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          req.cookies.set({
            name,
            value,
            ...(options as Record<string, unknown>),
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value,
            ...(options as Record<string, unknown>),
          })
        },
        remove(name: string, options: unknown) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          req.cookies.set({
            name,
            value: '',
            ...(options as Record<string, unknown>),
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value: '',
            ...(options as Record<string, unknown>),
          })
        },
      },
    }
  );
  
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;
  const needsAuth = PROTECTED.some((p) => pathname.startsWith(p));

  if (!session && needsAuth) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (session && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}; 