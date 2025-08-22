"use client"

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestDashboardExtraction() {
  const [extractionResult, setExtractionResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testExtraction() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        // 1. Vérifier l'utilisateur connecté
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          setError('Non connecté');
          setLoading(false);
          return;
        }

        console.log('👤 Utilisateur connecté:', user.email);
        
        // 2. Récupérer le dernier holerite (comme le dashboard)
        const { data: holerites, error: tableError } = await supabase
          .from('holerites')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (tableError) {
          setError(`Erreur table: ${tableError.message}`);
          setLoading(false);
          return;
        }
        
        if (!holerites || holerites.length === 0) {
          setError('Aucun holerite trouvé');
          setLoading(false);
          return;
        }
        
        const holeriteData = holerites[0];
        console.log('📊 Données récupérées de Supabase:', holeriteData);
        
        // 3. SIMULER L'EXTRACTION DU DASHBOARD (copie exacte de la logique)
        const extractValue = (obj: any, path: string, defaultValue: any = 0) => {
          if (!obj) return defaultValue;
          
          const keys = path.split('.');
          let value = obj;
          
          for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
              value = value[key];
            } else {
              return defaultValue;
            }
          }
          
          if (value === null || value === undefined || value === '') {
            return defaultValue;
          }
          
          if (typeof value === 'object' && value !== null && 'valor' in value) {
            value = value.valor;
          }
          
          if (typeof value === 'object' && value !== null && 'value' in value) {
            value = value.value;
          }
          
          if (typeof value === 'string') {
            const cleanedValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
            const numValue = Number(cleanedValue);
            return isNaN(numValue) ? defaultValue : numValue;
          }
          
          const numValue = Number(value);
          return isNaN(numValue) ? defaultValue : numValue;
        };

        // CORRECTION CRITIQUE: Les vraies données sont dans gross_salary.valor et net_salary.valor
        let salarioBruto = extractValue(holeriteData, 'salario_bruto') || 0;
        let salarioLiquido = extractValue(holeriteData, 'salario_liquido') || 0;

        if (!salarioBruto && holeriteData.structured_data) {
          salarioBruto = extractValue(holeriteData.structured_data, 'final_data.gross_salary.valor') ||
                         extractValue(holeriteData.structured_data, 'final_data.gross_salary') ||
                         extractValue(holeriteData.structured_data, 'final_data.salario_bruto') ||
                         extractValue(holeriteData.structured_data, 'gross_salary.valor') ||
                         extractValue(holeriteData.structured_data, 'gross_salary') ||
                         extractValue(holeriteData.structured_data, 'salario_bruto') ||
                         extractValue(holeriteData.structured_data, 'salario_bruto_total') ||
                         extractValue(holeriteData.structured_data, 'total_gross_salary') ||
                         0;
        }

        if (!salarioLiquido && holeriteData.structured_data) {
          salarioLiquido = extractValue(holeriteData.structured_data, 'final_data.net_salary.valor') ||
                           extractValue(holeriteData.structured_data, 'final_data.net_salary') ||
                           extractValue(holeriteData.structured_data, 'final_data.salario_liquido') ||
                           extractValue(holeriteData.structured_data, 'net_salary.valor') ||
                           extractValue(holeriteData.structured_data, 'net_salary') ||
                           extractValue(holeriteData.structured_data, 'salario_liquido') ||
                           extractValue(holeriteData.structured_data, 'salario_liquido_total') ||
                           extractValue(holeriteData.structured_data, 'total_net_salary') ||
                           0;
        }

        const descontos = extractValue(holeriteData.structured_data, 'final_data.descontos') ||
                         extractValue(holeriteData.structured_data, 'total_deductions') ||
                         extractValue(holeriteData.structured_data, 'descontos') ||
                         (salarioBruto > 0 && salarioLiquido > 0 ? salarioBruto - salarioLiquido : 0);
        
        const eficiencia = salarioBruto > 0 && salarioLiquido > 0 ? 
          Number(((salarioLiquido / salarioBruto) * 100).toFixed(1)) : 0;

        // Extraire recommendations
        const aiRecommendations = holeriteData.structured_data?.recommendations?.recommendations ||
                                holeriteData.structured_data?.analysis_result?.recommendations?.recommendations ||
                                holeriteData.structured_data?.aiRecommendations ||
                                [];
        
        const resumeSituation = holeriteData.structured_data?.recommendations?.resume_situation ||
                              holeriteData.structured_data?.analysis_result?.recommendations?.resume_situation ||
                              holeriteData.structured_data?.resumeSituation ||
                              '';
        
        const scoreOptimisation = holeriteData.structured_data?.recommendations?.score_optimisation ||
                                holeriteData.structured_data?.analysis_result?.recommendations?.score_optimisation ||
                                holeriteData.structured_data?.scoreOptimisation ||
                                0;

        // 4. RÉSULTATS DE L'EXTRACTION
        const result = {
          salarioBruto,
          salarioLiquido,
          descontos,
          eficiencia,
          recommendations: {
            count: aiRecommendations.length,
            first: aiRecommendations[0]?.title || 'Aucune',
            resumeSituation,
            scoreOptimisation
          },
          rawData: {
            nome: holeriteData.nome,
            empresa: holeriteData.empresa,
            perfil: holeriteData.perfil,
            period: holeriteData.period,
            structured_data_keys: holeriteData.structured_data ? Object.keys(holeriteData.structured_data) : []
          }
        };
        
        setExtractionResult(result);
        console.log('✅ Résultat extraction:', result);
        
      } catch (error) {
        console.error('❌ Erreur test:', error);
        setError(`Erreur: ${error}`);
      } finally {
        setLoading(false);
      }
    }
    
    testExtraction();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">🧪 Test Extraction Dashboard</h1>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Test en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">🧪 Test Extraction Dashboard</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Erreur:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">🧪 Test Extraction Dashboard</h1>
        
        {extractionResult && (
          <div className="space-y-6">
            {/* Résultats principaux */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">📊 Résultats Extraction</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Salário Bruto</p>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {extractionResult.salarioBruto.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Salário Líquido</p>
                  <p className="text-2xl font-bold text-blue-600">
                    R$ {extractionResult.salarioLiquido.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Descontos</p>
                  <p className="text-lg font-semibold text-red-600">
                    R$ {extractionResult.descontos.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Eficiência</p>
                  <p className="text-lg font-semibold text-purple-600">
                    {extractionResult.eficiencia}%
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">💡 Recommendations</h2>
              <div className="space-y-2">
                <p><strong>Nombre:</strong> {extractionResult.recommendations.count}</p>
                <p><strong>Première:</strong> {extractionResult.recommendations.first}</p>
                <p><strong>Score:</strong> {extractionResult.recommendations.scoreOptimisation}</p>
                <p><strong>Résumé:</strong> {extractionResult.recommendations.resumeSituation || 'Non disponible'}</p>
              </div>
            </div>

            {/* Données brutes */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">🔍 Données Brutes</h2>
              <div className="space-y-2">
                <p><strong>Nom:</strong> {extractionResult.rawData.nome}</p>
                <p><strong>Entreprise:</strong> {extractionResult.rawData.empresa}</p>
                <p><strong>Profil:</strong> {extractionResult.rawData.perfil}</p>
                <p><strong>Période:</strong> {extractionResult.rawData.period}</p>
                <p><strong>Clés structured_data:</strong> {extractionResult.rawData.structured_data_keys.join(', ')}</p>
              </div>
            </div>

            {/* Test de cohérence */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">✅ Test Cohérence</h2>
              <div className="space-y-2">
                <p className={extractionResult.salarioBruto === 15345 ? 'text-green-600' : 'text-red-600'}>
                  <strong>Salário Bruto:</strong> {extractionResult.salarioBruto === 15345 ? '✅ Cohérent' : '❌ INCOHÉRENT'} 
                  (Attendu: 15345, Trouvé: {extractionResult.salarioBruto})
                </p>
                <p className={extractionResult.salarioLiquido === 10767.28 ? 'text-green-600' : 'text-red-600'}>
                  <strong>Salário Líquido:</strong> {extractionResult.salarioLiquido === 10767.28 ? '✅ Cohérent' : '❌ INCOHÉRENT'} 
                  (Attendu: 10767.28, Trouvé: {extractionResult.salarioLiquido})
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
