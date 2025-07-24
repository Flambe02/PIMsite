import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { userId } = await req.json();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }
  if (userId !== user.id) {
    return NextResponse.json({ error: 'Interdit' }, { status: 403 });
  }
  // Supprime les données associées
  await supabase.from('profiles').delete().eq('id', userId);
  await supabase.from('analyses').delete().eq('user_id', userId);
  // Supprime l'utilisateur Auth
  const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
} 