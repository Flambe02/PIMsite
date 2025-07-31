"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSupabase } from '@/components/supabase-provider';

export default function TestHoleritesPage() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSupabase();
  const supabase = createClient();
  const user = session?.user;

  const addResult = (message: string, data?: any) => {
    setResults(prev => [...prev, { 
      timestamp: new Date().toISOString(), 
      message, 
      data 
    }]);
  };

  const runTests = async () => {
    setIsLoading(true);
    setResults([]);
    
    addResult('🔍 DÉBUT DES TESTS HOLERITES');
    
    try {
      // Test 1: Vérifier la connexion utilisateur
      addResult('👤 Test utilisateur connecté', { 
        userId: user?.id, 
        email: user?.email,
        isAuthenticated: !!user 
      });

      if (!user?.id) {
        addResult('❌ Utilisateur non connecté - arrêt des tests');
        return;
      }

      // Test 2: Vérifier la structure de la table
      addResult('📋 Test structure de la table holerites');
      
      const { data: structure, error: structureError } = await supabase
        .from('holerites')
        .select('*')
        .limit(1);

      if (structureError) {
        addResult('❌ Erreur structure table', structureError);
        return;
      }

      addResult('✅ Structure table OK', {
        columns: structure && structure.length > 0 ? Object.keys(structure[0]) : 'Aucune donnée'
      });

      // Test 3: Compter tous les holerites
      const { count, error: countError } = await supabase
        .from('holerites')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        addResult('❌ Erreur comptage', countError);
      } else {
        addResult('📊 Comptage total', { totalHolerites: count });
      }

      // Test 4: Lister tous les holerites avec user_id
      const { data: allHolerites, error: listError } = await supabase
        .from('holerites')
        .select('id, created_at, user_id, period, nome, empresa, salario_bruto')
        .order('created_at', { ascending: false })
        .limit(10);

      if (listError) {
        addResult('❌ Erreur liste complète', listError);
      } else {
        addResult('📄 Liste complète', { 
          count: allHolerites?.length || 0,
          holerites: allHolerites 
        });
      }

      // Test 5: Tester la requête spécifique à l'utilisateur
      addResult('🧪 Test requête utilisateur spécifique');
      
      const { data: userHolerites, error: userError, count: userCount } = await supabase
        .from('holerites')
        .select('id, created_at, salario_bruto, salario_liquido, nome, empresa, structured_data, period, user_id', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (userError) {
        addResult('❌ Erreur requête utilisateur', userError);
      } else {
        addResult('✅ Requête utilisateur OK', {
          count: userCount,
          holerites: userHolerites?.length || 0,
          data: userHolerites
        });
      }

      // Test 6: Vérifier les politiques RLS
      addResult('🔒 Test politiques RLS');
      
      // Essayer d'accéder sans authentification (devrait échouer)
      const { data: noAuthData, error: noAuthError } = await supabase
        .from('holerites')
        .select('id')
        .limit(1);

      addResult('🔒 Test accès sans auth', {
        hasData: !!noAuthData,
        error: noAuthError?.message || 'Aucune erreur'
      });

    } catch (error) {
      addResult('❌ Erreur générale', error);
    }

    addResult('✅ TESTS TERMINÉS');
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Test Holerites - Diagnostic</h1>
        
        <div className="mb-6">
          <button
            onClick={runTests}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
          >
            {isLoading ? 'Tests en cours...' : 'Lancer les tests'}
          </button>
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="font-semibold text-gray-800 mb-2">
                {result.message}
              </div>
              <div className="text-sm text-gray-600">
                {result.timestamp}
              </div>
              {result.data && (
                <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>

        {results.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 py-8">
            Cliquez sur "Lancer les tests" pour commencer le diagnostic
          </div>
        )}
      </div>
    </div>
  );
} 