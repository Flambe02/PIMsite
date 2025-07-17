"use client";
import { createBrowserClient } from "@supabase/ssr";
import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import type { SupabaseClient, Session } from "@supabase/supabase-js";

interface SupabaseContextType {
  supabase: SupabaseClient;
  session: Session | null;
  loading: boolean;
}

export const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ initialSession, children }:{
  initialSession: Session | null; children: ReactNode
}) {
  const [supabaseClient] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [session, setSession] = useState(initialSession);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabaseClient]);

  const value = {
    supabase: supabaseClient,
    session,
    loading
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
} 