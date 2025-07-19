import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import VirtualPayslipClientWrapper from "@/components/virtual-payslip-client-wrapper"

export default function AnaliseHoleritePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800 mb-2">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  <span>Voltar ao Painel</span>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Análise de Holerite</h1>
                <p className="text-gray-500 mt-2">
                  Detalhamento completo do seu holerite com recomendações personalizadas.
                </p>
              </div>
            </div>
            <VirtualPayslipClientWrapper />
          </div>
        </div>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <div className="flex items-center">
          <Image src="/images/pimentao-logo.png" alt="Logo Pimentão Rouge" width={32} height={32} className="h-8 w-auto mr-2" />
          <p className="text-xs text-gray-500">© 2025 The Pimentão Rouge Company. Todos os droits reservados.</p>
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
