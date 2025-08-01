import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'; // Pour éviter les erreurs de cookies

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 })
  }

  const { id: payslipId } = await params

  const { data: payslip, error } = await supabase
    .from('payslips')
    .select(`
      *,
      payslip_items ( * )
    `)
    .eq('id', payslipId)
    .eq('user_id', user.id) // Sécurité : l'utilisateur ne peut récupérer que ses propres bulletins
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(payslip)
} 