import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from 'next-intl/middleware';

const PROTECTED = ["/dashboard", "/calculadora"];
const ADMIN_ROUTES = ["/admin"];

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales: ['br', 'fr', 'en'],
  defaultLocale: 'br',
  localePrefix: 'as-needed'
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Handle internationalization first
  const response = intlMiddleware(req);
  
  // Then handle authentication
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
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if the pathname is protected
  const isProtectedRoute = PROTECTED.some(route => pathname.includes(route))
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.includes(route))

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (isAdminRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single()

    if (!profile?.role || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 