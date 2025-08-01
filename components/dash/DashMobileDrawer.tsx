"use client"

import React from "react";
import { X, Home, BarChart3, Gift, Shield, TrendingUp, Heart, Users, Calendar, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface DashMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const navItems: NavItem[] = [
  { id: 'Overview', label: 'Overview', icon: Home, color: 'blue' },
  { id: 'Salário', label: 'Salário', icon: BarChart3, color: 'green' },
  { id: 'Benefícios', label: 'Benefícios', icon: Gift, color: 'orange' },
  { id: 'Seguros', label: 'Seguros', icon: Shield, color: 'purple' },
  { id: 'Investimentos', label: 'Investimentos', icon: TrendingUp, color: 'emerald' },
  { id: 'Well-being', label: 'Well-being', icon: Heart, color: 'pink' },
  { id: 'Direitos Sociais', label: 'Direitos Sociais', icon: Users, color: 'indigo' },
  { id: 'Histórico & Documentos', label: 'Histórico & Documentos', icon: Calendar, color: 'gray' },
  { id: 'Dados', label: 'Dados', icon: FileText, color: 'slate' }
];

export default function DashMobileDrawer({ 
  isOpen, 
  onClose, 
  activeTab, 
  onTabChange 
}: DashMobileDrawerProps) {
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col p-4">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center gap-4 w-full px-4 py-4 rounded-xl font-medium text-base transition-all duration-200 ${
                      isActive 
                        ? `bg-${item.color}-50 text-${item.color}-700 border border-${item.color}-200` 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${
                      isActive ? `text-${item.color}-600` : 'text-gray-500'
                    }`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isActive && (
                      <div className={`w-2 h-2 rounded-full bg-${item.color}-500`} />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
              <div className="text-sm text-gray-500 text-center">
                PIM Dashboard
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 