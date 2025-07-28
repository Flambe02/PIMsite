/**
 * Page principale SCAN NEW PIM
 * Interface complète pour le scan de feuilles de paie
 */

import React from 'react';
import { Metadata } from 'next';
import ScanNewPIM from '@/components/scan-new-pim/ScanNewPIM';

export const metadata: Metadata = {
  title: 'SCAN NEW PIM - Analyse intelligente de feuilles de paie',
  description: 'Analysez votre feuille de paie avec l\'IA pour obtenir des recommandations personnalisées',
};

interface ScanNewPIMPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function ScanNewPIMPage({ params }: ScanNewPIMPageProps) {
  // Détection du pays basée sur la locale
  const getCountryFromLocale = (locale: string) => {
    const countryMap: { [key: string]: string } = {
      'br': 'br',
      'fr': 'fr', 
      'pt': 'pt'
    };
    return countryMap[locale] || 'br';
  };

  const resolvedParams = await params;
  const country = getCountryFromLocale(resolvedParams.locale);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <ScanNewPIM country={country} />
      </div>
    </div>
  );
} 