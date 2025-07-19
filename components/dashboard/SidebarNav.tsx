import {
  PiggyBank, Wallet, Heart, Calendar, GraduationCap, Shield, Bot, BarChart2, Briefcase, Umbrella, LineChart
} from "lucide-react";
import Link from "next/link";

const navSections = [
  {
    title: "Compensação",
    items: [
      { label: "Meu Salário", href: "/dashboard", icon: <Wallet className="w-5 h-5 mr-2" /> },
      { label: "Histórico", href: "/dashboard/historico", icon: <Briefcase className="w-5 h-5 mr-2" /> },
      { label: "Simulador", href: "/simulador", icon: <BarChart2 className="w-5 h-5 mr-2" /> },
    ],
  },
  {
    title: "Benefícios",
    items: [
      { label: "Comparador de Benefícios", href: "/dashboard/comparador", icon: <BarChart2 className="w-5 h-5 mr-2" /> },
      { label: "Vale/Refeição/Alimentação", href: "/dashboard/vales", icon: <PiggyBank className="w-5 h-5 mr-2" /> },
      { label: "Saúde", href: "/dashboard/saude", icon: <Heart className="w-5 h-5 mr-2" /> },
      { label: "Previdência", href: "/dashboard/previdencia", icon: <LineChart className="w-5 h-5 mr-2" /> },
    ],
  },
  {
    title: "Bem-estar",
    items: [
      { label: "Calendário", href: "/dashboard/calendario", icon: <Calendar className="w-5 h-5 mr-2" /> },
      { label: "Férias", href: "/dashboard/ferias", icon: <Calendar className="w-5 h-5 mr-2" /> },
      { label: "Educação Financeira", href: "/dashboard/educacao", icon: <GraduationCap className="w-5 h-5 mr-2" /> },
    ],
  },
  {
    title: "Seguros",
    items: [
      { label: "Seguro de Vida", href: "/dashboard/seguro-vida", icon: <Umbrella className="w-5 h-5 mr-2" /> },
      { label: "Plano de Saúde", href: "/dashboard/saude", icon: <Shield className="w-5 h-5 mr-2" /> },
    ],
  },
  {
    title: "Investimentos",
    items: [
      { label: "Meus Investimentos", href: "/dashboard/investimentos", icon: <LineChart className="w-5 h-5 mr-2" /> },
      { label: "Educação", href: "/dashboard/educacao", icon: <GraduationCap className="w-5 h-5 mr-2" /> },
      { label: "Simuladores", href: "/dashboard/simuladores", icon: <BarChart2 className="w-5 h-5 mr-2" /> },
    ],
  },
  {
    title: "Assistente",
    items: [
      { label: "Chatbot PIM", href: "/chat-com-pim", icon: <Bot className="w-5 h-5 mr-2" /> },
    ],
  },
];

export function SidebarNav() {
  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r px-4 py-8 gap-4">
      {navSections.map(section => (
        <div key={section.title} className="mb-2">
          <div className="text-xs font-bold text-emerald-700 uppercase mb-2 tracking-wider">{section.title}</div>
          <nav className="flex flex-col gap-1" aria-label={`Navigation ${section.title}`}>
            {section.items.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition group"
                aria-current={typeof window !== 'undefined' && window.location.pathname === item.href ? "page" : undefined}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      ))}
    </aside>
  );
} 