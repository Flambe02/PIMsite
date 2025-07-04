import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const redirectTo = formData.get("redirectTo") as string

    if (!email || !password) {
      return NextResponse.redirect(
        new URL("/login?message=Email and password are required", request.url)
      )
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login error:", error.message)
      return NextResponse.redirect(
        new URL(`/login?message=${encodeURIComponent(error.message)}`, request.url)
      )
    }

    // Successful login - redirect to requested page or dashboard
    const redirectUrl = redirectTo || "/dashboard"
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  } catch (error) {
    console.error("Login route error:", error)
    return NextResponse.redirect(
      new URL("/login?message=An unexpected error occurred", request.url)
    )
  }
} 