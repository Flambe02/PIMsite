import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }
  // Ici, tu peux ajouter une vérification de rôle admin si tu as un champ is_admin ou similaire
  // Exemple :
  // const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  // if (!profile?.is_admin) return NextResponse.json({ error: 'Interdit' }, { status: 403 });

  const { uid } = await req.json();
  const edgeUrl = process.env.NEXT_PUBLIC_SUPABASE_DELETE_USER_URL || "https://<TON-PROJET>.functions.supabase.co/delete-user";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const res = await fetch(edgeUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({ uid }),
  });

  const text = await res.text();
  if (res.ok) {
    return NextResponse.json({ ok: true });
  } else {
    return new NextResponse(text, { status: res.status });
  }
} 