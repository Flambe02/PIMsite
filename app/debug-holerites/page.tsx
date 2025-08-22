"use client"

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function DebugHolerites() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDebugInfo() {
      try {
        const supabase = createClient();
        
        // 1. Vérifier l'utilisateur
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          setDebugInfo({ error: 'Non connecté' });
          setLoading(false);
          return;
        }

        // 2. Récupérer le dernier holerite
        const { data: holerites, error: tableError } = await supabase
          .from('holerites')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (tableError) {
          setDebugInfo({ error: `Erreur table: ${tableError.message}` });
          setLoading(false);
          return;
        }

        if (!holerites) {
          setDebugInfo({ error: 'Aucun holerite trouvé' });
          setLoading(false);
          return;
        }

        // 3. Simuler l'extraction du dashboard
        const data = holerites;
        
        // Fonction d'extraction (copiée du dashboard)
        const extractValue = (obj: any, path: string, defaultValue: number = 0): number => {
          if (!obj || !path) return defaultValue;
          
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

        // Test d'extraction
        let salarioBruto = extractValue(data, 'salario_bruto') || 0;
        let salarioLiquido = extractValue(data, 'salario_liquido') || 0;

        if (!salarioBruto && data.structured_data) {
          salarioBruto = extractValue(data.structured_data, 'final_data.gross_salary.valor') ||
                         extractValue(data.structured_data, 'final_data.gross_salary') ||
                         extractValue(data.structured_data, 'final_data.salario_bruto') ||
                         extractValue(data.structured_data, 'gross_salary.valor') ||
                         extractValue(data.structured_data, 'gross_salary') ||
                         extractValue(data.structured_data, 'salario_bruto') ||
                         0;
        }

        if (!salarioLiquido && data.structured_data) {
          salarioLiquido = extractValue(data.structured_data, 'final_data.net_salary.valor') ||
                           extractValue(data.structured_data, 'final_data.net_salary') ||
                           extractValue(data.structured_data, 'final_data.salario_liquido') ||
                           extractValue(data.structured_data, 'net_salary.valor') ||
                           extractValue(data.structured_data, 'net_salary') ||
                           extractValue(data.structured_data, 'net_salary') ||
                           0;
        }

        // Recommandations
        const aiRecommendations = data.structured_data?.recommendations?.recommendations ||
                                data.structured_data?.analysis_result?.recommendations?.recommendations ||
                                [];

        setDebugInfo({
          user: user.email,
          holerite: {
            id: data.id,
            created: data.created_at,
            nome: data.nome,
            empresa: data.empresa,
            salario_bruto: data.salario_bruto,
            salario_liquido: data.salario_liquido,
            period: data.period
          },
          extraction: {
            salarioBruto,
            salarioLiquido,
            recommendations: aiRecommendations?.length || 0
          },
          structured_data_keys: data.structured_data ? Object.keys(data.structured_data) : [],
          final_data_keys: data.structured_data?.final_data ? Object.keys(data.structured_data.final_data) : []
        });

      } catch (error) {
        setDebugInfo({ error: `Erreur: ${error}` });
      } finally {
        setLoading(false);
      }
    }

    fetchDebugInfo();
  }, []);

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  if (debugInfo?.error) {
    return <div className="p-8 text-red-600">Erreur: {debugInfo.error}</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔍 Debug Holerites</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">👤 Utilisateur</h2>
          <p><strong>Email:</strong> {debugInfo.user}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">📊 Holerite en Base</h2>
          <p><strong>ID:</strong> {debugInfo.holerite.id}</p>
          <p><strong>Créé:</strong> {debugInfo.holerite.created}</p>
          <p><strong>Nome:</strong> {debugInfo.holerite.nome}</p>
          <p><strong>Empresa:</strong> {debugInfo.holerite.empresa}</p>
          <p><strong>Salário Bruto:</strong> R$ {debugInfo.holerite.salario_bruto}</p>
          <p><strong>Salário Líquido:</strong> R$ {debugInfo.holerite.salario_liquido}</p>
          <p><strong>Période:</strong> {debugInfo.holerite.period}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">🧪 Extraction Dashboard</h2>
          <p><strong>Salário Bruto extrait:</strong> R$ {debugInfo.extraction.salarioBruto}</p>
          <p><strong>Salário Líquido extrait:</strong> R$ {debugInfo.extraction.salarioLiquido}</p>
          <p><strong>Recommandations:</strong> {debugInfo.extraction.recommendations}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">🔍 Structure des Données</h2>
          <p><strong>structured_data keys:</strong></p>
          <ul className="list-disc list-inside text-sm">
            {debugInfo.structured_data_keys.map((key: string) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
          
          <p className="mt-4"><strong>final_data keys:</strong></p>
          <ul className="list-disc list-inside text-sm">
            {debugInfo.final_data_keys.map((key: string) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <a 
          href="/br/dashboard" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ← Retour au Dashboard
        </a>
      </div>
    </div>
  );
}
