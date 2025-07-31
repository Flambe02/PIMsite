"use client"

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSupabase } from "@/components/supabase-provider";
import { motion } from "framer-motion";
import DashHeader from "@/components/dash/DashHeader";
import DashSidebar from "@/components/dash/DashSidebar";
import DashHeroSection from "@/components/dash/DashHeroSection";
import DashMobileNavigation from "@/components/dash/DashMobileNavigation";
import DashHoleriteBlock from "@/components/dash/DashHoleriteBlock";
import DashFinancialCheckupBlock from "@/components/dash/DashFinancialCheckupBlock";
import DashBenefitsBlock from "@/components/dash/DashBenefitsBlock";
import DashRecommendationsBlock from "@/components/dash/DashRecommendationsBlock";
import DashInvestimentosBlock from "@/components/dash/DashInvestimentosBlock";
import { useFinancialCheckup } from "@/hooks/useFinancialCheckup";

// Modern placeholder components for future sections
const TotalCompensationBlock = ({ locale }: { locale: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300"
  >
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {locale === 'fr' ? 'Compensation Totale' : 'Compensação Total'}
          </h3>
          <p className="text-gray-600">
            {locale === 'fr' ? 'Salaire + avantages + pouvoir d\'achat' : 'Salário + benefícios + poder de compra'}
          </p>
        </div>
      </div>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 text-center">
        <div className="text-3xl font-bold text-green-600 mb-2">R$ 12.500</div>
        <p className="text-green-700 font-medium">
          {locale === 'fr' ? 'Valeur totale mensuelle' : 'Valor total mensal'}
        </p>
      </div>
    </div>
  </motion.div>
);

const SocialRightsBlock = ({ locale }: { locale: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300"
  >
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {locale === 'fr' ? 'Droits Sociaux' : 'Direitos Sociais'}
          </h3>
          <p className="text-gray-600">
            {locale === 'fr' ? '13ème mois, congés, FGTS' : '13º salário, férias, FGTS'}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-medium text-gray-900">13º Salário</span>
          </div>
          <span className="text-red-600 font-semibold">R$ 7.500</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
            </div>
            <span className="font-medium text-gray-900">FGTS</span>
          </div>
          <span className="text-blue-600 font-semibold">R$ 600</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function DashPage() {
  const params = useParams();
  const { supabase } = useSupabase();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [holeriteData, setHoleriteData] = useState<any>(null);

  // Get user session and data
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Fetch latest holerite data
          const { data: holerite } = await supabase
            .from('holerites')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (holerite) {
            setHoleriteData(holerite);
          }
        }
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [supabase]);

  // Get financial checkup data
  const { latestCheckup, loading: checkupLoading } = useFinancialCheckup(user?.id);

  const handleUploadHolerite = () => {
    window.location.href = `/br/scan-new-pim`;
  };

  const handleStartCheckup = () => {
    window.location.href = `/${params?.locale}/financial-checkup`;
  };

  // Calculate money score based on available data
  const calculateMoneyScore = () => {
    let score = 50; // Base score
    
    if (holeriteData) score += 20;
    if (latestCheckup) score += 15;
    if (holeriteData?.structured_data?.recommendations?.score_optimisation) {
      score += Math.min(15, holeriteData.structured_data.recommendations.score_optimisation / 10);
    }
    
    return Math.min(100, score);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {params?.locale === 'fr' ? 'Chargement...' : 'Carregando...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {params?.locale === 'fr' ? 'Accès Refusé' : 'Acesso Negado'}
          </h1>
          <p className="text-gray-600">
            {params?.locale === 'fr' 
              ? 'Vous devez être connecté pour accéder au tableau de bord.' 
              : 'Você precisa estar logado para acessar o Dash.'
            }
          </p>
        </div>
      </div>
    );
  }

  const moneyScore = calculateMoneyScore();
  const hasHolerite = !!holeriteData;
  const hasCheckup = !!latestCheckup;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <DashSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        locale={params?.locale as string}
        onUploadHolerite={handleUploadHolerite}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashHeader
          user={user}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          locale={params?.locale as string}
        />

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Hero Section */}
          <DashHeroSection
            moneyScore={moneyScore}
            hasHolerite={hasHolerite}
            hasCheckup={hasCheckup}
            onUploadHolerite={handleUploadHolerite}
            onStartCheckup={handleStartCheckup}
            locale={params?.locale as string}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
            {/* Payslip Analysis */}
            <motion.div
              key="holerite-block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <DashHoleriteBlock userId={user?.id} />
            </motion.div>

            {/* Financial Check-up */}
            <motion.div
              key="checkup-block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <DashFinancialCheckupBlock 
                latestCheckup={latestCheckup}
                loading={checkupLoading}
                onStartCheckup={handleStartCheckup}
              />
            </motion.div>

            {/* Total Compensation */}
            <motion.div
              key="compensation-block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <TotalCompensationBlock locale={params?.locale as string} />
            </motion.div>

            {/* Benefits & Insurance */}
            <motion.div
              key="benefits-block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <DashBenefitsBlock userId={user?.id} holeriteData={holeriteData} />
            </motion.div>

            {/* Investments & Retirement */}
            <motion.div
              key="investimentos-block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <DashInvestimentosBlock userId={user?.id} holeriteData={holeriteData} />
            </motion.div>

            {/* Social Rights */}
            <motion.div
              key="social-rights-block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <SocialRightsBlock locale={params?.locale as string} />
            </motion.div>

            {/* AI Recommendations */}
            <motion.div
              key="recommendations-block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="xl:col-span-3"
            >
              <DashRecommendationsBlock 
                holeriteData={holeriteData}
                checkupData={latestCheckup}
                userId={user?.id}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <DashMobileNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
} 