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
  const [stage, setStage] = useState<'intro' | 'quiz'>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(userData.quizAnswers || {});
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const totalQuestions = quizQuestions.length;
  const progress = (currentIndex / totalQuestions) * 100;
  const current = quizQuestions[currentIndex];

  async function handleSkip() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Optionnel: s'assurer que checkup_completed reste false
        await supabase.from('user_onboarding').update({ checkup_completed: false }).eq('user_id', user.id);
      }
    } catch (err) {
      console.log('Erreur Supabase skip:', err);
    }
    window.location.href = "/dashboard";
  }

  const handleSelect = async (option: string) => {
    setAnswers(prev => ({ ...prev, [current.id]: option }));
    setTimeout(async () => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Calcul du score
        let score = 0;
        Object.values({ ...answers, [current.id]: option }).forEach((val, i) => {
          const idx = quizQuestions[i].options.indexOf(val as string);
          score += 5 - idx;
        });
        const finalScore = Math.round((score / (totalQuestions * 5)) * 100);
        updateUserData({ quizAnswers: { ...answers, [current.id]: option }, financialHealthScore: finalScore });
        // Marquer checkup_completed = true
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('user_onboarding').update({ checkup_completed: true }).eq('user_id', user.id);
          }
        } catch (err) { console.log('Erreur Supabase:', err); }
        onNext();
      }
    }, 200);
  };

  const handleBack = () => {
    if (stage === 'quiz' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (stage === 'quiz' && currentIndex === 0) {
      // Retour à l'intro
      setStage('intro');
    } else {
      onBack();
    }
  };

  // ---------- RENDER ----------
  if (stage === 'intro') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Card className="rounded-2xl shadow-lg border-0 bg-white max-w-xl w-full">
          <CardHeader className="text-center pb-0">
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Check-up financeiro</CardTitle>
            <CardDescription className="text-gray-600 text-base mb-4 px-6">
              Responda a um rápido questionário para avaliarmos sua saúde financeira e oferecer recomendações personalizadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-8 flex flex-col gap-4">
            <Button className="w-full rounded-full py-3 bg-emerald-600 hover:bg-emerald-700 text-lg font-semibold" onClick={() => setStage('quiz')}>
              Continuar check-up
            </Button>
            <Button variant="outline" className="w-full rounded-full py-3" onClick={handleSkip}>
              Pular por agora
            </Button>
            <p className="text-xs text-gray-400 text-center mt-2">Você pode fazer o check-up depois no painel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // stage === 'quiz'
  return (
    <div className="w-full flex items-center justify-center">
      <Card className="rounded-2xl shadow-xl border-emerald-100 bg-white/90 backdrop-blur-sm max-w-2xl w-full">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3 text-2xl">
            {current.icon}
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900 mb-1">{current.category}</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            {currentIndex + 1} / {totalQuestions}
          </CardDescription>
          <div className="mt-3">
            <Progress value={progress} className="h-1.5" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-6">
          <div className="text-center">
            <Label className="text-lg font-semibold text-gray-900 mb-4 block leading-snug px-4">{current.question}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 px-2">
              {current.options.map(option => (
                <Button
                  key={option}
                  type="button"
                  size="sm"
                  variant={answers[current.id] === option ? "default" : "outline"}
                  className={`w-full py-3 rounded-full text-sm font-medium transition-all duration-150 ${answers[current.id] === option ? "bg-emerald-600 text-white" : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"}`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex justify-between pt-4 px-2">
            <Button
              onClick={handleBack}
              variant="outline"
              className="rounded-full px-5 py-2 text-sm"
            >
              ← Voltar
            </Button>
            <div className="text-gray-400 text-xs pt-2">{currentIndex + 1} / {totalQuestions}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 