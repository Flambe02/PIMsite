import React from "react";

export default function MobileLogin() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4" data-testid="mobile-login">
      <h1 className="text-xl font-bold mb-6">Connexion</h1>
      <form className="w-full max-w-xs space-y-4">
        <input className="w-full h-12 px-4 border rounded text-base" placeholder="Email" autoComplete="email" type="email" required />
        <input className="w-full h-12 px-4 border rounded text-base" type="password" placeholder="Mot de passe" autoComplete="current-password" required />
        <button className="w-full h-12 bg-blue-600 text-white font-bold rounded" type="submit">Se connecter</button>
      </form>
      <div className="mt-6 w-full max-w-xs">
        {/* Remplacer par le vrai bouton Google mobile si besoin */}
        <button className="w-full h-12 bg-red-500 text-white rounded font-bold" data-testid="google-login">Continuer avec Google</button>
      </div>
    </div>
  );
} 