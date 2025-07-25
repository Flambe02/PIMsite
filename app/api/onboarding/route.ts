import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { userData } = await request.json()
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    // Save onboarding data to user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        nome: `${userData.firstName || userData.nomePreferido || ''}`,
        email: userData.email,
        empresa: userData.company || userData.empresa,
        tipo_profissional: userData.employmentStatus || userData.setor,
        tem_filhos: userData.hasChildren,
        financial_health_score: userData.financialHealthScore,
        quiz_answers: userData.quizAnswers,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
        numero_filhos: userData.numeroFilhos,
        estado_civil: userData.estadoCivil,
        genero: userData.genero,
        nascimento: userData.nascimento,
        cidade: userData.cidade,
        pais: userData.pais,
        setor: userData.setor,
        tamanho: userData.tamanho,
        localizacao: userData.localizacao,
        telefone: userData.telefone,
        interesses: userData.interesses,
      })

    if (profileError) {
      console.error("Profile update error:", profileError)
      return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
    }

    // If payslip data was provided, save it
    if (userData.payslipData) {
      const { error: payslipError } = await supabase
        .from('holerites')
        .insert({
          user_id: user.id,
          method: userData.payslipData.method,
          data: userData.payslipData.data || {},
          processed: true,
          created_at: new Date().toISOString()
        })

      if (payslipError) {
        console.error("Payslip save error:", payslipError)
        // Don't fail the entire onboarding if payslip save fails
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Onboarding route error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 