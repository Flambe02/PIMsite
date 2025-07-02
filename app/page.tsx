"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BarChart3, FileText, Search, Shield, ChevronUp } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { TrustBadges } from "@/components/trust-badges"
import { ChatButton } from "@/components/chat-button"

const HERO_TEXT = {
  title: "Entenda seu Holerite e Economize Otimizando seus Benefícios",
  subtitle: "Faça upload do seu holerite ou preencha os dados manualmente para ver os resultados",
  upload: "Fazer upload do holerite",
  manual: "Preencher manualmente",
  security: "100% seguro. Seus dados nunca serão compartilhados."
}

function HeroSection() {
  const [showManual, setShowManual] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  return (
    <section className="w-full py-12 md:py-20 lg:py-24 bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center">
      <div className="container mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Colonne gauche : texte */}
        <div className="flex-1 flex flex-col items-start justify-center space-y-6 max-w-2xl w-full">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium mb-2">Para CLT, PJ ou Estagiários</span>
          <h1 className="font-bold text-4xl md:text-5xl leading-tight">{HERO_TEXT.title}</h1>
          <p className="text-lg md:text-xl text-gray-600 mt-2">{HERO_TEXT.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-start mt-2">
            <button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 transition"
              onClick={() => setShowUpload(true)}
              type="button"
            >
              {HERO_TEXT.upload}
            </button>
            <button
              className="bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 transition"
              onClick={() => setShowManual(true)}
              type="button"
            >
              {HERO_TEXT.manual}
            </button>
          </div>
          <span className="text-xs text-gray-500 mt-2">{HERO_TEXT.security}</span>
        </div>
        {/* Colonne droite : image */}
        <div className="flex-1 flex items-center justify-center w-full max-w-xl mx-auto lg:mx-0">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-6BkboFHypQ21vOUXShB9EYLfuvsqhj.png" alt="Folha de pagamento e alocação de benefícios" className="w-full max-w-lg h-auto object-contain rounded-2xl shadow-xl" />
        </div>
      </div>
      {/* Modals */}
      {showManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowManual(false)} aria-label="Fechar">✕</button>
            <h2 className="text-lg font-bold mb-4">Preencher manualmente</h2>
            <p className="text-sm text-gray-600 mb-4">(Aqui irá o formulário passo a passo...)</p>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded" onClick={() => setShowManual(false)}>Fechar</button>
          </div>
        </div>
      )}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowUpload(false)} aria-label="Fechar">✕</button>
            <h2 className="text-lg font-bold mb-4">Fazer upload do holerite</h2>
            <p className="text-sm text-gray-600 mb-4">(Aqui irá o workflow de upload...)</p>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded" onClick={() => setShowUpload(false)}>Fechar</button>
          </div>
        </div>
      )}
    </section>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <main className="flex-1">
        <HeroSection />

        <TrustBadges />

        <section className="w-full py-12 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="w-full flex justify-center">
              <div className="grid gap-8 md:grid-cols-3 items-center justify-center max-w-4xl w-full">
                {/* Upload Rápido */}
                <div className="flex flex-col items-center text-center justify-center space-y-4 border rounded-lg p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">Upload Rápido</h3>
                    <p className="text-gray-500">Envie seu holerite em 10 segundos. Suporte para PDF, foto ou entrada manual.</p>
                  </div>
                </div>
                {/* Análise Inteligente */}
                <div className="flex flex-col items-center text-center justify-center space-y-4 border rounded-lg p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <Search className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">Análise Inteligente</h3>
                    <p className="text-gray-500">Nossa IA identifica seus benefícios e encontra oportunidades de economia em segundos.</p>
                  </div>
                </div>
                {/* Ações Práticas */}
                <div className="flex flex-col items-center text-center justify-center space-y-4 border rounded-lg p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <BarChart3 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">Ações Práticas</h3>
                    <p className="text-gray-500">Receba passos concretos para otimizar seus benefícios e aumentar seu salário líquido.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-16">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Principais Recursos</h2>
              <p className="text-lg text-gray-500 text-center mb-10">Ferramentas poderosas para maximizar seu bem-estar financeiro</p>
            </div>
            <div className="grid gap-10 md:grid-cols-2">
              {/* Segurança Total */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 mx-auto md:mx-0">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Segurança Total</h3>
                  <p className="text-gray-600 text-base">Criptografia de nível bancário e conformidade com LGPD. Seus dados nunca são compartilhados.</p>
                </div>
              </div>
              {/* Análise Completa */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 mx-auto md:mx-0">
                  <BarChart3 className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Análise Completa</h3>
                  <p className="text-gray-600 text-base">Avaliação de todos seus benefícios, impostos e contribuições para identificar oportunidades.</p>
                </div>
              </div>
              {/* Recomendações Personalizadas */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 mx-auto md:mx-0">
                  <Search className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Recomendações Personalizadas</h3>
                  <p className="text-gray-600 text-base">Sugestões adaptadas ao seu perfil, empresa e objetivos financeiros específicos.</p>
                </div>
              </div>
              {/* Biblioteca de Recursos */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 mx-auto md:mx-0">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Biblioteca de Recursos</h3>
                  <p className="text-gray-600 text-base">Guias práticos sobre benefícios, impostos e finanças pessoais para decisões informadas.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-20 bg-emerald-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 flex flex-col items-center text-center">
            <div className="space-y-2 mb-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Pronto para Otimizar seus Benefícios?
              </h2>
              <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed mx-auto">
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

      <footer className="w-full py-4 text-center text-xs text-gray-400">
        Version V0.0.1
      </footer>
    </div>
  )
}
