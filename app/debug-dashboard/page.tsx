"use client"

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function DebugDashboard() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function debugDashboard() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        // 1. Vérifier l'utilisateur connecté
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          setDebugInfo({ error: 'Non connecté' });
          setLoading(false);
          return;
        }

        console.log('👤 Utilisateur connecté:', user.email);
        
        // 2. Récupérer TOUS les holerites de l'utilisateur
        const { data: allHolerites, error: tableError } = await supabase
          .from('holerites')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (tableError) {
          setDebugInfo({ error: `Erreur table: ${tableError.message}` });
          setLoading(false);
          return;
        }
        
        console.log('📊 Tous les holerites trouvés:', allHolerites);
        
        // 3. Vérifier le localStorage
        const localStorageData = typeof window !== 'undefined' ? {
          holeriteResult: localStorage.getItem('holeriteResult'),
          timestamp: localStorage.getItem('holeriteResult_timestamp'),
          timestampAge: localStorage.getItem('holeriteResult_timestamp') ? 
            Math.round((Date.now() - parseInt(localStorage.getItem('holeriteResult_timestamp')!)) / 1000) + 's' : 'N/A'
        } : null;
        
        // 4. Analyser les données
        const analysis = {
          user: {
            id: user.id,
            email: user.email
          },
          holerites: {
            count: allHolerites?.length || 0,
            latest: allHolerites?.[0] || null,
            all: allHolerites || []
          },
          localStorage: localStorageData,
          recommendations: {
            latest: allHolerites?.[0]?.structured_data?.recommendations || null,
            analysis: allHolerites?.[0]?.structured_data?.analysis_result || null
          }
        };
        
        setDebugInfo(analysis);
        console.log('🔍 Analyse complète:', analysis);
        
      } catch (error) {
        console.error('❌ Erreur debug:', error);
        setDebugInfo({ error: `Erreur: ${error}` });
      } finally {
        setLoading(false);
      }
    }
    
    debugDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">🔍 Debug Dashboard</h1>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Analyse en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  if (debugInfo?.error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">🔍 Debug Dashboard</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Erreur:</strong> {debugInfo.error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">🔍 Debug Dashboard</h1>
        
        {debugInfo && (
          <div className="space-y-6">
            {/* Informations utilisateur */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">👤 Utilisateur</h2>
              <div className="space-y-2">
                <p><strong>ID:</strong> {debugInfo.user.id}</p>
                <p><strong>Email:</strong> {debugInfo.user.email}</p>
              </div>
            </div>

            {/* Holerites */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">📊 Holerites ({debugInfo.holerites.count})</h2>
              
              {debugInfo.holerites.latest && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">🆕 Dernier Holerite</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>ID:</strong> {debugInfo.holerites.latest.id}</p>
                    <p><strong>Nom:</strong> {debugInfo.holerites.latest.nome}</p>
                    <p><strong>Empresa:</strong> {debugInfo.holerites.latest.empresa}</p>
                    <p><strong>Salário Bruto:</strong> R$ {debugInfo.holerites.latest.salario_bruto}</p>
                    <p><strong>Salário Líquido:</strong> R$ {debugInfo.holerites.latest.salario_liquido}</p>
                    <p><strong>Créé le:</strong> {new Date(debugInfo.holerites.latest.created_at).toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium">Tous les holerites:</h4>
                {debugInfo.holerites.all.map((holerite: any, index: number) => (
                  <div key={holerite.id} className="p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                    <p className="font-medium">{index + 1}. {holerite.nome} - {holerite.empresa}</p>
                    <p className="text-sm text-gray-600">
                      Bruto: R$ {holerite.salario_bruto} | Líquido: R$ {holerite.salario_liquido} | 
                      Créé: {new Date(holerite.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* localStorage */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">💾 localStorage</h2>
              <div className="space-y-2">
                <p><strong>holeriteResult:</strong> {debugInfo.localStorage?.holeriteResult ? 'Présent' : 'Absent'}</p>
                <p><strong>Timestamp:</strong> {debugInfo.localStorage?.timestamp || 'N/A'}</p>
                <p><strong>Âge:</strong> {debugInfo.localStorage?.timestampAge}</p>
                {debugInfo.localStorage?.holeriteResult && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-600">Voir le contenu</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(JSON.parse(debugInfo.localStorage.holeriteResult), null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>

            {/* Recommandations */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">💡 Recommandations</h2>
              <div className="space-y-2">
                <p><strong>Dernières recommandations:</strong> {debugInfo.recommendations.latest ? 'Présentes' : 'Absentes'}</p>
                <p><strong>Analyse:</strong> {debugInfo.recommendations.analysis ? 'Présente' : 'Absente'}</p>
                {debugInfo.recommendations.latest && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-600">Voir les recommandations</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(debugInfo.recommendations.latest, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
