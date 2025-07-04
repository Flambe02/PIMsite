// Deno Edge Function : suppression définitive d'un utilisateur

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Charger les variables d'environnement
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  try {
    const { uid } = await req.json();
    if (!uid) return new Response("uid manquant", { status: 400 });

    const { error } = await supabase.auth.admin.deleteUser(uid, { hardDelete: true });
    if (error) return new Response(error.message, { status: 500 });

    return new Response("OK");
  } catch (err) {
    return new Response(String(err), { status: 400 });
  }
}); 