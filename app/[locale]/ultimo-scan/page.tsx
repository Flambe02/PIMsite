import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, User, Building, DollarSign, Calendar, ArrowLeft, Eye, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface UltimoScanPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function UltimoScanPage({ params }: UltimoScanPageProps) {
  const { locale } = await params;
  const supabase = await createClient();

  // Récupérer le dernier scan de l'utilisateur
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    notFound();
  }

  // Récupérer le dernier scan_results
  const { data: lastScan, error: scanError } = await supabase
    .from('scan_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (scanError || !lastScan) {
    // Si pas de scan, rediriger vers la page de scan
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === 'br' ? 'Nenhum Scan Encontrado' : 
             locale === 'fr' ? 'Aucun Scan Trouvé' : 
             'No Scan Found'}
          </h1>
          <p className="text-gray-600 mb-8">
            {locale === 'br' ? 'Você ainda não fez nenhum scan de holerite.' : 
             locale === 'fr' ? 'Vous n\'avez pas encore fait de scan de bulletin.' : 
             'You haven\'t scanned any payslip yet.'}
          </p>
          <div className="space-x-4">
            <Link href={`/${locale}/scan-new-pim`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                {locale === 'br' ? 'Fazer Primeiro Scan' : 
                 locale === 'fr' ? 'Faire Premier Scan' : 
                 'Make First Scan'}
              </Button>
            </Link>
            <Link href={`/${locale}/dashboard`}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {locale === 'br' ? 'Voltar ao Dashboard' : 
                 locale === 'fr' ? 'Retour au Dashboard' : 
                 'Back to Dashboard'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Récupérer le holerite associé
  const { data: holeriteData } = await supabase
    .from('holerites')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Extraire les données de manière plus robuste
  const structuredData = lastScan.structured_data || {};
  const finalData = structuredData?.final_data || structuredData?.extraction || {};
  const analysis = structuredData?.analysis || {};
  const recommendations = analysis?.recommendations || structuredData?.recommendations || {};
  const enhancedExplanation = analysis?.finalData?.enhancedExplanation || structuredData?.enhancedExplanation || {};

  // Fonction pour formater la monnaie
  const formatCurrency = (value: any): string => {
    if (!value || isNaN(Number(value))) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(value));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link 
          href={`/${locale}/dashboard`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {locale === 'br' ? 'Voltar ao Dashboard' : 
           locale === 'fr' ? 'Retour au Dashboard' : 
           'Back to Dashboard'}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {locale === 'br' ? 'Último scan:' : 
             locale === 'fr' ? 'Dernier scan:' : 
             'Last scan:'}
          </span>
          <span className="text-sm font-medium">
            {new Date(lastScan.created_at).toLocaleDateString(
              locale === 'fr' ? 'fr-FR' : 'pt-BR',
              { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }
            )}
          </span>
        </div>
      </div>

      {/* Titre principal */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {locale === 'br' ? 'Resultados do Último Scan' : 
           locale === 'fr' ? 'Résultats du Dernier Scan' : 
           'Last Scan Results'}
        </h1>
        <p className="text-gray-600">
          {locale === 'br' ? 'Análise completa do seu holerite mais recente' : 
           locale === 'fr' ? 'Analyse complète de votre bulletin le plus récent' : 
           'Complete analysis of your most recent payslip'}
        </p>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Informations de l'employé */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              {locale === 'br' ? 'Informações do Funcionário' : 
               locale === 'fr' ? 'Informations de l\'employé' : 
               'Employee Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">
                {locale === 'br' ? 'Nome' : locale === 'fr' ? 'Nom' : 'Name'}:
              </span>
              <p className="font-medium">
                {finalData.employee_name || enhancedExplanation?.employee_name || holeriteData?.nome || 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {locale === 'br' ? 'Empresa' : locale === 'fr' ? 'Entreprise' : 'Company'}:
              </span>
              <p className="font-medium">
                {finalData.company_name || enhancedExplanation?.company_name || holeriteData?.empresa || 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {locale === 'br' ? 'Cargo' : locale === 'fr' ? 'Poste' : 'Position'}:
              </span>
              <p className="font-medium">
                {finalData.position || enhancedExplanation?.position || 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {locale === 'br' ? 'Período' : locale === 'fr' ? 'Période' : 'Period'}:
              </span>
              <p className="font-medium">
                {finalData.period || enhancedExplanation?.period || holeriteData?.data_pagamento || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informations salariales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              {locale === 'br' ? 'Informações Salariais' : 
               locale === 'fr' ? 'Informations Salariales' : 
               'Salary Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">
                {locale === 'br' ? 'Salário Bruto' : locale === 'fr' ? 'Salaire Brut' : 'Gross Salary'}:
              </span>
              <p className="font-medium text-lg text-green-600">
                {formatCurrency(finalData.gross_salary?.valor || finalData.salario_bruto?.valor || holeriteData?.salario_bruto || 0)}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {locale === 'br' ? 'Salário Líquido' : locale === 'fr' ? 'Salaire Net' : 'Net Salary'}:
              </span>
              <p className="font-medium text-lg text-green-600">
                {formatCurrency(finalData.net_salary?.valor || finalData.salario_liquido?.valor || holeriteData?.salario_liquido || 0)}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {locale === 'br' ? 'Total de Descontos' : locale === 'fr' ? 'Total des Déductions' : 'Total Deductions'}:
              </span>
              <p className="font-medium text-red-600">
                {formatCurrency(finalData.total_deductions?.valor || 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Détails du scan */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            {locale === 'br' ? 'Detalhes do Scan' : 
             locale === 'fr' ? 'Détails du Scan' : 
             'Scan Details'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">
                {locale === 'br' ? 'ID do Scan' : locale === 'fr' ? 'ID du Scan' : 'Scan ID'}:
              </span>
              <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">{lastScan.id}</p>
            </div>
            <div>
              <span className="text-gray-500">
                {locale === 'br' ? 'Data do Scan' : locale === 'fr' ? 'Date du Scan' : 'Scan Date'}:
              </span>
              <p className="font-medium">
                {new Date(lastScan.created_at).toLocaleDateString(
                  locale === 'fr' ? 'fr-FR' : 'pt-BR',
                  { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }
                )}
              </p>
            </div>
            <div>
              <span className="text-gray-500">
                {locale === 'br' ? 'Tipo de Análise' : locale === 'fr' ? 'Type d\'Analyse' : 'Analysis Type'}:
              </span>
              <p className="font-medium capitalize">{lastScan.analysis_version?.type || 'enhanced'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommandations */}
      {recommendations && Object.keys(recommendations).length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {locale === 'br' ? 'Recomendações PIM' : 
               locale === 'fr' ? 'Recommandations PIM' : 
               'PIM Recommendations'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(recommendations.recommendations) ? (
                recommendations.recommendations.map((rec: any, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      {rec.title || rec.label || `Recomendação ${index + 1}`}
                    </h4>
                    <p className="text-yellow-700 text-sm leading-relaxed">
                      {rec.description || rec.desc || rec.recommendation || 'Descrição não disponível'}
                    </p>
                    {rec.estimatedSavings && rec.estimatedSavings !== 'N/A' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-2">
                        <p className="text-green-700 text-xs font-medium">
                          💰 {locale === 'br' ? 'Economia estimada' : 
                               locale === 'fr' ? 'Économie estimée' : 
                               'Estimated savings'}: {formatCurrency(rec.estimatedSavings)}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  {locale === 'br' ? 'Nenhuma recomendação específica disponível para este holerite.' : 
                   locale === 'fr' ? 'Aucune recommandation spécifique disponible pour ce bulletin.' : 
                   'No specific recommendations available for this payslip.'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href={`/${locale}/scan-new-pim`}>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            {locale === 'br' ? 'Novo Scan' : 
             locale === 'fr' ? 'Nouveau Scan' : 
             'New Scan'}
          </Button>
        </Link>
        <Link href={`/${locale}/dashboard`}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {locale === 'br' ? 'Voltar ao Dashboard' : 
             locale === 'fr' ? 'Retour au Dashboard' : 
             'Back to Dashboard'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
