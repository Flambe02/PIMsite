import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, User, Building, DollarSign, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ScanResultsPageProps {
  params: {
    locale: string;
    scanId: string;
  };
}

export default async function ScanResultsPage({ params }: ScanResultsPageProps) {
  const { locale, scanId } = params;
  const supabase = await createClient();

  // Récupérer les données du scan
  const { data: scanData, error } = await supabase
    .from('scan_results')
    .select('*')
    .eq('id', scanId)
    .single();

  if (error || !scanData) {
    notFound();
  }

  // Récupérer le holerite associé
  const { data: holeriteData } = await supabase
    .from('holerites')
    .select('*')
    .eq('scan_id', scanId)
    .single();

  const structuredData = scanData.structured_data;
  const finalData = structuredData?.final_data || {};

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header avec navigation */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href={`/${locale}/dashboard`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {locale === 'br' ? 'Voltar ao Dashboard' : 
           locale === 'fr' ? 'Retour au Dashboard' : 
           'Back to Dashboard'}
        </Link>
      </div>

      {/* Titre principal */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {locale === 'br' ? 'Resultados do Scan' : 
           locale === 'fr' ? 'Résultats du Scan' : 
           'Scan Results'}
        </h1>
        <p className="text-gray-600">
          {locale === 'br' ? 'Análise completa do seu holerite' : 
           locale === 'fr' ? 'Analyse complète de votre bulletin' : 
           'Complete analysis of your payslip'}
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
              <p className="font-medium">{finalData.employee_name || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {locale === 'br' ? 'Empresa' : locale === 'fr' ? 'Entreprise' : 'Company'}:
              </span>
              <p className="font-medium">{finalData.company_name || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {locale === 'br' ? 'Cargo' : locale === 'fr' ? 'Poste' : 'Position'}:
              </span>
              <p className="font-medium">{finalData.position || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {locale === 'br' ? 'Período' : locale === 'fr' ? 'Période' : 'Period'}:
              </span>
              <p className="font-medium">{finalData.period || 'N/A'}</p>
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
                R$ {finalData.gross_salary?.valor?.toLocaleString('pt-BR') || '0'}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {locale === 'br' ? 'Salário Líquido' : locale === 'fr' ? 'Salaire Net' : 'Net Salary'}:
              </span>
              <p className="font-medium text-lg text-green-600">
                R$ {finalData.net_salary?.valor?.toLocaleString('pt-BR') || '0'}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                {locale === 'br' ? 'Total de Descontos' : locale === 'fr' ? 'Total des Déductions' : 'Total Deductions'}:
              </span>
              <p className="font-medium text-red-600">
                R$ {finalData.total_deductions?.valor?.toLocaleString('pt-BR') || '0'}
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
              <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">{scanId}</p>
            </div>
            <div>
              <span className="text-gray-500">
                {locale === 'br' ? 'Data do Scan' : locale === 'fr' ? 'Date du Scan' : 'Scan Date'}:
              </span>
              <p className="font-medium">
                {new Date(scanData.created_at).toLocaleDateString(
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
              <p className="font-medium capitalize">{scanData.analysis_version?.type || 'enhanced'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bouton retour */}
      <div className="text-center">
        <Link 
          href={`/${locale}/dashboard`}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {locale === 'br' ? 'Voltar ao Dashboard' : 
           locale === 'fr' ? 'Retour au Dashboard' : 
           'Back to Dashboard'}
        </Link>
      </div>
    </div>
  );
}
