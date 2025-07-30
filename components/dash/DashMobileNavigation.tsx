"use client"

import React from "react";
import { 
  Home, 
  FileText, 
  Gift, 
  Heart, 
  MoreHorizontal 
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
  { id: 'home', label: 'Início', icon: Home, color: 'blue' },
  { id: 'payslip', label: 'Holerite', icon: FileText, color: 'green' },
  { id: 'benefits', label: 'Benefícios', icon: Gift, color: 'orange' },
  { id: 'wellbeing', label: 'Bem-estar', icon: Heart, color: 'pink' },
  { id: 'more', label: 'Mais', icon: MoreHorizontal, color: 'gray' }
];

export default function DashMobileNavigation({ 
  activeTab, 
  onTabChange 
}: DashMobileNavigationProps) {
  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center py-2 px-3 flex-1 transition-all duration-200 relative"
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-${item.color}-500 rounded-full`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                {/* Icon */}
                <Icon 
                  className={`w-6 h-6 mb-1 transition-colors duration-200 ${
                    isActive 
                      ? `text-${item.color}-600` 
                      : 'text-gray-500'
                  }`} 
                />
                
                {/* Label */}
                <span 
                  className={`text-xs font-medium transition-colors duration-200 ${
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