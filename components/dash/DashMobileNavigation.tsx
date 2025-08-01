"use client"

import React from "react";
import { 
  Home, 
  FileText, 
  Gift, 
  Heart, 
  MoreHorizontal,
  BarChart3,
  Shield,
  TrendingUp,
  Users,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface DashMobileNavigationProps {
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
  { id: 'Histórico & Documentos', label: 'Histórico', icon: Calendar, color: 'gray' },
  { id: 'Dados', label: 'Dados', icon: FileText, color: 'slate' }
];

export default function DashMobileNavigation({ 
  activeTab, 
  onTabChange 
}: DashMobileNavigationProps) {
  return (
    <>
      {/* Mobile Bottom Navigation - Style iOS/Android */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
        <div className="flex justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center py-2 px-1 flex-1 transition-all duration-200 relative min-h-[60px] justify-center"
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
                
                {/* Icon - Plus grande sur mobile */}
                <Icon 
                  className={`w-7 h-7 mb-1 transition-colors duration-200 ${
                    isActive 
                      ? `text-${item.color}-600` 
                      : 'text-gray-500'
                  }`} 
                />
                
                {/* Label - Plus court et plus grand */}
                <span 
                  className={`text-xs font-semibold transition-colors duration-200 ${
                    isActive 
                      ? `text-${item.color}-600` 
                      : 'text-gray-500'
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