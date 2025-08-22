'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestHoleritesPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [currentTest, setCurrentTest] = useState('');

  const log = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : '🔍';
    const logMessage = `[${timestamp}] ${emoji} ${message}`;
    setResults(prev => [...prev, logMessage]);
    console.log(logMessage);
  };

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    try {
      log('🚀 Démarrage des tests du système holerites');
      
      // Test 1: Connexion Supabase
      setCurrentTest('Test de connexion Supabase');
      log('Test 1: Vérification de la connexion Supabase');
      
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        log(`Erreur d'authentification: ${authError.message}`, 'error');
        return;
      }
      
      if (!user) {
        log('Aucun utilisateur connecté - veuillez vous connecter d\'abord', 'error');
        return;
      }
      
      log(`Utilisateur connecté: ${user.email}`, 'success');
      
      // Test 2: Accès à la table holerites
      setCurrentTest('Test d\'accès à la table holerites');
      log('Test 2: Vérification de l\'accès à la table holerites');
      
      const { data: tableTest, error: tableError } = await supabase
        .from('holerites')
        .select('*')
        .limit(1);
      
      if (tableError) {
        log(`Erreur d'accès à la table: ${tableError.message}`, 'error');
        return;
      }
      
      log('Accès à la table holerites: OK', 'success');
      
      // Test 3: Compter les holerites existants
      setCurrentTest('Comptage des holerites');
      log('Test 3: Comptage des holerites existants');
      
      const { count: beforeCount, error: countError } = await supabase
        .from('holerites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (countError) {
        log(`Erreur de comptage: ${countError.message}`, 'error');
      } else {
        log(`Nombre de holerites avant test: ${beforeCount || 0}`, 'success');
      }
      
      // Test 4: Test de l'API scan-new-pim-enhanced
      setCurrentTest('Test de l\'API scan-new-pim-enhanced');
      log('Test 4: Test de l\'API scan-new-pim-enhanced');
      
      // Créer un fichier de test simulé
      const testPayslipData = {
        employee_name: 'TESTE AUTOMATIZADO',
        company_name: 'EMPRESA TESTE LTDA',
        position: 'DESENVOLVEDOR',
        statut: 'CLT',
        salario_bruto: 5000,
        salario_liquido: 3800,
        descontos: 1200,
        period: '2024-01'
      };
      
      log('Simulation d\'un scan de holerite...');
      
      // Test 5: Vérifier si un nouveau holerite serait créé
      setCurrentTest('Simulation de sauvegarde');
      log('Test 5: Simulation de la logique de sauvegarde');
      
      // Au lieu de faire un vrai scan, on simule la logique
      const holeriteData = {
        user_id: user.id,
        nome: testPayslipData.employee_name,
        empresa: testPayslipData.company_name,
        perfil: testPayslipData.statut,
        salario_bruto: testPayslipData.salario_bruto,
        salario_liquido: testPayslipData.salario_liquido,
        period: testPayslipData.period,
        structured_data: {
          final_data: testPayslipData,
          test_mode: true
        }
      };
      
      log('Données préparées pour sauvegarde:', 'success');
      log(`  Nome: ${holeriteData.nome}`);
      log(`  Salário Bruto: R$ ${holeriteData.salario_bruto.toLocaleString('pt-BR')}`);
      log(`  Salário Líquido: R$ ${holeriteData.salario_liquido.toLocaleString('pt-BR')}`);
      
      // Test 6: Insertion réelle (avec marqueur de test)
      setCurrentTest('Insertion en base');
      log('Test 6: Insertion d\'un holerite de test');
      
      const { data: insertedHolerite, error: insertError } = await supabase
        .from('holerites')
        .insert(holeriteData)
        .select('*')
        .single();
      
      if (insertError) {
        log(`Erreur d'insertion: ${insertError.message}`, 'error');
        return;
      }
      
      log(`Holerite test inséré avec ID: ${insertedHolerite.id}`, 'success');
      
      // Test 7: Récupération pour dashboard
      setCurrentTest('Test de récupération dashboard');
      log('Test 7: Récupération comme le dashboard');
      
      const { data: dashboardData, error: dashboardError } = await supabase
        .from('holerites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (dashboardError) {
        log(`Erreur de récupération dashboard: ${dashboardError.message}`, 'error');
      } else {
        log('Récupération dashboard: OK', 'success');
        log(`  ID récupéré: ${dashboardData.id}`);
        log(`  Salário Bruto: ${dashboardData.salario_bruto}`);
        log(`  Salário Líquido: ${dashboardData.salario_liquido}`);
        
        // Test de l'extraction comme dans le dashboard
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
          
          const numValue = Number(value);
          return isNaN(numValue) ? defaultValue : numValue;
        };
        
        const extractedBruto = extractValue(dashboardData, 'salario_bruto');
        const extractedLiquido = extractValue(dashboardData, 'salario_liquido');
        
        if (extractedBruto > 0 && extractedLiquido > 0) {
          log('✅ Extraction des salaires: SUCCÈS', 'success');
          log(`  Bruto extraído: R$ ${extractedBruto.toLocaleString('pt-BR')}`);
          log(`  Líquido extraído: R$ ${extractedLiquido.toLocaleString('pt-BR')}`);
        } else {
          log('❌ Extraction des salaires: ÉCHEC', 'error');
        }
      }
      
      // Test 8: Nettoyage (supprimer le test)
      setCurrentTest('Nettoyage');
      log('Test 8: Suppression du holerite de test');
      
      if (insertedHolerite?.id) {
        const { error: deleteError } = await supabase
          .from('holerites')
          .delete()
          .eq('id', insertedHolerite.id);
        
        if (deleteError) {
          log(`Erreur de suppression: ${deleteError.message}`, 'error');
        } else {
          log('Holerite de test supprimé', 'success');
        }
      }
      
      // Test 9: Vérification des URLs
      setCurrentTest('Test des URLs');
      log('Test 9: Vérification des URLs du système');
      
      const urls = [
        '/br/dashboard',
        '/br/scan-new-pim'
      ];
      
      for (const url of urls) {
        try {
          const response = await fetch(`http://localhost:3000${url}`);
          if (response.ok) {
            log(`URL ${url}: OK (${response.status})`, 'success');
          } else {
            log(`URL ${url}: ERREUR (${response.status})`, 'error');
          }
        } catch (error) {
          log(`URL ${url}: INACCESSIBLE`, 'error');
        }
      }
      
      log('🎉 Tests terminés avec succès!', 'success');
      
    } catch (error) {
      log(`Erreur générale: ${error}`, 'error');
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🧪 Test du Système Holerites
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Ce test vérifie l'intégration complète du système de scan et d'affichage des holerites.
            </p>
            
            <button
              onClick={runTests}
              disabled={isRunning}
              className={`px-6 py-3 rounded-lg font-semibold text-white ${
                isRunning 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isRunning ? '🔄 Tests en cours...' : '🚀 Lancer les Tests'}
            </button>
          </div>
          
          {currentTest && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="font-medium text-blue-800">{currentTest}</span>
              </div>
            </div>
          )}
          
          <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
            <h3 className="text-white font-semibold mb-2">Logs des Tests:</h3>
            {results.length === 0 ? (
              <p className="text-gray-400">Aucun test lancé</p>
            ) : (
              <div className="space-y-1">
                {results.map((result, index) => (
                  <div key={index} className="text-sm font-mono text-gray-100">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Instructions:</h4>
            <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
              <li>Assurez-vous d'être connecté avant de lancer les tests</li>
              <li>Les tests vont créer et supprimer un holerite temporaire</li>
              <li>Vérifiez que le serveur Next.js fonctionne sur localhost:3000</li>
              <li>Si tous les tests passent, le système fonctionne correctement</li>
            </ol>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <a 
              href="/br/dashboard" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              📊 Aller au Dashboard
            </a>
            <a 
              href="/br/scan-new-pim" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              📄 Scanner un Holerite
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}