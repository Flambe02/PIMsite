// Données des valeurs faciales 2024 pour les cartes restaurant au Brésil
// Basé sur les données officielles du prix moyen d'un repas complet PAR JOUR

export interface ValorFacialData {
  regiao: string;
  estados: {
    sigla: string;
    nome: string;
    valorFacial: number;
    variacao2023?: number; // Variation par rapport à 2023 en %
  }[];
  valorMedio: number;
  variacao2023?: number;
}

export const valorFacial2024: ValorFacialData[] = [
  {
    regiao: "Norte",
    valorMedio: 45.41, // Prix quotidien d'un repas complet
    variacao2023: 11.2,
    estados: [
      { sigla: "AC", nome: "Acre", valorFacial: 48.50 },
      { sigla: "AP", nome: "Amapá", valorFacial: 46.80 },
      { sigla: "AM", nome: "Amazonas", valorFacial: 47.20 },
      { sigla: "PA", nome: "Pará", valorFacial: 44.30 },
      { sigla: "RO", nome: "Rondônia", valorFacial: 43.90 },
      { sigla: "RR", nome: "Roraima", valorFacial: 45.80 },
      { sigla: "TO", nome: "Tocantins", valorFacial: 42.60 }
    ]
  },
  {
    regiao: "Nordeste",
    valorMedio: 49.09, // Prix quotidien d'un repas complet
    variacao2023: 12.7,
    estados: [
      { sigla: "AL", nome: "Alagoas", valorFacial: 47.80 },
      { sigla: "BA", nome: "Bahia", valorFacial: 48.90 },
      { sigla: "CE", nome: "Ceará", valorFacial: 49.20 },
      { sigla: "MA", nome: "Maranhão", valorFacial: 46.50 },
      { sigla: "PB", nome: "Paraíba", valorFacial: 48.30 },
      { sigla: "PE", nome: "Pernambuco", valorFacial: 50.10 },
      { sigla: "PI", nome: "Piauí", valorFacial: 47.20 },
      { sigla: "RN", nome: "Rio Grande do Norte", valorFacial: 48.70 },
      { sigla: "SE", nome: "Sergipe", valorFacial: 49.50 }
    ]
  },
  {
    regiao: "Centro-Oeste",
    valorMedio: 45.21, // Prix quotidien d'un repas complet
    variacao2023: 10.8,
    estados: [
      { sigla: "DF", nome: "Distrito Federal", valorFacial: 52.30 },
      { sigla: "GO", nome: "Goiás", valorFacial: 44.80 },
      { sigla: "MT", nome: "Mato Grosso", valorFacial: 43.90 },
      { sigla: "MS", nome: "Mato Grosso do Sul", valorFacial: 44.20 }
    ]
  },
  {
    regiao: "Sudeste",
    valorMedio: 54.54, // Prix quotidien d'un repas complet
    variacao2023: 11.5,
    estados: [
      { sigla: "ES", nome: "Espírito Santo", valorFacial: 52.80 },
      { sigla: "MG", nome: "Minas Gerais", valorFacial: 53.20 },
      { sigla: "RJ", nome: "Rio de Janeiro", valorFacial: 58.90 },
      { sigla: "SP", nome: "São Paulo", valorFacial: 56.40 }
    ]
  },
  {
    regiao: "Sul",
    valorMedio: 48.91, // Prix quotidien d'un repas complet
    variacao2023: 14.2,
    estados: [
      { sigla: "PR", nome: "Paraná", valorFacial: 48.30 },
      { sigla: "RS", nome: "Rio Grande do Sul", valorFacial: 49.20 },
      { sigla: "SC", nome: "Santa Catarina", valorFacial: 49.10 }
    ]
  }
];

// Valeur nationale moyenne (prix quotidien d'un repas complet)
export const valorFacialNacional = 51.61;

// Types d'établissements et leurs prix moyens
export const tiposEstabelecimento = {
  comercial: 37.44,
  autosservico: 47.87,
  executivo: 55.63,
  alacarte: 96.44
};

// Fonction pour calculer la valeur faciale par jour travaillé
// Maintenant les données sont déjà quotidiennes, donc pas besoin de diviser
export function calcularValorFacialDiario(
  valorFacial: number,
  diasTrabalhados: number = 22 // Moyenne mensuelle standard
): number {
  return valorFacial; // Les données sont déjà quotidiennes
}

// Fonction pour obtenir la valeur faciale par état
export function getValorFacialPorEstado(siglaEstado: string): number | null {
  for (const regiao of valorFacial2024) {
    const estado = regiao.estados.find(e => e.sigla === siglaEstado.toUpperCase());
    if (estado) {
      return estado.valorFacial;
    }
  }
  return null;
}

// Fonction pour obtenir la valeur faciale par région
export function getValorFacialPorRegiao(nomeRegiao: string): number | null {
  const regiao = valorFacial2024.find(r => 
    r.regiao.toLowerCase().includes(nomeRegiao.toLowerCase())
  );
  return regiao ? regiao.valorMedio : null;
}

// Fonction pour analyser l'adéquation du vale refeição
export function analisarValeRefeicao(
  valorRecebido: number,
  estado?: string,
  diasTrabalhados: number = 22
): {
  adequado: boolean;
  valorFacialEstado: number;
  valorDiario: number;
  diferenca: number;
  recomendacao: string;
} {
  const valorFacialEstado = estado ? getValorFacialPorEstado(estado) : valorFacialNacional;
  const valorDiario = valorRecebido / diasTrabalhados; // Valeur quotidienne reçue
  const valorFacialDiario = valorFacialEstado || valorFacialNacional; // Valeur faciale quotidienne du marché (déjà quotidienne)
  const diferenca = valorDiario - valorFacialDiario;
  
  const adequado = diferenca >= -5.00; // Tolérance de R$ 5,00 par jour (car les valeurs sont plus élevées)
  
  let recomendacao = "";
  if (diferenca > 10.00) {
    recomendacao = `Seu vale refeição diário (R$ ${valorDiario.toFixed(2)}) está R$ ${diferenca.toFixed(2)} acima da média do mercado (R$ ${valorFacialDiario.toFixed(2)}). Considere negociar um valor mais adequado.`;
  } else if (diferenca < -10.00) {
    recomendacao = `Seu vale refeição diário (R$ ${valorDiario.toFixed(2)}) está R$ ${Math.abs(diferenca).toFixed(2)} abaixo da média do mercado (R$ ${valorFacialDiario.toFixed(2)}). Solicite um reajuste.`;
  } else {
    recomendacao = `Seu vale refeição diário (R$ ${valorDiario.toFixed(2)}) está adequado ao mercado atual (R$ ${valorFacialDiario.toFixed(2)}).`;
  }
  
  return {
    adequado,
    valorFacialEstado: valorFacialEstado || valorFacialNacional,
    valorDiario,
    diferenca,
    recomendacao
  };
} 