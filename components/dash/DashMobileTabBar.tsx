"use client"

import React from "react";
import { 
  Home, 
  BarChart3, 
  Gift, 
  Shield, 
  TrendingUp, 
  Heart, 
  Users, 
  Calendar,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface DashMobileTabBarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const navItems: NavItem[] = [
  { id: 'Overview', label: 'Início', icon: Home, color: 'blue' },
  { id: 'Salário', label: 'Salário', icon: BarChart3, color: 'green' },
  { id: 'Benefícios', label: 'Benefícios', icon: Gift, color: 'orange' },
  { id: 'Seguros', label: 'Seguros', icon: Shield, color: 'purple' },
  { id: 'Investimentos', label: 'Investimentos', icon: TrendingUp, color: 'emerald' },
  { id: 'Well-being', label: 'Bem-estar', icon: Heart, color: 'pink' },
  { id: 'Direitos Sociais', label: 'Direitos', icon: Users, color: 'indigo' },
  { id: 'Histórico & Documentos', label: 'Histórico', icon: Calendar, color: 'gray' }
];

export default function DashMobileTabBar({ 
  activeTab, 
  onTabChange 
}: DashMobileTabBarProps) {
  // Trouver l'index du tab actif
  const activeIndex = navItems.findIndex(item => item.id === activeTab);
  
  // Afficher tous les items pour permettre la navigation horizontale
  const visibleItems = navItems;
  
  // Fonction pour centrer le tab actif
  const centerActiveTab = () => {
    const activeElement = document.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
    const container = document.querySelector('.mobile-tab-container') as HTMLElement;
    
    if (activeElement && container) {
      const containerWidth = container.clientWidth;
      const elementWidth = activeElement.clientWidth;
      const elementLeft = activeElement.offsetLeft;
      
      // Calculer la position pour centrer parfaitement
      const scrollLeft = elementLeft - (containerWidth / 2) + (elementWidth / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };
  
  // Auto-scroll vers le tab actif avec centrage parfait
  React.useEffect(() => {
    // Délai pour s'assurer que le DOM est prêt
    const timer = setTimeout(() => {
      centerActiveTab();
    }, 100);

    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <>
      {/* Mobile Bottom Tab Bar - Style iOS/Android optimisé - Toujours visible */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
        <div className="flex overflow-x-auto scrollbar-hide px-2 py-2 mobile-tab-container relative">
          {/* Indicateur de centrage (optionnel) */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200 opacity-30 pointer-events-none"></div>
          {visibleItems.map((item, index) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                data-tab={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center py-2 px-3 transition-all duration-300 relative min-h-[60px] justify-center whitespace-nowrap ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-${item.color}-500 rounded-full`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                {/* Icon - Plus grande sur mobile, encore plus grande si actif */}
                <Icon 
                  className={`mb-1 transition-all duration-200 ${
                    isActive 
                      ? `w-7 h-7 text-${item.color}-600` 
                      : 'w-6 h-6 text-gray-500'
                  }`} 
                />
                
                {/* Label - Plus court et plus grand, plus gros si actif */}
                <span 
                  className={`font-semibold transition-all duration-200 ${
                    isActive 
                      ? `text-sm text-${item.color}-600` 
                      : 'text-xs text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile bottom padding to account for bottom nav */}
      <div className="md:hidden h-20"></div>
    </>
  );
} 