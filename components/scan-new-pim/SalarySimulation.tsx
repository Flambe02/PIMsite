/**
 * Composant de Simulation de Salaire Avancé
 * Interface interactive pour optimiser la compensation
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Calculator, 
  Target, 
  BarChart3,
  ArrowRight,
  RefreshCw,
  Save,
  Download,
  User,
  Users,
  Building,
  Briefcase,
  CreditCard,
  Utensils,
  Heart,
  Car,
  GraduationCap,
  Home,
  Plane
} from 'lucide-react';
import './SalarySimulation.css';

interface SalarySimulationProps {
  structuredData: any;
  enhancedExplanation: any;
}

export const SalarySimulation: React.FC<SalarySimulationProps> = ({
  structuredData,
  enhancedExplanation
}) => {
  // État local pour la simulation
  const [simulationData, setSimulationData] = useState({
    grossSalary: structuredData?.gross_salary?.valor || structuredData?.salario_bruto?.valor || 0,
    benefits: 0,
    mealAllowance: structuredData?.meal_allowance?.valor || 0,
    healthPlan: structuredData?.health_plan?.valor || 0,
    transportAllowance: structuredData?.transport_allowance?.valor || 0,
    educationAllowance: structuredData?.education_allowance?.valor || 0,
    inssRate: 11, // Taux INSS par défaut
    irrfRate: 15, // Taux IRRF par défaut
    dependents: 0,
    performanceBonus: 0,
    relocationBudget: 0,
    learningBudget: 0
  });

  // Calculs en temps réel
  const [calculations, setCalculations] = useState({
    totalEarnings: 0,
    totalDeductions: 0,
    netSalary: 0,
    inssAmount: 0,
    irrfAmount: 0,
    optimizationScore: 0
  });

  // Mise à jour des calculs quand les données changent
  useEffect(() => {
    const totalEarnings = simulationData.grossSalary + simulationData.benefits + 
                         simulationData.mealAllowance + simulationData.performanceBonus;
    
    const inssAmount = Math.min(simulationData.grossSalary * (simulationData.inssRate / 100), 751.97);
    const irrfBase = simulationData.grossSalary - inssAmount - (simulationData.dependents * 189.59);
    const irrfAmount = Math.max(irrfBase * (simulationData.irrfRate / 100), 0);
    
    const totalDeductions = inssAmount + irrfAmount + simulationData.healthPlan + 
                           simulationData.transportAllowance + simulationData.educationAllowance;
    
    const netSalary = totalEarnings - totalDeductions;
    
    // Score d'optimisation basé sur le ratio salaire net/brut
    const optimizationScore = Math.round((netSalary / simulationData.grossSalary) * 100);
    
    setCalculations({
      totalEarnings,
      totalDeductions,
      netSalary,
      inssAmount,
      irrfAmount,
      optimizationScore
    });
  }, [simulationData]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSliderChange = (field: string, value: number) => {
    setSimulationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetSimulation = () => {
    setSimulationData({
      grossSalary: structuredData?.gross_salary?.valor || structuredData?.salario_bruto?.valor || 0,
      benefits: 0,
      mealAllowance: structuredData?.meal_allowance?.valor || 0,
      healthPlan: structuredData?.health_plan?.valor || 0,
      transportAllowance: structuredData?.transport_allowance?.valor || 0,
      educationAllowance: structuredData?.education_allowance?.valor || 0,
      inssRate: 11,
      irrfRate: 15,
      dependents: 0,
      performanceBonus: 0,
      relocationBudget: 0,
      learningBudget: 0
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Perfil de Trabalho - Section principale */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 p-6 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-indigo-900">Simulação de Otimização</h2>
            <p className="text-indigo-700">Ajuste os valores para encontrar o melhor pacote de compensação</p>
          </div>
        </div>
        
        {/* Score d'optimisation circulaire */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="8"
                strokeDasharray={`${calculations.optimizationScore * 3.39} 339`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{calculations.optimizationScore}%</div>
                <div className="text-sm text-indigo-600 font-medium">Score</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Indicateurs de statut - Perfil de Trabalho */}
        <div>
          <h4 className="text-sm font-semibold text-indigo-700 mb-3 text-center">Perfil de Trabalho</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Statut d'emploi */}
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-indigo-200 shadow-sm">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                {structuredData?.profile_type === 'PJ' ? (
                  <Building className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                )}
              </div>
              <div className="text-center">
                <div className="text-xs text-indigo-600 font-medium">
                  {structuredData?.profile_type === 'PJ' ? 'PJ' : 'CLT'}
                </div>
                <div className="text-xs text-indigo-500">
                  {structuredData?.profile_type === 'PJ' ? 'Pessoa Jurídica' : 'Contrato CLT'}
                </div>
              </div>
            </div>

            {/* Dépendants */}
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-purple-200 shadow-sm">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                {simulationData.dependents > 0 ? (
                  <Users className="w-4 h-4 text-purple-600" />
                ) : (
                  <User className="w-4 h-4 text-purple-600" />
                )}
              </div>
              <div className="text-center">
                <div className="text-xs text-purple-600 font-medium">
                  {simulationData.dependents > 0 ? `${simulationData.dependents} dependente${simulationData.dependents > 1 ? 's' : ''}` : 'Sem dependentes'}
                </div>
                <div className="text-xs text-purple-500">
                  {simulationData.dependents > 0 ? 'Reduz IRRF' : 'Sem dedução'}
                </div>
              </div>
            </div>

            {/* Carte restaurant */}
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-orange-200 shadow-sm">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Utensils className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-center">
                <div className="text-xs text-orange-600 font-medium">
                  Vale Refeição
                </div>
                <div className="text-xs text-orange-500">
                  {formatCurrency(simulationData.mealAllowance)}
                </div>
              </div>
            </div>

            {/* Plano de saúde */}
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-red-200 shadow-sm">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-center">
                <div className="text-xs text-red-600 font-medium">
                  Plano Saúde
                </div>
                <div className="text-xs text-red-500">
                  {formatCurrency(simulationData.healthPlan)}
                </div>
              </div>
            </div>

            {/* Transport */}
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-blue-200 shadow-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Car className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-center">
                <div className="text-xs text-blue-600 font-medium">
                  Vale Transporte
                </div>
                <div className="text-xs text-blue-500">
                  {formatCurrency(simulationData.transportAllowance)}
                </div>
              </div>
            </div>

            {/* Éducation */}
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-green-200 shadow-sm">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-center">
                <div className="text-xs text-green-600 font-medium">
                  Auxílio Educação
                </div>
                <div className="text-xs text-green-500">
                  {formatCurrency(simulationData.educationAllowance)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grille principale de simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne 1: Salário et Bénéfices */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Salário e Benefícios
            </h3>
            
            <div className="space-y-4">
              {/* Salário Bruto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Salário Bruto
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="100"
                    value={simulationData.grossSalary}
                    onChange={(e) => handleSliderChange('grossSalary', Number(e.target.value))}
                    className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-lg font-bold text-green-600 min-w-[80px] text-right">
                    {formatCurrency(simulationData.grossSalary)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Base para cálculo de impostos e benefícios
                </div>
              </div>

              {/* Bénéfices */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  Benefícios Adicionais
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={simulationData.benefits}
                    onChange={(e) => handleSliderChange('benefits', Number(e.target.value))}
                    className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-lg font-bold text-blue-600 min-w-[80px] text-right">
                    {formatCurrency(simulationData.benefits)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Bônus, comissões e outros benefícios
                </div>
              </div>

              {/* Vale Refeição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-orange-600" />
                  Vale Refeição
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={simulationData.mealAllowance}
                    onChange={(e) => handleSliderChange('mealAllowance', Number(e.target.value))}
                    className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-lg font-bold text-orange-600 min-w-[80px] text-right">
                    {formatCurrency(simulationData.mealAllowance)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Benefício não tributável para alimentação
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne 2: Déductions et Taxes */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-red-600" />
              Deduções e Impostos
            </h3>
            
            <div className="space-y-4">
              {/* Taux INSS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4 text-red-600" />
                  Taxa INSS (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="7.5"
                    max="14"
                    step="0.5"
                    value={simulationData.inssRate}
                    onChange={(e) => handleSliderChange('inssRate', Number(e.target.value))}
                    className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-lg font-bold text-red-600 min-w-[50px] text-right">
                    {simulationData.inssRate}%
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Contribuição para aposentadoria pública
                </div>
              </div>

              {/* Taux IRRF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-red-600" />
                  Taxa IRRF (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="27.5"
                    step="0.5"
                    value={simulationData.irrfRate}
                    onChange={(e) => handleSliderChange('irrfRate', Number(e.target.value))}
                    className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-lg font-bold text-red-600 min-w-[50px] text-right">
                    {simulationData.irrfRate}%
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Imposto de Renda Retido na Fonte
                </div>
              </div>

              {/* Dépendants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  Dependentes
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={simulationData.dependents}
                    onChange={(e) => handleSliderChange('dependents', Number(e.target.value))}
                    className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-lg font-bold text-purple-600 min-w-[30px] text-right">
                    {simulationData.dependents}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Cada dependente reduz R$ 189,59 da base IRRF
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne 3: Résultats en temps réel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Resultado da Simulação
            </h3>
            
            <div className="space-y-3">
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <p className="text-green-700 text-sm font-medium">Total Proventos</p>
                <p className="text-green-800 text-xl font-bold">{formatCurrency(calculations.totalEarnings)}</p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <p className="text-red-700 text-sm font-medium">Total Deduções</p>
                <p className="text-red-800 text-xl font-bold">{formatCurrency(calculations.totalDeductions)}</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-blue-700 text-sm font-medium">Salário Líquido</p>
                <p className="text-blue-800 text-2xl font-bold">{formatCurrency(calculations.netSalary)}</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <p className="text-purple-700 text-sm font-medium">INSS</p>
                <p className="text-purple-800 text-lg font-bold">{formatCurrency(calculations.inssAmount)}</p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                <p className="text-orange-700 text-sm font-medium">IRRF</p>
                <p className="text-orange-800 text-lg font-bold">{formatCurrency(calculations.irrfAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions et Boutons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={resetSimulation}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Resetar Simulação
        </button>
        
        <button
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Salvar Cenário
        </button>
        
        <button
          className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar Relatório
        </button>
      </div>

      {/* Recommandations d'optimisation */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 p-6 shadow-lg">
        <h3 className="text-lg font-bold text-yellow-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-yellow-600" />
          Recomendações de Otimização
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Maximizar Benefícios</h4>
            <p className="text-yellow-700 text-sm">
              Considere negociar benefícios não tributáveis como vale-refeição, plano de saúde e auxílio-transporte.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">📊 Otimizar Dependentes</h4>
            <p className="text-yellow-700 text-sm">
              Cada dependente reduz a base de cálculo do IRRF em R$ 189,59 por mês.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">🎯 Previdência Privada</h4>
            <p className="text-yellow-700 text-sm">
              Contribuições para PGBL podem ser deduzidas até 12% da renda bruta anual.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">🚀 Bônus por Performance</h4>
            <p className="text-yellow-700 text-sm">
              Bônus variáveis podem aumentar significativamente o salário líquido sem impactar a base de impostos.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
