import React from "react";
import { Upload, BarChart3, Gift, Heart, Shield, TrendingUp, UserCircle, Home } from "lucide-react";

export default function MobileTabBar({ current }: { current: string }) {
  const navItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: <Home className="w-5 h-5" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500'
    },
    { 
      id: 'upload', 
      label: 'Upload', 
      icon: <Upload className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-500'
    },
    { 
      id: 'compensacao', 
      label: 'Compensação', 
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500'
    },
    { 
      id: 'beneficios', 
      label: 'Benefícios', 
      icon: <Gift className="w-5 h-5" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-500'
    },
    { 
      id: 'dados', 
      label: 'Dados', 
      icon: <UserCircle className="w-5 h-5" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-500'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 flex justify-around items-center z-50 shadow-lg" data-testid="mobile-tabbar">
      {navItems.map((item) => (
        <button 
          key={item.id}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${
            current === item.id 
              ? 'text-emerald-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          aria-label={item.label} 
          data-testid={`tab-${item.id}`}
        >
          <div className={`mb-1 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            current === item.id 
              ? 'bg-emerald-500 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {item.icon}
          </div>
          <span className="text-xs font-medium">{item.label}</span>
          {current === item.id && (
            <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1"></div>
          )}
        </button>
      ))}
    </nav>
  );
} 