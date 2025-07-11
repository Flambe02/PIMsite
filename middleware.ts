import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED = ["/dashboard", "/calculadora"];
const ADMIN_ROUTES = ["/admin"];

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
  const needsAdmin = ADMIN_ROUTES.some((p) => pathname.startsWith(p));

  // Vérifier l'accès admin si nécessaire
  if (needsAdmin) {
    if (!session) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Vérifier le statut admin
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (error || !profile?.is_admin) {
      // Rediriger vers le dashboard si l'utilisateur n'est pas admin
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
  }

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