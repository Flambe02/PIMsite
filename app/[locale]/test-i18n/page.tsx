"use client";

import { useTranslations } from '@/hooks/useTranslations';
import { useParams } from 'next/navigation';

export default function TestI18nPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params?.locale as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Test d'internationalisation
      </h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Locale actuel : {locale}
        </h2>
        
        <div className="space-y-4">
          <div>
            <strong>Navigation :</strong>
            <p>{t.navigation?.dashboard || 'Dashboard'}</p>
            <p>{t.navigation?.recursos || 'Recursos'}</p>
            <p>{t.navigation?.['guia-paises'] || 'Guia dos Países'}</p>
          </div>
          
          <div>
            <strong>Common :</strong>
            <p>{t.common?.['salario-bruto'] || 'Salário Bruto'}</p>
            <p>{t.common?.carregando || 'Carregando'}</p>
            <p>{t.common?.erro || 'Erro'}</p>
          </div>
          
          <div>
            <strong>Dashboard :</strong>
            <p>{t.dashboard?.compensacao || 'Compensação'}</p>
            <p>{t.dashboard?.beneficios || 'Benefícios'}</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">URLs de test :</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/br/test-i18n" className="text-blue-600 hover:underline">/br/test-i18n</a></li>
            <li><a href="/fr/test-i18n" className="text-blue-600 hover:underline">/fr/test-i18n</a></li>
            <li><a href="/en/test-i18n" className="text-blue-600 hover:underline">/en/test-i18n</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
} 