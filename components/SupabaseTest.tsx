"use client";
import React, { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SupabaseTest(): React.ReactElement {
  useEffect(() => {
    // 1. Log l'URL Supabase injectée au build
    console.log("process.env.NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

    // 2. Instancie le client Supabase
    const supabase = createClient();

    // 3. Teste la connectivité Supabase
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Supabase connectivity error:", error);
      } else {
        console.log("Supabase session (connectivity OK):", data.session);
      }
    });
  }, []);

  // 4. Affiche un message discret
  return (
    <div style={{ fontSize: 12, color: "#888", margin: 8 }}>
      SupabaseTest: see console
    </div>
  );
} 