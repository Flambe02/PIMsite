"use client"

import React, { useState, useEffect } from "react";
import { 
  Home,
  TrendingUp,
  Gift,
  Shield,
  Calculator,
  Lightbulb,
  Settings,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashLayoutProps {
  children: React.ReactNode;
  user: any;
  activeSidebarItem: string;
  onSidebarItemChange: (itemId: string) => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

const sidebarItems: SidebarItem[] = [
  { id: 'overview', label: 'Visão Geral', icon: Home },
  { id: 'compensation', label: 'Compensação', icon: TrendingUp },
  { id: 'benefits', label: 'Benefícios', icon: Gift },
  { id: 'insurance', label: 'Seguros', icon: Shield },
  { id: 'social-rights', label: 'Direitos Sociais', icon: Calculator },
  { id: 'recommendations', label: 'Recomendações', icon: Lightbulb },
  { id: 'settings', label: 'Configurações', icon: Settings }
];

export default function DashLayout({
  children,
  user,
  activeSidebarItem,
  onSidebarItemChange,
  sidebarOpen,
  onSidebarToggle
}: DashLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button
              onClick={onSidebarToggle}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Logo/Title */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dash</h1>
            </div>

            {/* User info */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 md:shadow-none`}>
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Navegação</h2>
              <button
                onClick={onSidebarToggle}
                className="md:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSidebarItem === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onSidebarItemChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 