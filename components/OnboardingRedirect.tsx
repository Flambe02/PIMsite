"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation"

interface OnboardingRedirectProps {
  children: React.ReactNode
}

export default function OnboardingRedirect({ children }: OnboardingRedirectProps) {
  return <>{children}</>;
} 