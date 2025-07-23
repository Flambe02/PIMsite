import React from "react";

export default function MobileTabBar({ current }: { current: string }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full h-14 bg-white border-t flex justify-around items-center z-50" data-testid="mobile-tabbar">
      <button className={`flex flex-col items-center flex-1 ${current === 'home' ? 'text-blue-600' : 'text-gray-500'}`}
        aria-label="Accueil" data-testid="tab-home">
        <span className="text-xl">🏠</span>
        <span className="text-xs">Accueil</span>
      </button>
      <button className={`flex flex-col items-center flex-1 ${current === 'upload' ? 'text-blue-600' : 'text-gray-500'}`}
        aria-label="Upload" data-testid="tab-upload">
        <span className="text-xl">⬆️</span>
        <span className="text-xs">Upload</span>
      </button>
      <button className={`flex flex-col items-center flex-1 ${current === 'dashboard' ? 'text-blue-600' : 'text-gray-500'}`}
        aria-label="Dashboard" data-testid="tab-dashboard">
        <span className="text-xl">📊</span>
        <span className="text-xs">Dashboard</span>
      </button>
    </nav>
  );
} 