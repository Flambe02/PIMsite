import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error("Logout error:", error.message)
      return NextResponse.redirect(
        new URL("/dashboard?message=Error signing out", request.url)
      )
    }

    // Successful logout - redirect to home page
    return NextResponse.redirect(new URL("/", request.url))
  } catch (error) {
    console.error("Logout route error:", error)
    return NextResponse.redirect(
      new URL("/dashboard?message=An unexpected error occurred", request.url)
    )
  }
} 