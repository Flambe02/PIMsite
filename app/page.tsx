"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BarChart3, FileText, Search, Shield, ChevronUp } from "lucide-react"
import { useState, useEffect } from "react"

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
    <section id="hero-section" className="w-full py-12 md:py-20 lg:py-24 bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center">
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

function ProcessSection() {
  const steps = [
    {
      title: "Upload do holerite ou preenchimento manual",
      desc: "Envie seu holerite ou preencha os dados em poucos cliques.",
      icon: <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-2xl">1</div>,
    },
    {
      title: "Análise inteligente pela IA",
      desc: "Nossa IA analisa seus dados de forma segura e rápida.",
      icon: <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-2xl">2</div>,
    },
    {
      title: "Recomendações personalizadas",
      desc: "Receba dicas práticas para otimizar seus benefícios.",
      icon: <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl">3</div>,
    },
  ];
  return (
    <section className="w-full py-4 md:py-6 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Como funciona</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 relative">
          {/* Ligne de progression */}
          <div className="hidden md:block absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-emerald-200 via-yellow-200 to-blue-200 z-0" style={{transform: 'translateY(-50%)'}} />
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center bg-white z-10 w-full md:w-1/3">
              <div className="mb-4 relative">
                {step.icon}
              </div>
              <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Lucas",
      quote: "O PIM me ajudou a entender meus benefícios e economizar de verdade!",
      city: "São Paulo, Analista RH",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Mariana",
      quote: "Fácil, rápido e super seguro. Recomendo para todos os colegas!",
      city: "Belo Horizonte, Engenheira",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Carlos",
      quote: "Recebi dicas personalizadas que fizeram diferença no meu salário.",
      city: "Curitiba, Desenvolvedor",
      img: "https://randomuser.me/api/portraits/men/65.jpg",
    },
  ];
  return (
    <section className="w-full py-8 md:py-14 bg-emerald-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-center mb-6">
          <span className="text-emerald-700 font-bold text-xl mr-2">4.8/5</span>
          <div className="flex text-yellow-400 mr-2">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className={`h-5 w-5 ${i===5 ? 'text-gray-300' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
          </div>
          <span className="text-gray-600 text-sm">(2.143 avaliações)</span>
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch justify-center">
          {testimonials.map((t, i) => (
            <div key={i} className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-emerald-100">
              <img src={t.img} alt={t.name} className="w-16 h-16 rounded-full object-cover mb-3 border-4 border-emerald-100" />
              <div className="font-semibold text-emerald-700 mb-1">{t.name}</div>
              <div className="text-gray-800 italic mb-2">“{t.quote}”</div>
              <div className="text-xs text-gray-500">{t.city}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StickyCTA({ onCTAClick }: { onCTAClick: () => void }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero-section')
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      setVisible(rect.bottom < 0)
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!visible) return null
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-emerald-700 text-white flex items-center justify-between px-4 py-3 shadow-lg gap-4">
      <span className="font-semibold text-base">Otimize seus benefícios agora</span>
      <button
        className="bg-white text-emerald-700 font-bold px-6 py-2 rounded-full shadow hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition"
        onClick={onCTAClick}
      >
        Começar Grátis
      </button>
    </div>
  )
}

export default function Home() {
  const [showManual, setShowManual] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const handleStickyCTAClick = () => setShowUpload(true)

  return (
    <>
      <main className="flex-1">
        <HeroSection />
        <ProcessSection />
        <div className="mt-10 mb-10">
          <TrustBadges />
        </div>
        <section className="w-full py-6 md:py-10 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="mt-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-1">Principais Recursos</h2>
              <p className="text-lg text-gray-500 text-center mb-5">Ferramentas poderosas para maximizar seu bem-estar financeiro</p>
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

        <TestimonialsSection />

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
      </main>
      {/* Sticky CTA Button */}
      <StickyCTA onCTAClick={handleStickyCTAClick} />
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
    </>
  )
}
