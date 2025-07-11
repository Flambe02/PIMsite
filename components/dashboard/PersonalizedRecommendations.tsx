"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Shield, 
  Heart, 
  DollarSign, 
  Calculator, 
  PiggyBank,
  ArrowRight
} from "lucide-react"

interface PersonalizedRecommendationsProps {
  quizAnswers: Record<string, string>
  employmentStatus: string
  financialHealthScore: number
}

const getRecommendations = (quizAnswers: Record<string, string>, employmentStatus: string, score: number) => {
  const recommendations = []

  // Compensation recommendations
  if (quizAnswers.salary_month === "rarely" || quizAnswers.salary_month === "never") {
    recommendations.push({
      id: "budget_planning",
      category: "Compensação",
      icon: "💰",
      title: "Planejamento Orçamentário",
      description: "Considere criar um orçamento detalhado para melhorar o controle financeiro mensal.",
      priority: "high",
      action: "Criar orçamento"
    })
  }

  if (quizAnswers.salary_raises === "rarely" || quizAnswers.salary_raises === "never") {
    recommendations.push({
      id: "salary_negotiation",
      category: "Compensação",
      icon: "💰",
      title: "Negociação Salarial",
      description: "Desenvolva estratégias para negociar aumentos salariais com base no seu valor de mercado.",
      priority: "medium",
      action: "Ver estratégias"
    })
  }

  // Benefits recommendations
  if (quizAnswers.company_benefits === "poor" || quizAnswers.company_benefits === "none") {
    recommendations.push({
      id: "benefits_advocacy",
      category: "Benefícios",
      icon: "🎁",
      title: "Advocacia de Benefícios",
      description: "Proponha melhorias no pacote de benefícios da empresa com dados de mercado.",
      priority: "high",
      action: "Ver propostas"
    })
  }

  if (quizAnswers.food_allowance === "none") {
    recommendations.push({
      id: "food_allowance_negotiation",
      category: "Benefícios",
      icon: "🍽️",
      title: "Vale Alimentação",
      description: "Negocie a implementação de vale alimentação ou refeição com sua empresa.",
      priority: "medium",
      action: "Ver modelo"
    })
  }

  // Insurance recommendations
  if (quizAnswers.health_insurance === "limited" || quizAnswers.health_insurance === "none") {
    recommendations.push({
      id: "health_insurance_plan",
      category: "Seguros",
      icon: "🛡️",
      title: "Plano de Saúde",
      description: "Avalie opções de planos de saúde individuais ou familiares adequados.",
      priority: "high",
      action: "Comparar planos"
    })
  }

  if (quizAnswers.accident_coverage === "not_covered") {
    recommendations.push({
      id: "accident_insurance",
      category: "Seguros",
      icon: "🛡️",
      title: "Seguro de Acidentes",
      description: "Considere um seguro de acidentes pessoais para proteção adicional.",
      priority: "medium",
      action: "Ver opções"
    })
  }

  // Investment recommendations
  if (quizAnswers.regular_investing === "rarely" || quizAnswers.regular_investing === "never") {
    recommendations.push({
      id: "investment_start",
      category: "Investimentos",
      icon: "📊",
      title: "Começar a Investir",
      description: "Inicie com pequenos valores em aplicações de baixo risco como Tesouro Direto.",
      priority: "high",
      action: "Ver opções"
    })
  }

  if (quizAnswers.investment_confidence === "not_confident" || quizAnswers.investment_confidence === "not_at_all_confident") {
    recommendations.push({
      id: "financial_education",
      category: "Investimentos",
      icon: "📚",
      title: "Educação Financeira",
      description: "Participe de cursos e workshops sobre investimentos para aumentar sua confiança.",
      priority: "medium",
      action: "Ver cursos"
    })
  }

  // Tax knowledge recommendations
  if (quizAnswers.income_tax_understanding === "poor" || quizAnswers.income_tax_understanding === "none") {
    recommendations.push({
      id: "tax_education",
      category: "Conhecimento Fiscal",
      icon: "🟢",
      title: "Educação Fiscal",
      description: "Aprenda sobre deduções e otimizações fiscais para reduzir sua carga tributária.",
      priority: "medium",
      action: "Ver guias"
    })
  }

  // Pension recommendations
  if (quizAnswers.private_pension === "none") {
    recommendations.push({
      id: "pension_plan",
      category: "Previdência",
      icon: "🔵",
      title: "Plano de Previdência",
      description: "Considere um plano PGBL ou VGBL para complementar a aposentadoria.",
      priority: "medium",
      action: "Ver planos"
    })
  }

  // Employment status specific recommendations
  if (employmentStatus === "PJ") {
    recommendations.push({
      id: "pj_optimization",
      category: "Otimização PJ",
      icon: "💼",
      title: "Otimização PJ",
      description: "Explore estratégias para otimizar impostos e benefícios como PJ.",
      priority: "high",
      action: "Ver estratégias"
    })
  }

  if (employmentStatus === "CLT") {
    recommendations.push({
      id: "clt_benefits",
      category: "Benefícios CLT",
      icon: "📋",
      title: "Maximizar Benefícios CLT",
      description: "Aproveite ao máximo todos os benefícios disponíveis no regime CLT.",
      priority: "medium",
      action: "Ver benefícios"
    })
  }

  // Sort by priority and limit to top 6
  return recommendations
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
    })
    .slice(0, 6)
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, any> = {
    "Compensação": <DollarSign className="w-4 h-4" />,
    "Benefícios": <Heart className="w-4 h-4" />,
    "Seguros": <Shield className="w-4 h-4" />,
    "Investimentos": <TrendingUp className="w-4 h-4" />,
    "Conhecimento Fiscal": <Calculator className="w-4 h-4" />,
    "Previdência": <PiggyBank className="w-4 h-4" />,
    "Otimização PJ": <DollarSign className="w-4 h-4" />,
    "Benefícios CLT": <Heart className="w-4 h-4" />
  }
  return icons[category] || <TrendingUp className="w-4 h-4" />
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "bg-red-100 text-red-800 border-red-200"
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "low": return "bg-green-100 text-green-800 border-green-200"
    default: return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function PersonalizedRecommendations({ 
  quizAnswers, 
  employmentStatus, 
  financialHealthScore 
}: PersonalizedRecommendationsProps) {
  const recommendations = getRecommendations(quizAnswers, employmentStatus, financialHealthScore)

  if (recommendations.length === 0) {
    return (
      <Card className="rounded-2xl shadow-lg border-emerald-100 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Recomendações Personalizadas</CardTitle>
          <CardDescription className="text-gray-600">
            Parabéns! Sua saúde financeira está excelente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-gray-600">
              Continue mantendo suas boas práticas financeiras!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl shadow-lg border-emerald-100 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Recomendações Personalizadas</CardTitle>
        <CardDescription className="text-gray-600">
          Baseado no seu perfil e respostas do quiz
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={rec.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-lg">{rec.icon}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                    {rec.priority === "high" ? "Alta" : rec.priority === "medium" ? "Média" : "Baixa"} Prioridade
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    {getCategoryIcon(rec.category)}
                    <span>{rec.category}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{rec.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                
                <Button size="sm" className="rounded-full">
                  {rec.action}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 