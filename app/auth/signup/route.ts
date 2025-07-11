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

    const isJson = request.headers.get('accept')?.includes('application/json');
    if (!email || !password || !confirmPassword) {
      if (isJson) {
        return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      const redirectUrl = new URL('/login', origin)
      redirectUrl.searchParams.set('message', 'All fields are required')
      return NextResponse.redirect(redirectUrl)
    }

    if (password !== confirmPassword) {
      if (isJson) {
        return new Response(JSON.stringify({ error: 'Passwords do not match' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      const redirectUrl = new URL('/login', origin)
      redirectUrl.searchParams.set('message', 'Passwords do not match')
      return NextResponse.redirect(redirectUrl)
    }

    if (password.length < 6) {
      if (isJson) {
        return new Response(JSON.stringify({ error: 'Password must be at least 6 characters long' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      const redirectUrl = new URL('/login', origin)
      redirectUrl.searchParams.set('message', 'Password must be at least 6 characters long')
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
      if (isJson) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      // Si l'email existe déjà, redirige vers /login avec message
      if (error.message && error.message.toLowerCase().includes('already registered')) {
        const redirectUrl = new URL('/login', origin)
        redirectUrl.searchParams.set('message', 'Este email já possui uma conta. Faça login ou recupere sua senha.')
        redirectUrl.searchParams.set('email', email)
        return NextResponse.redirect(redirectUrl)
      }
      const redirectUrl = new URL('/login', origin)
      redirectUrl.searchParams.set('message', error.message)
      return NextResponse.redirect(redirectUrl)
    }

    // Successful signup - redirect to login with success message
    const redirectUrl = new URL('/login', origin)
    redirectUrl.searchParams.set('message', 'Check your email to confirm your account')
    console.log('Redirecting to:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    if (request.headers.get('accept')?.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    console.error("Signup route error:", error)
    const origin = request.nextUrl.origin || 'http://localhost:3000'
    const redirectUrl = new URL('/login', origin)
    redirectUrl.searchParams.set('message', 'An unexpected error occurred')
    console.log('Redirecting to:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl)
  }
} 