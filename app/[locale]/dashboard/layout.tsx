"use client"

import OnboardingRedirect from "@/components/OnboardingRedirect"
import { BarChart3, Gift, Heart, Shield, TrendingUp, UserCircle, Upload, DollarSign, Users, FileText } from "lucide-react";

import { useRouter, useParams } from "next/navigation";
import "@/styles/mobile-optimizations.css";

export const dynamic = 'force-dynamic';



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const params = useParams();
  const locale = typeof params!.locale === 'string' ? params!.locale : 'br';

  const handleNavClick = (label: string) => {
    if (label === "Upload Holerite") {
      router.push('/br/scan-new-pim');
    }
    // Ajouter d'autres actions pour les autres éléments de navigation si nécessaire
  };

  return (
    <div className="flex flex-col min-h-screen">
      <OnboardingRedirect>
        <div className="flex-1 pb-20 md:pb-0">
          {children}
        </div>


      </OnboardingRedirect>
    </div>
  )
} 