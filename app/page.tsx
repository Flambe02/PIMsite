"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BarChart3, FileText, Search, Shield, ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { TrustBadges } from "@/components/trust-badges"
import { ClientLogos } from "@/components/client-logos"
import { ChatButton } from "@/components/chat-button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Logo />
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Início
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/recursos">
            Recursos
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/guia-paises">
            Guia de Países
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/precos">
            Preços
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/sobre">
            Sobre
          </Link>
        </nav>
        <div className="ml-4 flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Entrar
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              Cadastrar
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-20 lg:py-24 bg-gradient-to-br from-emerald-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium mb-2">
                  Para CLT, PJ ou Estagiários
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Entenda seu Holerite e Economize Otimizando seus Benefícios
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed">
                  Faça upload do seu holerite em um clique e receba 5 passos personalizados em 2 minutos.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row items-start">
                  <Link href="/dashboard">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm">
                      Comece Grátis - Sem Cartão
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href="/chat-com-pim"
                    className="text-sm text-emerald-700 hover:text-emerald-800 mt-2 ml-1 flex items-center"
                  >
                    <Image
                      src="/images/pim-avatar.png"
                      alt="PIM"
                      width={24}
                      height={24}
                      className="rounded-full mr-1"
                    />
                    Converse com PIM
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[500px] rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/dashboard-analysis.png"
                    alt="Análise de folha de pagamento e alocação de benefícios"
                    width={500}
                    height={350}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <TrustBadges />
        <ClientLogos />

        <section className="w-full py-8 md:py-12 bg-white">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 md:gap-10 lg:grid-cols-3">
              <div className="flex flex-col justify-center space-y-4 border rounded-lg p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Upload Rápido</h3>
                  <p className="text-gray-500">
                    Envie seu holerite em 10 segundos. Suporte para PDF, foto ou entrada manual.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 border rounded-lg p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Search className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Análise Inteligente</h3>
                  <p className="text-gray-500">
                    Nossa IA identifica seus benefícios e encontra oportunidades de economia em segundos.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 border rounded-lg p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <BarChart3 className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Ações Práticas</h3>
                  <p className="text-gray-500">
                    Receba passos concretos para otimizar seus benefícios e aumentar seu salário líquido.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Principais Recursos</h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
                  Ferramentas poderosas para maximizar seu bem-estar financeiro
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold">Segurança Total</h3>
                </div>
                <p className="text-gray-500">
                  Criptografia de nível bancário e conformidade com LGPD. Seus dados nunca são compartilhados.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <BarChart3 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold">Análise Completa</h3>
                </div>
                <p className="text-gray-500">
                  Avaliação de todos seus benefícios, impostos e contribuições para identificar oportunidades.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <Search className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold">Recomendações Personalizadas</h3>
                </div>
                <p className="text-gray-500">
                  Sugestões adaptadas ao seu perfil, empresa e objetivos financeiros específicos.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold">Biblioteca de Recursos</h3>
                </div>
                <p className="text-gray-500">
                  Guias práticos sobre benefícios, impostos e finanças pessoais para decisões informadas.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-20 bg-emerald-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Pronto para Otimizar seus Benefícios?
                </h2>
                <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed">
                  Junte-se a mais de 2.000 profissionais que já melhoraram suas finanças.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/cadastro">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm">
                    Comece Grátis Agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

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
      </main>

      {/* Sticky CTA Button */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Link href="/dashboard">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-full shadow-lg flex items-center">
            Comece Grátis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Back to Top Button - Shows after scrolling */}
      <div className="fixed bottom-6 left-6 z-50 hidden" id="back-to-top">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-md bg-white h-10 w-10"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      </div>

      {/* Chat with PIM Button */}
      <ChatButton />
    </div>
  )
}
