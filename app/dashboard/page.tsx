"use client"
import Link from "next/link"
import Image from "next/image"
import { BarChart3, FileText, Shield, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { SalaryCalculator } from "@/components/salary-calculator"
import { PayslipUpload } from "@/components/payslip-upload"
import { PayslipList } from "@/components/payslip-list"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-blue-900">Tableau de Bord</h1>
              <p className="text-gray-600 mt-2">
                Gérez vos bulletins de paie et analysez vos salaires avec nos outils avancés.
              </p>
            </div>

            {/* Bulletins de Paie Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Upload className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-blue-900">Bulletins de Paie</h2>
              </div>
              
              <div className="grid gap-6 lg:grid-cols-2">
                <PayslipUpload />
                <PayslipList />
              </div>
            </div>

            {/* Calculateur de Salaire Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-blue-900">Calculateur de Salaire</h2>
              </div>
              <SalaryCalculator />
            </div>

            <div className="grid gap-6 md:grid-cols-3 mt-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Análises Anteriores</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Você ainda não analisou nenhum documento.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Economia Potencial</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 0</div>
                  <p className="text-xs text-muted-foreground">
                    Envie seu primeiro documento para ver economias potenciais.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pontuação de Otimização</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">N/A</div>
                  <p className="text-xs text-muted-foreground">
                    Complete sua primeira análise para obter sua pontuação.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <div className="flex items-center">
          <Image src="/images/pimentao-logo.png" alt="Logo Pimentão Rouge" width={32} height={32} className="h-8 w-auto mr-2" />
          <p className="text-xs text-gray-500">© 2025 The Pimentão Rouge Company. Todos os direitos reservados.</p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Termos de Serviço
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  )
}
