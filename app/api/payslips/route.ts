import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }
  const { data: holerites, error: holeritesError } = await supabase
    .from('holerites')
    .select('id, nome, empresa, perfil, salario_bruto, salario_liquido, created_at, structured_data')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (holeritesError) {
    return NextResponse.json({ error: holeritesError.message }, { status: 500 });
  }
  return NextResponse.json(holerites);
} 