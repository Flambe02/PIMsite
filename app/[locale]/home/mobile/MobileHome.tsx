"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BarChart3, FileText, Search, Shield, ChevronUp, Upload, MessageCircle, User, Home, Calculator } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { TrustBadges } from "@/components/trust-badges"
import { ChatButton } from "@/components/chat-button"
import dynamic from "next/dynamic"
import { useIsMobile } from "@/hooks/use-mobile"

const LoginModal = dynamic(() => import("@/components/LoginModal").then(m => m.LoginModal), {
  loading: () => <div className="py-8 text-center text-emerald-900">Chargement du module de connexion...</div>,
  ssr: false
})

// Contenu localisé par pays (réutilisé depuis la page principale)
const localizedContent = {
  br: {
    hero: {
      title: "Entenda seu Holerite e Economize Otimizando seus Benefícios",
      subtitle: "Faça upload do seu holerite ou preencha os dados manualmente para ver os resultados",
      signupButton: "Sign up",
      simulateButton: "Simular",
      features: [
        "Tarificação transparente",
        "Onboarding rápido", 
        "Suporte dedicado"
      ]
    },
    process: {
      title: "Como funciona",
      steps: [
        {
          title: "Upload do holerite ou preenchimento manual",
          desc: "Envie seu holerite ou preencha os dados em poucos cliques."
        },
        {
          title: "Análise inteligente pela IA",
          desc: "Nossa IA analisa seus dados de forma segura e rápida."
        },
        {
          title: "Recomendações personalizadas",
          desc: "Receba dicas práticas para otimizar seus benefícios."
        }
      ]
    },
    testimonials: {
      rating: "4.8/5",
      reviews: "(2.143 avaliações)",
      data: [
        {
          name: "Lucas",
          quote: "O PIM me ajudou a entender meus benefícios e economizar de verdade!",
          city: "São Paulo, Analista RH",
          img: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
          name: "Mariana", 
          quote: "Fácil, rápido e super seguro. Recomendo para todos os colegas!",
          city: "Belo Horizonte, Engenheira",
          img: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
          name: "Carlos",
          quote: "Recebi dicas personalizadas que fizeram diferença no meu salário.",
          city: "Curitiba, Desenvolvedor", 
          img: "https://randomuser.me/api/portraits/men/65.jpg"
        }
      ]
    },
    features: {
      title: "Principais Recursos",
      subtitle: "Ferramentas poderosas para maximizar seu bem-estar financeiro",
      items: [
        {
          title: "Segurança Total",
          desc: "Criptografia de nível bancário e conformidade com LGPD. Seus dados nunca são compartilhados."
        },
        {
          title: "Análise Completa", 
          desc: "Avaliação de todos seus benefícios, impostos e contribuições para identificar oportunidades."
        },
        {
          title: "Recomendações Personalizadas",
          desc: "Dicas práticas e personalizadas para otimizar seus benefícios e salário."
        },
        {
          title: "Busca Inteligente",
          desc: "Encontre rapidamente informações sobre benefícios, impostos e direitos trabalhistas."
        }
      ]
    },
    cta: {
      title: "Pronto para Otimizar seus Benefícios?",
      subtitle: "Junte-se a mais de 2.000 profissionais que já melhoraram suas finanças.",
      button: "Comece Grátis Agora"
    }
  },
  fr: {
    hero: {
      title: "Comprenez votre Bulletin de Paie et Économisez en Optimisant vos Avantages",
      subtitle: "Téléchargez votre bulletin de paie ou saisissez les données manuellement pour voir les résultats",
      signupButton: "S'inscrire",
      simulateButton: "Simuler",
      features: [
        "Tarification transparente",
        "Onboarding rapide",
        "Support dédié"
      ]
    },
    process: {
      title: "Comment ça marche",
      steps: [
        {
          title: "Téléchargement du bulletin ou saisie manuelle",
          desc: "Envoyez votre bulletin de paie ou saisissez les données en quelques clics."
        },
        {
          title: "Analyse intelligente par IA",
          desc: "Notre IA analyse vos données de manière sécurisée et rapide."
        },
        {
          title: "Recommandations personnalisées",
          desc: "Recevez des conseils pratiques pour optimiser vos avantages."
        }
      ]
    },
    testimonials: {
      rating: "4.8/5",
      reviews: "(2.143 avis)",
      data: [
        {
          name: "Thomas",
          quote: "PIM m'a aidé à comprendre mes avantages et à vraiment économiser !",
          city: "Paris, Analyste RH",
          img: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
          name: "Sophie",
          quote: "Facile, rapide et très sécurisé. Je recommande à tous mes collègues !",
          city: "Lyon, Ingénieure",
          img: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
          name: "Pierre",
          quote: "J'ai reçu des conseils personnalisés qui ont fait la différence sur mon salaire.",
          city: "Marseille, Développeur",
          img: "https://randomuser.me/api/portraits/men/65.jpg"
        }
      ]
    },
    features: {
      title: "Fonctionnalités Principales",
      subtitle: "Outils puissants pour maximiser votre bien-être financier",
      items: [
        {
          title: "Sécurité Totale",
          desc: "Chiffrement de niveau bancaire et conformité RGPD. Vos données ne sont jamais partagées."
        },
        {
          title: "Analyse Complète",
          desc: "Évaluation de tous vos avantages, impôts et cotisations pour identifier les opportunités."
        },
        {
          title: "Recommandations Personnalisées",
          desc: "Conseils pratiques et personnalisés pour optimiser vos avantages et salaire."
        },
        {
          title: "Recherche Intelligente",
          desc: "Trouvez rapidement des informations sur les avantages, impôts et droits du travail."
        }
      ]
    },
    cta: {
      title: "Prêt à Optimiser vos Avantages ?",
      subtitle: "Rejoignez plus de 2.000 professionnels qui ont déjà amélioré leurs finances.",
      button: "Commencer Gratuitement"
    }
  }
};

// Import des composants de base mobile
import { MobilePageWrapper, FAB, BottomTabBar } from "@/components/mobile"

// Section Hero Mobile
function MobileHeroSection({ locale }: { locale: string }) {
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
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted) {
          setSession(session)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching session:', error)
        if (mounted) setLoading(false)
      }
    }
    fetchSession()
    return () => { mounted = false }
  }, [supabase])

  const handleSignUp = () => {
    if (session) {
      router.push(`/${locale}/dashboard`)
    } else {
      setLoginOpen(true)
    }
  }

  const handleSimule = () => {
    router.push(`/${locale}/calculadora`)
  }

  const content = localizedContent[locale as keyof typeof localizedContent] || localizedContent.br

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a2e22] to-[#16251b] text-white overflow-hidden px-4">
      {/* Fond avec effet de profondeur */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a2e22]/50 to-[#16251b] z-0" />
      
      {/* Motif grille SVG mobile */}
      <svg className="absolute inset-0 w-full h-full opacity-5" style={{zIndex:0}} xmlns="http://www.w3.org/2000/svg" fill="none">
        <defs>
          <pattern id="grid-mobile" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#fff" strokeWidth="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-mobile)"/>
      </svg>
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm mx-auto text-center gap-6">
        {/* Logo/Titre principal */}
        <div className="mb-4">
          <h1 className="font-bold text-3xl leading-tight drop-shadow-lg mb-3">
            {content.hero.title}
          </h1>
          <p className="text-base text-emerald-100 leading-relaxed">
            {content.hero.subtitle}
          </p>
        </div>

        {/* CTA Buttons - Stack vertical sur mobile */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-4 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 transition text-base w-full"
            onClick={handleSignUp}
            type="button"
            disabled={loading}
          >
            {content.hero.signupButton}
          </button>
          <button
            className="bg-[#223c2c] hover:bg-[#2e4a38] text-emerald-200 font-semibold px-6 py-4 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 transition text-base border border-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed w-full"
            onClick={handleSimule}
            type="button"
            disabled={loading}
          >
            {content.hero.simulateButton}
          </button>
        </div>

        {/* USP line - Compact sur mobile */}
        <div className="flex flex-col items-center gap-2 mt-4">
          {content.hero.features.map((feature, index) => (
            <span key={index} className="flex items-center gap-2 text-emerald-200 text-sm">
              <span className="inline-block bg-emerald-500 rounded-full w-4 h-4 flex items-center justify-center">
                <svg width="10" height="10" fill="none" viewBox="0 0 20 20">
                  <path d="M7 10.5l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {feature}
            </span>
          ))}
        </div>
      </div>
      
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </section>
  )
}

// Section Process Mobile - Compact avec icônes cliquables
function MobileProcessSection({ locale }: { locale: string }) {
  const content = localizedContent[locale as keyof typeof localizedContent] || localizedContent.br
  
  const steps = content.process.steps.map((step, index) => ({
    ...step,
    icon: (
      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xl font-bold">
        {index + 1}
      </div>
    )
  }))

  return (
    <section className="w-full py-8 bg-[#223c2c] text-white px-4">
      <div className="max-w-sm mx-auto">
        <h2 className="text-xl font-bold text-center mb-6">{content.process.title}</h2>
        
        {/* Steps verticaux pour mobile */}
        <div className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4 bg-[#1a2e22] rounded-xl shadow-lg border border-[#2e4a38] p-4">
              <div className="flex-shrink-0">
                {step.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-1 text-emerald-200">{step.title}</h3>
                <p className="text-emerald-100 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Section Testimonials Mobile - Carrousel compact
function MobileTestimonialsSection({ locale }: { locale: string }) {
  const content = localizedContent[locale as keyof typeof localizedContent] || localizedContent.br
  const [currentIndex, setCurrentIndex] = useState(0)
  
  return (
    <section className="w-full py-8 bg-[#16251b] text-white px-4">
      <div className="max-w-sm mx-auto">
        {/* Rating header */}
        <div className="flex items-center justify-center mb-6">
          <span className="text-emerald-300 font-bold text-lg mr-2">{content.testimonials.rating}</span>
          <div className="flex text-yellow-400 mr-2">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className={`h-4 w-4 ${i===5 ? 'text-gray-700' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-emerald-200 text-xs">{content.testimonials.reviews}</span>
        </div>
        
        {/* Testimonial carousel */}
        <div className="relative">
          <div className="bg-[#223c2c] rounded-xl shadow-lg p-6 flex flex-col items-center text-center border border-[#2e4a38]">
            <Image
              src={content.testimonials.data[currentIndex].img}
              alt={content.testimonials.data[currentIndex].name}
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover mb-3 border-4 border-emerald-900"
            />
            <div className="font-semibold text-emerald-300 mb-1 text-sm">
              {content.testimonials.data[currentIndex].name}
            </div>
            <div className="text-emerald-100 italic mb-2 text-sm leading-relaxed">
              "{content.testimonials.data[currentIndex].quote}"
            </div>
            <div className="text-xs text-emerald-200">
              {content.testimonials.data[currentIndex].city}
            </div>
          </div>
          
          {/* Carousel dots */}
          <div className="flex justify-center mt-4 gap-2">
            {content.testimonials.data.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-emerald-400' : 'bg-emerald-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Section Features Mobile - Compact
function MobileFeaturesSection({ locale }: { locale: string }) {
  const content = localizedContent[locale as keyof typeof localizedContent] || localizedContent.br

  return (
    <section className="w-full py-8 bg-white px-4">
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">{content.features.title}</h2>
          <p className="text-gray-500 text-sm">{content.features.subtitle}</p>
        </div>
        
        <div className="space-y-4">
          {content.features.items.map((item, index) => (
            <div key={index} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 flex-shrink-0">
                {index === 0 && <Shield className="h-5 w-5 text-emerald-600" />}
                {index === 1 && <BarChart3 className="h-5 w-5 text-emerald-600" />}
                {index === 2 && <FileText className="h-5 w-5 text-emerald-600" />}
                {index === 3 && <Search className="h-5 w-5 text-emerald-600" />}
              </div>
              <div>
                <h3 className="text-base font-bold mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Section CTA Mobile - Call to action final
function MobileCTASection({ locale }: { locale: string }) {
  const content = localizedContent[locale as keyof typeof localizedContent] || localizedContent.br

  return (
    <section className="w-full py-8 bg-emerald-50 px-4">
      <div className="max-w-sm mx-auto text-center">
        <div className="space-y-3 mb-6">
          <h2 className="text-2xl font-bold tracking-tighter">
            {content.cta.title}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {content.cta.subtitle}
          </p>
        </div>
        
        <Link href={`/${locale}/login`}>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-4 rounded-xl shadow-lg w-full">
            {content.cta.button}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  )
}

// Floating Action Button pour diagnostic rapide
function FloatingActionButton({ locale }: { locale: string }) {
  return (
    <FAB 
      href={`/${locale}/calculadora`}
      icon={<Upload className="w-6 h-6" />}
      label="Commencer un diagnostic"
    />
  )
}

// Composant principal MobileHome
export default function MobileHome({ locale }: { locale: string }) {
  return (
    <MobilePageWrapper title="Accueil PIM">
      <MobileHeroSection locale={locale} />
      <MobileProcessSection locale={locale} />
      
      {/* Trust Badges - Version mobile */}
      <div className="py-6 bg-white">
        <TrustBadges />
      </div>
      
      <MobileFeaturesSection locale={locale} />
      <MobileTestimonialsSection locale={locale} />
      <MobileCTASection locale={locale} />
      
      {/* Chat Button - Version mobile */}
      <div className="fixed bottom-20 left-4 z-40 md:hidden">
        <ChatButton />
      </div>
    </MobilePageWrapper>
  )
} 