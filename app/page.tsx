"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BarChart3, FileText, Search, Shield, ChevronUp } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"

import { Button } from "@/components/ui/button"
import { TrustBadges } from "@/components/trust-badges"
import { ChatButton } from "@/components/chat-button"
import { LoginModal } from "@/components/LoginModal"
// import { useUserOnboarding } from "@/hooks/useUserOnboarding" // Removed: unused

function HeroSection() {
  const [session, setSession] = useState<any>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    let mounted = true
    async function fetchSession() {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(session)
      setLoading(false)
    }
    fetchSession()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => {
      mounted = false
      listener?.subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignUp = () => {
    router.push("/signup")
  }
  // Removed unused handleLogin
  const handleSimule = () => {
    if (!session) {
      setLoginOpen(true)
    } else {
      router.push("/dashboard")
    }
  }

  // Afficher un loader uniquement pendant le chargement initial
  const isLoading = loading

  return (
    <section id="hero-section" className="relative w-full min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-[#1a2e22] to-[#16251b] text-white overflow-hidden py-24">
      {/* Motif grille SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-10" style={{zIndex:0}} xmlns="http://www.w3.org/2000/svg" fill="none"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-3xl mx-auto text-center gap-8">
        <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-tight drop-shadow-lg mb-4">
          Entenda seu Holerite e Economize Otimizando seus Benefícios
        </h1>
        <p className="text-lg md:text-2xl text-emerald-100 mb-8">
          Faça upload do seu holerite ou preencha os dados manualmente para ver os resultados
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
            <button
            className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 transition text-lg"
            onClick={handleSignUp}
              type="button"
            disabled={isLoading}
            >
            Sign up
            </button>
            <button
            className="bg-[#223c2c] hover:bg-[#2e4a38] text-emerald-200 font-semibold px-8 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 transition text-lg border border-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleSimule}
              type="button"
            disabled={isLoading}
            >
            Simular
            </button>
        </div>
        {/* USP line */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <span className="flex items-center gap-2 text-emerald-200 text-base"><span className="inline-block bg-emerald-500 rounded-full w-5 h-5 flex items-center justify-center"><svg width="14" height="14" fill="none" viewBox="0 0 20 20"><path d="M7 10.5l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>Tarificação transparente</span>
          <span className="flex items-center gap-2 text-emerald-200 text-base"><span className="inline-block bg-emerald-500 rounded-full w-5 h-5 flex items-center justify-center"><svg width="14" height="14" fill="none" viewBox="0 0 20 20"><path d="M7 10.5l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>Onboarding rápido</span>
          <span className="flex items-center gap-2 text-emerald-200 text-base"><span className="inline-block bg-emerald-500 rounded-full w-5 h-5 flex items-center justify-center"><svg width="14" height="14" fill="none" viewBox="0 0 20 20"><path d="M7 10.5l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>Suporte dedicado</span>
        </div>
        <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      </div>
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
    <section className="w-full py-12 bg-[#223c2c] text-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Como funciona</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
          {/* Ligne de progression */}
          <div className="hidden md:block absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-emerald-400 via-yellow-400 to-blue-400 z-0 opacity-30" style={{transform: 'translateY(-50%)'}} />
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center bg-[#1a2e22] rounded-2xl shadow-lg border border-[#2e4a38] z-10 w-full md:w-1/3 p-6">
              <div className="mb-4 relative">
                {step.icon}
              </div>
              <h3 className="font-semibold text-lg mb-1 text-emerald-200">{step.title}</h3>
              <p className="text-emerald-100 text-sm mb-2">{step.desc}</p>
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
    <section className="w-full py-12 bg-[#16251b] text-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-center mb-6">
          <span className="text-emerald-300 font-bold text-xl mr-2">4.8/5</span>
          <div className="flex text-yellow-400 mr-2">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className={`h-5 w-5 ${i===5 ? 'text-gray-700' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
          </div>
          <span className="text-emerald-200 text-sm">(2.143 avaliações)</span>
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch justify-center">
          {testimonials.map((t, i) => (
            <div key={i} className="flex-1 bg-[#223c2c] rounded-xl shadow-lg p-6 flex flex-col items-center text-center border border-[#2e4a38]">
              <Image
                src={t.img}
                alt={t.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover mb-3 border-4 border-emerald-900"
              />
              <div className="font-semibold text-emerald-300 mb-1">{t.name}</div>
              <div className="text-emerald-100 italic mb-2">“{t.quote}”</div>
              <div className="text-xs text-emerald-200">{t.city}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  // Removed unused handleStickyCTAClick

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
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Recomendações Personalizadas</h3>
                  <p className="text-gray-600 text-base">Dicas práticas e personalizadas para otimizar seus benefícios e salário.</p>
                </div>
              </div>
              {/* Busca Inteligente */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 mx-auto md:mx-0">
                  <Search className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Busca Inteligente</h3>
                  <p className="text-gray-600 text-base">Encontre rapidamente informações sobre benefícios, impostos e direitos trabalhistas.</p>
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
              <Link href="/login">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm">
                  Comece Grátis Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
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
