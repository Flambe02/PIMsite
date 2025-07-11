"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Mail, Building2, Briefcase, Baby } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

interface OnboardingStep1Props {
  userData: any
  updateUserData: (data: any) => void
  onNext: () => void
}

export default function OnboardingStep1({ userData, updateUserData, onNext }: OnboardingStep1Props) {
  const [formData, setFormData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    company: userData.company || "",
    employmentStatus: userData.employmentStatus || "",
    hasChildren: userData.hasChildren || false
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateUserData(formData);
    // Mise à jour Supabase : user_onboarding.profile_completed = true
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('user_onboarding')
          .update({ profile_completed: true })
          .eq('user_id', user.id);
        if (error) console.log('Erreur update user_onboarding:', error.message);
      }
    } catch (err) {
      console.log('Erreur Supabase:', err);
    }
    onNext();
  }

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.employmentStatus

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl rounded-3xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <span className="text-3xl">👋</span>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Bem-vindo ao PIM!
          </CardTitle>
          <CardDescription className="text-xl text-gray-600 mt-3">
            Vamos começar criando sua conta e conhecendo seu perfil profissional
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Nome e Sobrenome */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Seu nome"
                  className="h-12 text-lg border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Sobrenome
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Seu sobrenome"
                  className="h-12 text-lg border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Profissional
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="seu.email@empresa.com"
                className="h-12 text-lg border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                required
              />
            </div>

            {/* Empresa */}
            <div className="space-y-3">
              <Label htmlFor="company" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Empresa
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Nome da sua empresa"
                className="h-12 text-lg border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              />
            </div>

            {/* Status Profissional */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Status Profissional
              </Label>
              <RadioGroup
                value={formData.employmentStatus}
                onValueChange={(value) => handleInputChange("employmentStatus", value)}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { value: "CLT", label: "CLT", icon: "💼" },
                  { value: "PJ", label: "PJ", icon: "🏢" },
                  { value: "Intern", label: "Estagiário", icon: "🎓" },
                  { value: "Other", label: "Outro", icon: "🔧" }
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                      formData.employmentStatus === option.value
                        ? "border-emerald-500 bg-emerald-50 shadow-md"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                    onClick={() => handleInputChange("employmentStatus", option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                    <span className="text-2xl">{option.icon}</span>
                    <Label htmlFor={option.value} className="cursor-pointer font-semibold text-gray-700">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Filhos */}
            <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-300 transition-all">
              <Checkbox
                id="hasChildren"
                checked={formData.hasChildren}
                onCheckedChange={(checked) => handleInputChange("hasChildren", checked)}
                className="w-5 h-5"
              />
              <Label htmlFor="hasChildren" className="cursor-pointer font-semibold text-gray-700 flex items-center gap-2">
                <Baby className="w-4 h-4" />
                Você tem filhos?
              </Label>
            </div>

            {/* CTA Button */}
            <Button
              type="submit"
              disabled={!isFormValid}
              className="w-full h-14 rounded-2xl text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              Continuar →
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 