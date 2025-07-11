"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

interface OnboardingRedirectProps {
  children: React.ReactNode
}

export default function OnboardingRedirect({ children }: OnboardingRedirectProps) {
  return <>{children}</>;
} 