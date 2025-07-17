import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { uid } = await req.json();
  const authHeader = req.headers.get("authorization");

  // URL de l'Edge Function Supabase (à adapter si besoin)
  const edgeUrl = process.env.NEXT_PUBLIC_SUPABASE_DELETE_USER_URL
    || "https://<TON-PROJET>.functions.supabase.co/delete-user";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log('Service role key:', serviceRoleKey ? 'OK' : 'MISSING', serviceRoleKey ? serviceRoleKey.slice(0,8) + '...' : '');
  console.log('Edge function URL:', edgeUrl);

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