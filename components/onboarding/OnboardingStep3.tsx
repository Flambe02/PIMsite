"use client"

import UploadHolerite from "@/app/[locale]/calculadora/upload-holerite"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation";

interface OnboardingStep3Props {
  userData: any
  updateUserData: (data: any) => void
  onBack: () => void
}

export default function OnboardingStep3({ userData, updateUserData, onBack }: OnboardingStep3Props) {
  const [isSaving, setIsSaving] = useState(false)
  const [modo, setModo] = useState<null | 'upload' | 'manual'>(null)
  const params = useParams();
  const router = useRouter();
  const locale = typeof params?.locale === 'string' ? params?.locale : Array.isArray(params?.locale) ? params?.locale[0] : 'br';
  const supabase = createClient();

  const saveUserData = async (result: any) => {
    setIsSaving(true)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('holeriteResult', JSON.stringify(result))
        localStorage.setItem('userProfile', JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          company: userData.company,
          employmentStatus: userData.employmentStatus,
          hasChildren: userData.hasChildren,
          financialHealthScore: userData.financialHealthScore,
          quizAnswers: userData.quizAnswers
        }))
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            nome: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            empresa: userData.company,
            tipo_profissional: userData.employmentStatus,
            tem_filhos: userData.hasChildren,
            financial_health_score: userData.financialHealthScore,
            quiz_answers: userData.quizAnswers,
            onboarding_completed: true,
            updated_at: new Date().toISOString()
          })
        if (result) {
          await supabase
            .from('analyses')
            .insert({
              user_id: user.id,
              result: result,
              created_at: new Date().toISOString()
            })
        }
        try {
          const { error } = await supabase
            .from('user_onboarding')
            .update({
              profile_completed: true,
              checkup_completed: true,
              holerite_uploaded: true
            })
            .eq('user_id', user.id);
          if (error) console.log('Erro ao atualizar user_onboarding:', error.message);
        } catch (err) {
          console.log('Erro Supabase:', err);
        }
      }
      setTimeout(() => {
        router.push(`/${locale}/dashboard`)
      }, 500)
    } catch (error) {
      console.error('Erro ao salvar:', error)
      setTimeout(() => {
        router.push(`/${locale}/dashboard`)
      }, 500)
    } finally {
      setIsSaving(false)
    }
  }

  const handleResult = (result: any) => {
    updateUserData({ payslipData: result })
    saveUserData(result)
  }

  // UI moderne : choix du mode
  return (
    <Card className="rounded-2xl shadow-xl border-emerald-100 bg-white max-w-2xl w-full mx-auto">
      <CardHeader className="text-center pb-0">
        <CardTitle className="text-xl font-semibold text-gray-900 mb-1">Parabéns, seu cadastro está quase completo!</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Escolha como deseja fornecer seus dados salariais:
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 pb-6 px-6">
        {!modo && (
          <div className="flex flex-col gap-3 items-center">
            <button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-full transition"
              onClick={() => setModo('upload')}
            >
              Fazer upload do holerite
            </button>
            <span className="text-gray-500 font-semibold">ou</span>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-full transition"
              onClick={() => setModo('manual')}
            >
              Inserir dados manualmente
            </button>
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-3">
              <button
                onClick={onBack}
                className="flex-1 rounded-full px-6 py-3 border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition"
                disabled={isSaving}
              >
                ← Voltar
              </button>
              <button
                onClick={() => router.push(`/${locale}/dashboard`)}
                className="flex-1 rounded-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
              >
                Ir para o Dashboard
              </button>
            </div>
          </div>
        )}
        {modo === 'upload' && (
          <div>
            <div className="mb-4 text-lg font-semibold text-emerald-700">Upload do Holerite</div>
            <UploadHolerite onResult={handleResult} />
            <button
              onClick={() => setModo(null)}
              className="mt-4 text-emerald-600 underline"
              disabled={isSaving}
            >
              ← Voltar para as opções
            </button>
            <button
              onClick={() => router.push(`/${locale}/dashboard`)}
              className="mt-4 w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
              disabled={isSaving}
            >
              Ir para o Dashboard
            </button>
            {isSaving && (
              <div className="mt-4 text-center text-sm text-gray-600">
                Salvando dados...
              </div>
            )}
          </div>
        )}
        {modo === 'manual' && (
          <div className="flex flex-col items-center gap-4">
            <div className="mb-4 text-lg font-semibold text-blue-700">Inserir dados manualmente</div>
            {/* TODO: Adicionar aqui o formulário manual de dados salariais */}
            <div className="text-gray-500">Funcionalidade em breve!</div>
            <button
              onClick={() => setModo(null)}
              className="mt-4 text-blue-600 underline"
              disabled={isSaving}
            >
              ← Voltar para as opções
            </button>
            <button
              onClick={() => router.push(`/${locale}/dashboard`)}
              className="mt-2 w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
              disabled={isSaving}
            >
              Ir para o Dashboard
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 