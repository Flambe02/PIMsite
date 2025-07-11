"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface FinancialHealthScoreProps {
  score: number
  previousScore?: number
}

export default function FinancialHealthScore({ score, previousScore }: FinancialHealthScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-yellow-600"
    if (score >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-emerald-100"
    if (score >= 60) return "bg-yellow-100"
    if (score >= 40) return "bg-orange-100"
    return "bg-red-100"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excelente"
    if (score >= 60) return "Bom"
    if (score >= 40) return "Regular"
    return "Precisa Melhorar"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return "🏆"
    if (score >= 60) return "✅"
    if (score >= 40) return "⚠️"
    return "📈"
  }

  const getTrendIcon = () => {
    if (!previousScore) return <Minus className="w-4 h-4 text-gray-400" />
    if (score > previousScore) return <TrendingUp className="w-4 h-4 text-emerald-600" />
    if (score < previousScore) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getTrendText = () => {
    if (!previousScore) return "Novo"
    if (score > previousScore) return `+${score - previousScore}pts`
    if (score < previousScore) return `${score - previousScore}pts`
    return "Sem mudança"
  }

  const getTrendColor = () => {
    if (!previousScore) return "text-gray-500"
    if (score > previousScore) return "text-emerald-600"
    if (score < previousScore) return "text-red-600"
    return "text-gray-500"
  }

  return (
    <Card className="rounded-2xl shadow-lg border-emerald-100 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Saúde Financeira</CardTitle>
            <CardDescription className="text-gray-600">
              Seu indicador de bem-estar financeiro
            </CardDescription>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getScoreBackground(score)}`}>
            {getScoreIcon(score)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Score Display */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-lg text-gray-500">/100</span>
          </div>
          <p className={`text-lg font-semibold ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progresso</span>
            <span>{score}%</span>
          </div>
          <Progress value={score} className="h-3" />
        </div>

        {/* Trend */}
        <div className="flex items-center justify-center space-x-2 pt-2">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {getTrendText()}
          </span>
        </div>

        {/* Categories Overview */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Compensação</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min(score + 10, 100)}%` }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Benefícios</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(score + 5, 100)}%` }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Seguros</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min(score - 5, 100)}%` }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Investimentos</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min(score - 10, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 