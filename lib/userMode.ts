/**
 * Détection du mode utilisateur (CLT vs PJ)
 * Basé sur les données de profil, les documents uploadés, ou l'historique
 */

export type UserMode = 'clt' | 'pj';

export interface UserModeDetection {
  mode: UserMode;
  confidence: 'high' | 'medium' | 'low';
  source: 'profile' | 'documents' | 'heuristic' | 'fallback';
  details?: string;
}

/**
 * Détecte le mode utilisateur depuis les données disponibles
 */
export function detectUserMode(data: {
  profile?: any;
  latestHolerite?: any;
  latestScan?: any;
  documents?: any[];
}): UserModeDetection {
  // 1. Vérifier le profil utilisateur
  if (data.profile) {
    const profileMode = detectFromProfile(data.profile);
    if (profileMode.mode) {
      return {
        mode: profileMode.mode,
        confidence: 'high',
        source: 'profile',
        details: profileMode.details
      };
    }
  }

  // 2. Vérifier les documents récents
  if (data.documents && data.documents.length > 0) {
    const documentMode = detectFromDocuments(data.documents);
    if (documentMode.mode) {
      return {
        mode: documentMode.mode,
        confidence: 'high',
        source: 'documents',
        details: documentMode.details
      };
    }
  }

  // 3. Vérifier le dernier holerite/scan
  if (data.latestHolerite || data.latestScan) {
    const holeriteMode = detectFromHolerite(data.latestHolerite || data.latestScan);
    if (holeriteMode.mode) {
      return {
        mode: holeriteMode.mode,
        confidence: 'medium',
        source: 'heuristic',
        details: holeriteMode.details
      };
    }
  }

  // 4. Fallback vers CLT (mode par défaut)
  return {
    mode: 'clt',
    confidence: 'low',
    source: 'fallback',
    details: 'Aucune donnée disponible, mode CLT par défaut'
  };
}

/**
 * Détecte le mode depuis le profil utilisateur
 */
function detectFromProfile(profile: any): { mode?: UserMode; details?: string } {
  // Vérifier les champs de profil spécifiques
  if (profile.employment_type) {
    switch (profile.employment_type.toLowerCase()) {
      case 'clt':
      case 'employee':
      case 'salarié':
        return { mode: 'clt', details: 'Type d\'emploi: CLT' };
      case 'pj':
      case 'freelancer':
      case 'contractor':
      case 'entrepreneur':
        return { mode: 'pj', details: 'Type d\'emploi: PJ' };
    }
  }

  if (profile.user_type) {
    switch (profile.user_type.toLowerCase()) {
      case 'clt':
        return { mode: 'clt', details: 'Type utilisateur: CLT' };
      case 'pj':
        return { mode: 'pj', details: 'Type utilisateur: PJ' };
    }
  }

  return {};
}

/**
 * Détecte le mode depuis les documents uploadés
 */
function detectFromDocuments(documents: any[]): { mode?: UserMode; details?: string } {
  let cltCount = 0;
  let pjCount = 0;

  for (const doc of documents) {
    // Vérifier le type de document
    if (doc.file_type) {
      if (doc.file_type.includes('holerite') || doc.file_type.includes('payslip')) {
        cltCount++;
      } else if (doc.file_type.includes('nfs') || doc.file_type.includes('invoice')) {
        pjCount++;
      }
    }

    // Vérifier le nom du fichier
    if (doc.file_name) {
      const fileName = doc.file_name.toLowerCase();
      if (fileName.includes('holerite') || fileName.includes('payslip')) {
        cltCount++;
      } else if (fileName.includes('nfs') || fileName.includes('nota') || fileName.includes('fatura')) {
        pjCount++;
      }
    }

    // Vérifier les données structurées
    if (doc.structured_data) {
      const structuredData = doc.structured_data;
      
      // Indicateurs CLT
      if (structuredData.folha_pagamento || structuredData.salario_bruto || structuredData.inss) {
        cltCount++;
      }
      
      // Indicateurs PJ
      if (structuredData.iss || structuredData.das || structuredData.cnpj) {
        pjCount++;
      }
    }
  }

  if (cltCount > pjCount) {
    return { mode: 'clt', details: `${cltCount} documents CLT détectés` };
  } else if (pjCount > cltCount) {
    return { mode: 'pj', details: `${pjCount} documents PJ détectés` };
  }

  return {};
}

/**
 * Détecte le mode depuis un holerite/scan
 */
function detectFromHolerite(holerite: any): { mode?: UserMode; details?: string } {
  if (!holerite) return {};

  // Vérifier les données structurées
  const structuredData = holerite.structured_data || holerite.analysis?.structured_data || holerite.data?.structured_data;

  if (structuredData) {
    // Indicateurs CLT
    const cltIndicators = [
      'folha_pagamento',
      'salario_bruto',
      'salario_liquido',
      'inss',
      'irrf',
      'fgts',
      'vale_refeicao',
      'vale_alimentacao'
    ];

    const cltCount = cltIndicators.filter(indicator => 
      structuredData[indicator] !== undefined && structuredData[indicator] !== null
    ).length;

    // Indicateurs PJ
    const pjIndicators = [
      'iss',
      'das',
      'cnpj',
      'pro_labore',
      'fator_r',
      'simples_nacional'
    ];

    const pjCount = pjIndicators.filter(indicator => 
      structuredData[indicator] !== undefined && structuredData[indicator] !== null
    ).length;

    if (cltCount > pjCount) {
      return { mode: 'clt', details: `${cltCount} indicateurs CLT trouvés` };
    } else if (pjCount > cltCount) {
      return { mode: 'pj', details: `${pjCount} indicateurs PJ trouvés` };
    }
  }

  // Vérifier les recommandations
  const recommendations = holerite.recommendations || holerite.analysis?.recommendations;
  if (recommendations) {
    const recText = JSON.stringify(recommendations).toLowerCase();
    
    if (recText.includes('vr') || recText.includes('vale') || recText.includes('irrf')) {
      return { mode: 'clt', details: 'Recommandations CLT détectées' };
    }
    
    if (recText.includes('das') || recText.includes('iss') || recText.includes('fator r')) {
      return { mode: 'pj', details: 'Recommandations PJ détectées' };
    }
  }

  return {};
}

/**
 * Sauvegarde le mode utilisateur dans localStorage
 */
export function saveUserModeToStorage(mode: UserMode): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pim_user_mode', mode);
  }
}

/**
 * Récupère le mode utilisateur depuis localStorage
 */
export function getUserModeFromStorage(): UserMode | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('pim_user_mode');
    if (stored === 'clt' || stored === 'pj') {
      return stored;
    }
  }
  return null;
}

/**
 * Hook pour détecter et gérer le mode utilisateur
 */
export function useUserMode(data: {
  profile?: any;
  latestHolerite?: any;
  latestScan?: any;
  documents?: any[];
}): UserModeDetection {
  // Essayer d'abord le localStorage
  const storedMode = getUserModeFromStorage();
  if (storedMode) {
    return {
      mode: storedMode,
      confidence: 'medium',
      source: 'profile',
      details: 'Mode sauvegardé en localStorage'
    };
  }

  // Sinon, détecter depuis les données
  const detection = detectUserMode(data);
  
  // Sauvegarder le mode détecté
  if (detection.confidence !== 'low') {
    saveUserModeToStorage(detection.mode);
  }

  return detection;
}
