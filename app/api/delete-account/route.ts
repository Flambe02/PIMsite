import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: 'userId manquant' }, { status: 400 });
  // Supprime les données associées
  await supabase.from('profiles').delete().eq('id', userId);
  await supabase.from('analyses').delete().eq('user_id', userId);
  // Supprime l'utilisateur Auth
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
} 