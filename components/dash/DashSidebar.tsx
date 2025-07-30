"use client"

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  FileText, 
  CheckCircle, 
  User, 
  MoreHorizontal,
  Leaf,
  Upload
} from "lucide-react";

interface DashSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  locale: string;
  onUploadHolerite: () => void;
}

export default function DashSidebar({ 
  activeTab, 
  onTabChange,
  locale,
  onUploadHolerite
}: DashSidebarProps) {
  const navItems = [
    {
      id: 'home',
      icon: Home,
      label: locale === 'fr' ? 'Accueil' : 'Home',
      color: 'text-blue-600'
    },
    {
      id: 'payslip',
      icon: FileText,
      label: locale === 'fr' ? 'Bulletin' : 'Payslip',
      color: 'text-green-600'
    },
    {
      id: 'benefits',
      icon: CheckCircle,
      label: locale === 'fr' ? 'Avantages' : 'Benefits',
      color: 'text-purple-600'
    },
    {
      id: 'wellbeing',
      icon: User,
      label: locale === 'fr' ? 'Bien-être' : 'Well-being',
      color: 'text-orange-600'
    },
    {
      id: 'more',
      icon: MoreHorizontal,
      label: locale === 'fr' ? 'Plus' : 'More',
      color: 'text-gray-600'
    }
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen"
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">
            {locale === 'fr' ? 'Accueil' : 'Home'}
          </span>
        </div>
      </div>

      {/* Upload Holerite Button */}
      <div className="p-4 border-b border-gray-200">
        <Button
          onClick={onUploadHolerite}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {locale === 'fr' ? 'Upload Holerite' : 'Upload Holerite'}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start h-12 px-4 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : item.color}`} />
                  <span className="font-medium">{item.label}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-blue-900">
              {locale === 'fr' ? 'PIM Pro' : 'PIM Pro'}
            </span>
          </div>
          <p className="text-xs text-blue-700">
            {locale === 'fr' ? 'Version premium' : 'Versão premium'}
          </p>
        </div>
      </div>
    </motion.aside>
  );
} 