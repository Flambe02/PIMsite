"use client";
import { Lock, Shield, Trash2, Star } from "lucide-react";
import { useState } from "react";

export default function AccountSectionAccount({ user }: { user?: any }) {
  const [email, setEmail] = useState(user?.email || "");
  const [showDelete, setShowDelete] = useState(false);
  // Valeurs fictives pour l'exemple
  const assinatura = user?.plan || "Basic";
  const papel = user?.role || "Usuário padrão";
  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 mb-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-emerald-900"><Lock className="w-7 h-7 text-emerald-600" /> Conta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-base">
          <div>
            <label className="font-semibold block mb-1">Email de login</label>
            <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="font-semibold block mb-1">Senha</label>
            <div className="flex gap-2 items-center">
              <input type="password" className="input" value="********" disabled />
              <button className="text-emerald-700 underline text-sm" type="button">Alterar</button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-emerald-900"><Star className="w-5 h-5 text-yellow-500" /> Assinatura</h3>
        <div className="flex items-center gap-2 text-base">
          <span className="font-semibold">Assinatura :</span>
          <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">{assinatura}</span>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-emerald-900"><Shield className="w-5 h-5 text-blue-500" /> Permissões</h3>
        <div className="flex items-center gap-2 text-base">
          <span className="font-semibold">Papel :</span>
          <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">{papel}</span>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-emerald-900"><Trash2 className="w-5 h-5 text-red-500" /> Excluir conta</h3>
        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow text-base transition-all duration-200 focus:ring-2 focus:ring-red-400" onClick={() => setShowDelete(true)}>Excluir minha conta</button>
        {showDelete && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <p className="mb-2 text-red-700 font-semibold">Tem certeza de que deseja excluir sua conta? Esta ação é irreversível.</p>
            <div className="flex gap-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded" onClick={() => {/* TODO: exclusão */}}>Sim, excluir</button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded" onClick={() => setShowDelete(false)}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 