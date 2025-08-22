"use client"

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function RefreshDashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const router = useRouter();

  const forceClearCache = () => {
    if (typeof window !== 'undefined') {
      // Supprimer toutes les données en cache
      localStorage.removeItem('holeriteResult');
      localStorage.removeItem('holeriteResult_timestamp');
      sessionStorage.clear();
      
      setResult('✅ Cache supprimé avec succès !');
      
      // Rediriger vers le dashboard après 2 secondes
      setTimeout(() => {
        router.push('/br/dashboard');
      }, 2000);
    }
  };

  const forceSync = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      
      // 1. Vérifier l'utilisateur connecté
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setResult('❌ Utilisateur non connecté');
        setLoading(false);
        return;
      }

      // 2. Récupérer le dernier holerite
      const { data: holerites, error: tableError } = await supabase
        .from('holerites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (tableError) {
        setResult(`❌ Erreur: ${tableError.message}`);
        setLoading(false);
        return;
      }
      
      if (!holerites || holerites.length === 0) {
        setResult('❌ Aucun holerite trouvé');
        setLoading(false);
        return;
      }
      
      const latest = holerites[0];
      setResult(`✅ Dernier holerite trouvé: ${latest.nome} (${latest.salario_liquido ? `R$ ${latest.salario_liquido}` : 'R$ 0'})`);
      
      // 3. Forcer la mise à jour du cache
      forceClearCache();
      
    } catch (error) {
      setResult(`❌ Erreur: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔄 Atualizar Dashboard</h1>
        
        <div className="bg-white p-8 rounded-lg shadow space-y-6">
          <p className="text-gray-600 text-center">
            Se o dashboard não mostra os dados mais recentes, use este botão para forçar a atualização.
          </p>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={forceSync}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Verificando...
                </div>
              ) : (
                '🔄 Forçar Sincronização'
              )}
            </button>
            
            <button
              onClick={forceClearCache}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200"
            >
              🗑️ Limpar Cache + Ir ao Dashboard
            </button>
          </div>
          
          {result && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-center font-medium">{result}</p>
            </div>
          )}
          
          <div className="text-center">
            <button
              onClick={() => router.push('/br/dashboard')}
              className="text-blue-500 hover:text-blue-600 underline"
            >
              ← Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
