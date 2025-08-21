import UnifiedSalaryCalculatorWrapper from "@/components/unified-salary-calculator-wrapper";
import Link from "next/link"
import Image from "next/image"

export default function SimuladorPage() {
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
            <UnifiedSalaryCalculatorWrapper mode="basic" />
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
