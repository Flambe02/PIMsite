import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const redirectTo = formData.get("redirectTo") as string

    // Get origin with fallback
    const origin = request.nextUrl.origin || 'http://localhost:3000'

    if (!email || !password) {
      const redirectUrl = new URL('/login', origin)
      redirectUrl.searchParams.set('message', 'Email and password are required')
      return NextResponse.redirect(redirectUrl)
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login error:", error.message)
      const redirectUrl = new URL('/login', origin)
      redirectUrl.searchParams.set('message', error.message)
      return NextResponse.redirect(redirectUrl)
    }

    // Successful login - redirect to requested page or dashboard
    const finalRedirectTo = redirectTo || "/dashboard"
    const redirectUrl = new URL(finalRedirectTo, origin)
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("Login route error:", error)
    const origin = request.nextUrl.origin || 'http://localhost:3000'
    const redirectUrl = new URL('/login', origin)
    redirectUrl.searchParams.set('message', 'An unexpected error occurred')
    return NextResponse.redirect(redirectUrl)
  }
} 