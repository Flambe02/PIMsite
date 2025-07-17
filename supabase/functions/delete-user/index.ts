/* eslint-disable */
// @ts-nocheck
// Deno Edge Function : suppression définitive d'un utilisateur

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// @ts-ignore
const env = Deno.env.toObject();

// Charger les variables d'environnement
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// @ts-ignore
serve(async (req: any) => {
  // Vérification du header Authorization
  const authHeader = req.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`) {
    return new Response(
      JSON.stringify({ code: 401, message: "Missing or invalid authorization header" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { uid } = await req.json();
    if (!uid) return new Response("uid manquant", { status: 400 });

    // Suppression en cascade des données liées dans toutes les tables avec user_id
    await supabase.from('payroll_analysis_results').delete().eq('user_id', uid);
    await supabase.from('audit_logs').delete().eq('user_id', uid);
    await supabase.from('user_payslip_uploads').delete().eq('user_id', uid);
    await supabase.from('chat_conversations').delete().eq('user_id', uid);
    await supabase.from('onboarding_events').delete().eq('user_id', uid);
    await supabase.from('holerites').delete().eq('user_id', uid);
    await supabase.from('payslips').delete().eq('user_id', uid);
    await supabase.from('user_onboarding').delete().eq('user_id', uid);
    await supabase.from('analyses').delete().eq('user_id', uid);

    // Puis supprime l'utilisateur Auth
    const { error } = await supabase.auth.admin.deleteUser(uid, false);
    if (error) {
      // Ajoute ce log pour voir l'erreur dans les logs Supabase
      console.log("Supabase error:", error.message);
      return new Response(error.message, { status: 500 });
    }

    return new Response("OK");
  } catch (err) {
    // Log aussi les erreurs inattendues
    console.log("Unexpected error:", err);
    return new Response(String(err), { status: 400 });
  }
}); 