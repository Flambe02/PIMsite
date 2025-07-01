import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    // Get origin with fallback
    const origin = request.nextUrl.origin || 'http://localhost:3000'
    console.log('Signup request origin:', origin)
    console.log('Request URL:', request.url)
    
    const formData = await request.formData()
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    console.log('Form data received:', { email: email ? 'present' : 'missing', password: password ? 'present' : 'missing', confirmPassword: confirmPassword ? 'present' : 'missing' })

    if (!email || !password || !confirmPassword) {
      const redirectUrl = new URL('/cadastro', origin)
      redirectUrl.searchParams.set('message', 'All fields are required')
      console.log('Redirecting to:', redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }

    if (password !== confirmPassword) {
      const redirectUrl = new URL('/cadastro', origin)
      redirectUrl.searchParams.set('message', 'Passwords do not match')
      console.log('Redirecting to:', redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }

    if (password.length < 6) {
      const redirectUrl = new URL('/cadastro', origin)
      redirectUrl.searchParams.set('message', 'Password must be at least 6 characters long')
      console.log('Redirecting to:', redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      console.error("Signup error:", error.message)
      const redirectUrl = new URL('/cadastro', origin)
      redirectUrl.searchParams.set('message', error.message)
      console.log('Redirecting to:', redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }

    // Successful signup - redirect to login with success message
    const redirectUrl = new URL('/login', origin)
    redirectUrl.searchParams.set('message', 'Check your email to confirm your account')
    console.log('Redirecting to:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error("Signup route error:", error)
    const origin = request.nextUrl.origin || 'http://localhost:3000'
    const redirectUrl = new URL('/cadastro', origin)
    redirectUrl.searchParams.set('message', 'An unexpected error occurred')
    console.log('Redirecting to:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl)
  }
} 