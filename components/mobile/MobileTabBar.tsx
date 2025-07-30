import React from "react";
import { Upload, BarChart3, Gift, Heart, Shield, TrendingUp, UserCircle, Home, DollarSign, MoreHorizontal } from "lucide-react";

export default function MobileTabBar({ current }: { current: string }) {
  const navItems = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: <Home className="w-5 h-5 text-emerald-600" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500',
      activeBgColor: 'bg-emerald-100'
    },
    { 
      id: 'salario', 
      label: 'Salário', 
      icon: <DollarSign className="w-5 h-5 text-green-600" />,
      color: 'text-green-600',
      bgColor: 'bg-green-500',
      activeBgColor: 'bg-green-100'
    },
    { 
      id: 'beneficios', 
      label: 'Benefícios', 
      icon: <Gift className="w-5 h-5 text-purple-600" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500',
      activeBgColor: 'bg-purple-100'
    },
    { 
      id: 'wellbeing', 
      label: 'Well-being', 
      icon: <Heart className="w-5 h-5 text-pink-600" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-500',
      activeBgColor: 'bg-pink-100'
    },
    { 
      id: 'more', 
      label: 'More', 
      icon: <MoreHorizontal className="w-5 h-5 text-gray-600" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-500',
      activeBgColor: 'bg-gray-100'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 flex justify-around items-center z-50 shadow-lg" data-testid="mobile-tabbar">
      {navItems.map((item) => (
        <button 
          key={item.id}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${
            current === item.id 
              ? item.color
              : 'text-gray-500 hover:text-gray-700'
          }`}
          aria-label={item.label} 
          data-testid={`tab-${item.id}`}
        >
          <div className={`mb-1 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            current === item.id 
              ? `${item.bgColor} text-white shadow-lg` 
              : `${item.activeBgColor} ${item.color}`
          }`}>
            {item.icon}
          </div>
          <span className="text-xs font-medium tracking-wide">{item.label}</span>
          {current === item.id && (
            <div className={`w-1 h-1 ${item.bgColor} rounded-full mt-1`}></div>
          )}
        </button>
      ))}
    </nav>
  );
} 