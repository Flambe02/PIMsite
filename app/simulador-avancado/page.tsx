import { SalaryCalculatorEnhanced } from "@/components/salary-calculator-enhanced"
import { Logo } from "@/components/logo"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createClient } from '@/lib/supabase/server'

export default async function SimuladorAvancadoPage() {
  const supabase = await createClient()
  
  // Fetch tax brackets for Brazil (default country)
  const { data: inssBrackets, error: inssError } = await supabase
    .from('tax_brackets')
    .select('*')
    .eq('country_id', 'brazil')
    .eq('tax_type', 'inss')
    .eq('year', 2025)
    .eq('is_active', true)
    .order('min_amount', { ascending: true })

  const { data: irrfBrackets, error: irrfError } = await supabase
    .from('tax_brackets')
    .select('*')
    .eq('country_id', 'brazil')
    .eq('tax_type', 'irrf')
    .eq('year', 2025)
    .eq('is_active', true)
    .order('min_amount', { ascending: true })

  // Handle errors gracefully
  if (inssError || irrfError) {
    console.error('Error fetching tax brackets:', { inssError, irrfError })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col gap-8 max-w-5xl mx-auto">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-blue-900">Calculadora de Salário Líquido</h1>
              <p className="text-gray-600 mt-2 max-w-3xl">
                Entenda o cálculo do salário líquido 2025 e faça uma simulação com nossa calculadora a partir do seu
                salário bruto, seus dependentes e descontos na folha de pagamento.
              </p>
            </div>

            <SalaryCalculatorEnhanced 
              inssBrackets={inssBrackets || []}
              irrfBrackets={irrfBrackets || []}
            />

            <div className="bg-gray-50 p-6 rounded-lg border">
              <h2 className="text-xl font-bold mb-4 text-blue-900">Informações sobre os Cálculos</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-blue-800 mb-2">Faixas de Contribuição INSS (2025)</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Até R$ 1.518,00: 7,5%</li>
                    <li>De R$ 1.518,01 até R$ 2.793,88: 9%</li>
                    <li>De R$ 2.793,89 até R$ 4.190,83: 12%</li>
                    <li>De R$ 4.190,84 até R$ 8.157,41: 14%</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-blue-800 mb-2">Faixas de Retenção IRRF (2025)</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Até R$ 2.259,20: Isento</li>
                    <li>De R$ 2.259,21 até R$ 2.826,65: 7,5% (dedução de R$ 169,44)</li>
                    <li>De R$ 2.826,66 até R$ 3.751,05: 15% (dedução de R$ 381,44)</li>
                    <li>De R$ 3.751,06 até R$ 4.664,68: 22,5% (dedução de R$ 662,77)</li>
                    <li>Acima de R$ 4.664,68: 27,5% (dedução de R$ 896,00)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-blue-800 mb-2">Deduções e Cálculos</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Dedução por dependente: R$ 189,59</li>
                    <li>Base de cálculo IRRF = Salário Bruto - INSS - (Dependentes × R$ 189,59)</li>
                    <li>Salário Líquido = Proventos - Deduções</li>
                    <li>Proventos = Salário Bruto + Benefícios + Horas Extras + Salário Família</li>
                    <li>Deduções = Contribuição INSS + Retenção IRRF + Outros descontos</li>
                  </ul>
                </div>
              </div>
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
