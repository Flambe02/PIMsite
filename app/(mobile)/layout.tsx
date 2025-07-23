import React from "react";
import MobileTabBar from "@/components/mobile/MobileTabBar";

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  // TODO: Déterminer dynamiquement l'onglet actif selon la route
  const currentTab = "home";
  return (
    <div className="min-h-screen bg-white flex flex-col" data-testid="mobile-layout">
      <header className="h-14 flex items-center justify-center border-b px-4 fixed top-0 left-0 w-full z-20 bg-white">
        <span className="font-bold text-lg">PIM</span>
      </header>
      <main className="flex-1 w-full max-w-screen-sm mx-auto pt-14 pb-16">{children}</main>
      <MobileTabBar current={currentTab} />
    </div>
  );
} 