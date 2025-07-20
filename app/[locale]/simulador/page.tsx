import SalaryCalculatorClientWrapper from "@/components/salary-calculator-client-wrapper";
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
            <SalaryCalculatorClientWrapper />
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="white"/>
            <path d="M12 18L13.09 14.26L20 13L13.09 12.74L12 6L10.91 12.74L4 13L10.91 14.26L12 18Z" fill="white"/>
          </svg>
        </div>
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
