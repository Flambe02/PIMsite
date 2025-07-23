import React from "react";

export default function MobileHome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4" data-testid="mobile-home">
      <h1 className="text-2xl font-bold mb-4">Bienvenue sur PIM (Mobile)</h1>
      <p className="text-base text-center mb-8">Ceci est la version mobile de la page d’accueil. Ajoutez ici votre hero, CTA, et navigation mobile.</p>
    </div>
  );
} 