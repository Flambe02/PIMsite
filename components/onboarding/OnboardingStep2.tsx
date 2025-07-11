"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { createBrowserClient } from "@supabase/ssr"

interface OnboardingStep2Props {
  userData: any
  updateUserData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

const quizQuestions = [
  {
    category: "Compensação",
    icon: "💰",
    id: "salary_month",
    question: "Seu salário dura confortavelmente até o final do mês?",
    options: ["Sempre", "Geralmente", "Às vezes", "Raramente", "Nunca"],
  },
  {
    category: "Compensação",
    icon: "💰",
    id: "salary_raises",
    question: "Com que frequência você recebe aumentos salariais?",
    options: ["Anualmente", "A cada 2 anos", "Ocasionalmente", "Raramente", "Nunca"],
  },
  {
    category: "Benefícios",
    icon: "🎁",
    id: "company_benefits",
    question: "Sua empresa oferece benefícios suficientes?",
    options: ["Excelentes", "Bons", "Médios", "Poucos", "Nenhum"],
  },
  {
    category: "Benefícios",
    icon: "🎁",
    id: "benefits_usage",
    question: "Você utiliza regularmente todos os benefícios disponíveis?",
    options: ["Todos", "A maioria", "Alguns", "Poucos", "Nenhum"],
  },
  {
    category: "Benefícios",
    icon: "🍽️",
    id: "food_allowance",
    question: "Você recebe atualmente Vale Alimentação ou Vale Refeição?",
    options: ["Ambos", "Um deles", "Parcial", "Nenhum"],
  },
  {
    category: "Benefícios",
    icon: "🍽️",
    id: "food_satisfaction",
    question: "Você está satisfeito com o valor fornecido?",
    options: ["Muito satisfeito", "Satisfeito", "Neutro", "Insatisfeito", "Muito insatisfeito"],
  },
  {
    category: "Bem-estar",
    icon: "💖",
    id: "work_life_balance",
    question: "Como você avalia seu equilíbrio trabalho-vida?",
    options: ["Excelente", "Bom", "Médio", "Ruim", "Muito ruim"],
  },
  {
    category: "Bem-estar",
    icon: "💖",
    id: "employer_support",
    question: "Sua empresa apoia ativamente seu bem-estar?",
    options: ["Muito apoiadora", "Apoiadora", "Neutra", "Pouco apoiadora", "Não apoiadora"],
  },
  {
    category: "Seguros",
    icon: "🛡️",
    id: "health_insurance",
    question: "Você possui um plano de saúde adequado?",
    options: ["Abrangente", "Bom", "Básico", "Limitado", "Nenhum"],
  },
  {
    category: "Seguros",
    icon: "🛡️",
    id: "accident_coverage",
    question: "Você está coberto contra acidentes e doenças críticas?",
    options: ["Totalmente coberto", "Majoritariamente coberto", "Parcialmente coberto", "Minimamente coberto", "Não coberto"],
  },
  {
    category: "Investimentos",
    icon: "📊",
    id: "regular_investing",
    question: "Você investe regularmente uma parte da sua renda?",
    options: ["Sempre", "Geralmente", "Às vezes", "Raramente", "Nunca"],
  },
  {
    category: "Investimentos",
    icon: "📊",
    id: "investment_confidence",
    question: "Quão confiante você se sente ao tomar decisões de investimento?",
    options: ["Muito confiante", "Confiante", "Algo confiante", "Pouco confiante", "Nada confiante"],
  },
  {
    category: "Fiscal",
    icon: "🟢",
    id: "income_tax_understanding",
    question: "Você entende como funciona o Imposto de Renda (IR)?",
    options: ["Excelente", "Bom", "Básico", "Pouco", "Nenhum"],
  },
  {
    category: "Fiscal",
    icon: "🟢",
    id: "tax_deductions",
    question: "Você utiliza deduções médicas ou educacionais no IR?",
    options: ["Sempre", "Geralmente", "Às vezes", "Raramente", "Nunca"],
  },
  {
    category: "Previdência",
    icon: "🔵",
    id: "private_pension",
    question: "Você possui atualmente um plano de previdência privada (PGBL/VGBL)?",
    options: ["Ambos", "Um deles", "Considerando", "Não interessado", "Nenhum"],
  },
  {
    category: "Previdência",
    icon: "🔵",
    id: "pension_understanding",
    question: "Você entende as vantagens fiscais e funcionamento dos planos de previdência?",
    options: ["Excelente", "Bom", "Básico", "Pouco", "Nenhum"],
  },
]

export default function OnboardingStep2({ userData, updateUserData, onNext, onBack }: OnboardingStep2Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>(userData.quizAnswers || {})
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const totalQuestions = quizQuestions.length
  const progress = ((currentIndex) / totalQuestions) * 100
  const current = quizQuestions[currentIndex]

  const handleSelect = async (option: string) => {
    setAnswers(prev => ({ ...prev, [current.id]: option }))
    setTimeout(async () => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        // Calcul du score (simple, pondéré par la position de la réponse)
        let score = 0
        Object.values({ ...answers, [current.id]: option }).forEach((val, i) => {
          const idx = quizQuestions[i].options.indexOf(val as string)
          score += 5 - idx // 5 pour la meilleure réponse, 1 pour la pire
        })
        const finalScore = Math.round((score / (totalQuestions * 5)) * 100)
        updateUserData({ quizAnswers: { ...answers, [current.id]: option }, financialHealthScore: finalScore })
        // Mise à jour Supabase : user_onboarding.checkup_completed = true
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { error } = await supabase
              .from('user_onboarding')
              .update({ checkup_completed: true })
              .eq('user_id', user.id);
            if (error) console.log('Erreur update user_onboarding:', error.message);
          }
        } catch (err) {
          console.log('Erreur Supabase:', err);
        }
        onNext()
      }
    }, 200)
  }

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
    else onBack()
  }

  return (
    <Card className="rounded-2xl shadow-xl border-emerald-100 bg-white/90 backdrop-blur-sm max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-3xl">
          {current.icon}
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{current.category}</CardTitle>
        <CardDescription className="text-lg text-gray-600">
          {currentIndex + 1} / {totalQuestions}
        </CardDescription>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="text-center">
          <Label className="text-xl font-semibold text-gray-900 mb-6 block">{current.question}</Label>
          <div className="flex flex-col gap-4 mt-6">
            {current.options.map(option => (
              <Button
                key={option}
                type="button"
                size="lg"
                variant={answers[current.id] === option ? "default" : "outline"}
                className={`w-full py-4 rounded-full text-lg font-semibold transition-all duration-150 ${answers[current.id] === option ? "bg-emerald-600 text-white" : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"}`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex justify-between pt-6">
          <Button
            onClick={handleBack}
            variant="outline"
            className="rounded-full px-6 py-3"
          >
            ← Voltar
          </Button>
          <div className="text-gray-400 text-sm pt-3">{currentIndex + 1} / {totalQuestions}</div>
        </div>
      </CardContent>
    </Card>
  )
} 