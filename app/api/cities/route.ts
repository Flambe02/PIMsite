import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const country_code = searchParams.get('country_code');
  if (!country_code) return NextResponse.json([], { status: 200 });
  const { data, error } = await supabase
    .from('cities')
    .select('name')
    .eq('country_code', country_code)
    .order('name', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
} 