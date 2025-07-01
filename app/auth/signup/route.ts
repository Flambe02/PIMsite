import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!email || !password || !confirmPassword) {
      return NextResponse.redirect(
        new URL("/signup?message=All fields are required", request.url)
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.redirect(
        new URL("/signup?message=Passwords do not match", request.url)
      )
    }

    if (password.length < 6) {
      return NextResponse.redirect(
        new URL("/signup?message=Password must be at least 6 characters long", request.url)
      )
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.nextUrl.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error("Signup error:", error.message)
      return NextResponse.redirect(
        new URL(`/signup?message=${encodeURIComponent(error.message)}`, request.url)
      )
    }

    // Successful signup - redirect to login with success message
    return NextResponse.redirect(
      new URL("/login?message=Check your email to confirm your account", request.url)
    )
  } catch (error) {
    console.error("Signup route error:", error)
    return NextResponse.redirect(
      new URL("/signup?message=An unexpected error occurred", request.url)
    )
  }
} 