import React from "react";

interface AuthEntryButtonsProps {
  onLogin: () => void;
  onSignup: () => void;
  onSimulate: () => void;
}

export function AuthEntryButtons({ onLogin, onSignup, onSimulate }: AuthEntryButtonsProps) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
      <button
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-full shadow transition text-lg"
        onClick={onLogin}
        type="button"
      >
        Entrar
      </button>
      <button
        className="bg-white border border-emerald-600 text-emerald-700 font-bold py-3 rounded-full shadow transition text-lg hover:bg-emerald-50"
        onClick={onSignup}
        type="button"
      >
        Sign up
      </button>
      <button
        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold py-3 rounded-full shadow transition text-lg border border-emerald-200"
        onClick={onSimulate}
        type="button"
      >
        Simular
      </button>
    </div>
  );
}
export default AuthEntryButtons; 