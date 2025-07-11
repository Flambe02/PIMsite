"use client"

import UploadHolerite from "@/app/calculadora/upload-holerite"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { createBrowserClient } from "@supabase/ssr"
import { useEffect, useState } from "react"

interface OnboardingStep3Props {
  userData: any
  updateUserData: (data: any) => void
  onBack: () => void
}

export default function OnboardingStep3({ userData, updateUserData, onBack }: OnboardingStep3Props) {
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const saveUserData = async (result: any) => {
    setIsSaving(true)
    try {
      // 1. Sauvegarde dans le localStorage
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

      // 2. Sauvegarde dans Supabase
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Mise à jour du profil utilisateur
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

        // Sauvegarde de l'analyse du holerite
        if (result) {
          await supabase
            .from('analyses')
            .insert({
              user_id: user.id,
              result: result,
              created_at: new Date().toISOString()
            })
        }
        // Mise à jour user_onboarding : toutes les étapes à true
        try {
          const { error } = await supabase
            .from('user_onboarding')
            .update({
              profile_completed: true,
              checkup_completed: true,
              holerite_uploaded: true
            })
            .eq('user_id', user.id);
          if (error) console.log('Erreur update user_onboarding:', error.message);
        } catch (err) {
          console.log('Erreur Supabase:', err);
        }
      }

      // 3. Redirection vers le dashboard
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 500)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      // En cas d'erreur, on redirige quand même avec les données du localStorage
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 500)
    } finally {
      setIsSaving(false)
    }
  }

  const handleResult = (result: any) => {
    // Met à jour les données utilisateur
    updateUserData({ payslipData: result })
    
    // Sauvegarde toutes les données
    saveUserData(result)
  }

  return (
    <Card className="rounded-2xl shadow-xl border-emerald-100 bg-white/90 backdrop-blur-sm max-w-xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Upload do Holerite</CardTitle>
        <CardDescription className="text-lg text-gray-600">
          Faça upload do seu holerite para análise automática
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UploadHolerite onResult={handleResult} />
        <div className="flex justify-between pt-6">
          <button
            onClick={onBack}
            className="rounded-full px-6 py-3 border border-emerald-200 bg-white text-emerald-700 font-semibold hover:bg-emerald-50 transition"
            disabled={isSaving}
          >
            ← Voltar
          </button>
        </div>
        {isSaving && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Salvando dados...
          </div>
        )}
      </CardContent>
    </Card>
  )
} 