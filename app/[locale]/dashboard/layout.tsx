import OnboardingRedirect from "@/components/OnboardingRedirect"
import { BarChart3, Gift, Heart, Shield, TrendingUp, UserCircle, Upload } from "lucide-react";
import MobileTabBar from "@/components/mobile/MobileTabBar";

export const dynamic = 'force-dynamic';

const navItems = [
  { label: "Upload Holerite", icon: <Upload className="w-5 h-5" />, color: "bg-green-50 text-green-700 hover:bg-green-100" },
  { label: "Compensação", icon: <BarChart3 className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
  { label: "Benefícios", icon: <Gift className="w-5 h-5" />, color: "text-gray-700 hover:text-gray-900" },
  { label: "Bem-estar", icon: <Heart className="w-5 h-5" />, color: "text-gray-700 hover:text-gray-900" },
  { label: "Seguros", icon: <Shield className="w-5 h-5" />, color: "text-gray-700 hover:text-gray-900" },
  { label: "Investimentos", icon: <TrendingUp className="w-5 h-5" />, color: "text-gray-700 hover:text-gray-900" },
  { label: "Dados", icon: <UserCircle className="w-5 h-5" />, color: "text-gray-700 hover:text-gray-900" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <OnboardingRedirect>
        <div className="flex-1 pb-20 md:pb-0">
          {children}
        </div>
        {/* Footer personnalisé du dashboard - Desktop uniquement */}
        <footer className="hidden md:block w-full border-t bg-white py-4 px-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {navItems.map((item, index) => (
              <button
                key={index}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${item.color}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </footer>
        {/* Navigation mobile - Mobile uniquement */}
        <div className="md:hidden">
          <MobileTabBar current="compensacao" />
        </div>
      </OnboardingRedirect>
    </div>
  )
} 