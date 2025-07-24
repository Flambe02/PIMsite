"use client";
import { Lock, Shield, Trash2, Star } from "lucide-react";
import { useState, useEffect, useId } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AccountSectionAccount({ user }: { user?: any }) {
  const supabase = createClient();
  const [email, setEmail] = useState(user?.email || "");
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const assinatura = user?.plan || "Basic";
  const [deleting, setDeleting] = useState(false);
  const emailId = useId();
  const passwordId = useId();

  useEffect(() => {
    setMounted(true);
    let cancelled = false;
    async function fetchEmail(forceReload = false) {
      setLoading(true);
      let authUser = null;
      if (forceReload) {
        await supabase.auth.refreshSession();
      }
      const { data: { user } } = await supabase.auth.getUser();
      authUser = user;
      if (!cancelled) {
        if (authUser?.email) setEmail(authUser.email);
        else setEmail("");
        setLoading(false);
      }
      if (authUser) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
        if (data) setProfile(data);
      }
    }
    fetchEmail();
    const timeout = setTimeout(() => {
      if (!email && !loading) fetchEmail(true);
    }, 1000);
    return () => { cancelled = true; clearTimeout(timeout); };
  }, [supabase]);

  const handleDeleteAccount = async () => {
    if (!window.confirm("Tem certeza de que deseja excluir sua conta? Esta ação é irreversível.")) return;
    setDeleting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Sessão não encontrada.");
      setDeleting(false);
      return;
    }
    // Appel à l'API de suppression via Edge Function
    const res = await fetch('/api/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user.id }),
    });
    if (res.ok) {
      await supabase.auth.signOut();
      window.location.href = '/';
    } else {
      alert("Erreur lors de la suppression du compte.");
    }
    setDeleting(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 mb-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-emerald-900"><Lock className="w-7 h-7 text-emerald-600" /> Conta</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-base">
        <div>
          <label htmlFor={emailId} className="font-semibold block mb-1">Email de login</label>
          <input id={emailId} type="email" className="input" value={loading ? 'Chargement...' : (email || 'Non connecté')} disabled />
        </div>
        <div>
          <label htmlFor={passwordId} className="font-semibold block mb-1">Senha</label>
          <div className="flex gap-2 items-center">
            <input id={passwordId} type="password" className="input" value="********" disabled />
            <button className="text-emerald-700 underline text-sm" type="button">Alterar</button>
          </div>
        </div>
      </div>
      {/* Champs Nom et Entreprise retirés */}
      <div>
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-emerald-900"><Star className="w-5 h-5 text-yellow-500" /> Assinatura
          <span className="ml-2 px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">{assinatura}</span>
        </h3>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-emerald-900">
          <Shield className="w-5 h-5 text-blue-500" /> Permissões
          <span className={`ml-2 px-2 py-1 rounded font-bold ${profile?.is_admin ? 'bg-emerald-600 text-white' : 'bg-blue-100 text-blue-700'}`}>
            {profile?.is_admin ? 'Administrador' : 'Usuário padrão'}
          </span>
        </h3>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-emerald-900"><Trash2 className="w-5 h-5 text-red-500" /> Excluir conta</h3>
        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow text-base transition-all duration-200 focus:ring-2 focus:ring-red-400" onClick={() => setShowDelete(true)}>Excluir minha conta</button>
        {showDelete && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <p className="mb-2 text-red-700 font-semibold">Tem certeza de que deseja excluir sua conta? Esta ação é irreversível.</p>
            <div className="flex gap-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded" onClick={handleDeleteAccount} disabled={deleting}>
                {deleting ? "Excluindo..." : "Sim, excluir"}
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded" onClick={() => setShowDelete(false)}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 