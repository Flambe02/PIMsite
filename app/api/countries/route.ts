import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'br';
  let { data, error } = await supabase
    .from('countries')
    .select('code, name')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // Localisation côté API pour BR
  if (data) {
    data = data.map((c: any) => ({
      ...c,
      name: (c.code === 'BR') ? (locale === 'fr' ? 'Brésil' : 'Brasil') : c.name
    }));
  }
  return NextResponse.json(data || []);
} 