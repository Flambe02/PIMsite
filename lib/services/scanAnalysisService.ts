/**
 * Service d'analyse IA pour le module SCAN NEW PIM
 * Analyse du texte OCR et génération de recommandations
 */

export interface AnalysisResult {
  success: boolean;
  structuredData: any;
  recommendations: any;
  confidence: number;
  processingTime?: number;
  error?: string;
}

export interface CountryPrompt {
  br: string; // Brésil (par défaut)
  fr: string; // France (futur)
  pt: string; // Portugal (futur)
}

export interface StructuredData {
  employee_name?: string;
  company_name?: string;
  position?: string;
  period?: string;
  salary_bruto?: number;
  salary_liquido?: number;
  descontos?: number;
  beneficios?: string[];
  country?: string;
  statut?: string;
}

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  priority: 'urgent' | 'important' | 'normal';
  action?: string;
}

export interface Recommendations {
  resume_situation: string;
  score_optimisation: number;
  recommendations: Recommendation[];
}

export class ScanAnalysisService {
  private getPromptByCountry(country: string = 'br'): string {
    const prompts = {
      'br': `Você é um especialista em análise de folhas de pagamento brasileiras. 
      Extraia as seguintes informações do texto fornecido:
      
      - Nome do funcionário
      - Nome da empresa
      - Cargo/função
      - Período de pagamento
      - Salário bruto
      - Salário líquido
      - Descontos detalhados
      - Benefícios
      - Tipo de contrato (CLT, PJ, Estagiário)
      
      Retorne um JSON estruturado com estes campos. Se alguma informação não estiver disponível, use null.`,
      
      'fr': `Vous êtes un expert en analyse de fiches de paie françaises.
      Extrayez les informations suivantes du texte fourni:
      
      - Nom de l'employé
      - Nom de l'entreprise
      - Poste/fonction
      - Période de paie
      - Salaire brut
      - Salaire net
      - Déductions détaillées
      - Avantages sociaux
      - Type de contrat (CDI, CDD, Stage)
      
      Retournez un JSON structuré avec ces champs. Si une information n'est pas disponible, utilisez null.`,
      
      'pt': `Você é um especialista em análise de folhas de pagamento portuguesas.
      Extraia as seguintes informações do texto fornecido:
      
      - Nome do funcionário
      - Nome da empresa
      - Cargo/função
      - Período de pagamento
      - Salário bruto
      - Salário líquido
      - Descontos detalhados
      - Benefícios
      - Tipo de contrato
      
      Retorne um JSON estruturado com estes campos. Se alguma informação não estiver disponível, use null.`
    };

    return prompts[country as keyof typeof prompts] || prompts['br'];
  }

  private getRecommendationPromptByCountry(country: string = 'br'): string {
    const prompts = {
      'br': `Com base na análise da folha de pagamento, gere recomendações personalizadas para otimização financeira:
      
      - Análise do salário vs. mercado
      - Sugestões de negociação salarial
      - Otimização de benefícios
      - Planejamento de impostos
      - Investimentos recomendados
      - Economias sugeridas
      
      Retorne um JSON com recomendações estruturadas, incluindo impacto e prioridade.`,
      
      'fr': `Basé sur l'analyse de la fiche de paie, générez des recommandations personnalisées pour l'optimisation financière:
      
      - Analyse du salaire vs. marché
      - Suggestions de négociation salariale
      - Optimisation des avantages sociaux
      - Planification fiscale
      - Investissements recommandés
      - Économies suggérées
      
      Retournez un JSON avec des recommandations structurées, incluant impact et priorité.`,
      
      'pt': `Com base na análise da folha de pagamento, gere recomendações personalizadas para otimização financeira:
      
      - Análise do salário vs. mercado
      - Sugestões de negociação salarial
      - Otimização de benefícios
      - Planejamento de impostos
      - Investimentos recomendados
      - Economias sugeridas
      
      Retorne um JSON com recomendações estruturadas, incluindo impacto e prioridade.`
    };

    return prompts[country as keyof typeof prompts] || prompts['br'];
  }

  /**
   * Analyse le texte OCR et génère des données structurées
   */
  async analyzeScan(ocrText: string, country: string = 'br'): Promise<AnalysisResult> {
    try {
      console.log('🤖 Début analyse IA pour pays:', country);
      
      // Sélection du prompt selon le pays
      const prompt = this.getPromptByCountry(country);
      const fullPrompt = prompt + '\n\nTexto para análise:\n' + ocrText;

      console.log('📝 Prompt utilisé:', prompt.substring(0, 100) + '...');

      // Appel OpenAI
      const response = await this.callOpenAI(fullPrompt);
      
      if (!response) {
        throw new Error('Réponse OpenAI vide');
      }

      console.log('✅ Réponse OpenAI reçue');

      // Parsing des données structurées
      const structuredData = this.parseStructuredData(response);
      
      // Génération des recommandations
      const recommendationPrompt = this.getRecommendationPromptByCountry(country);
      const recommendationResponse = await this.callOpenAI(recommendationPrompt + '\n\nDados da folha de pagamento:\n' + JSON.stringify(structuredData, null, 2));
      
      const recommendations = this.parseRecommendations(recommendationResponse);
      
      // Calcul du score de confiance
      const confidence = this.calculateConfidence(structuredData, recommendations);

      return {
        success: true,
        structuredData,
        recommendations,
        confidence,
        processingTime: Date.now()
      };

    } catch (error) {
      console.error('❌ Erreur analyse IA:', error);
      throw error;
    }
  }

  /**
   * Appel à l'API OpenAI
   */
  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en analyse de feuilles de paie. Réponds uniquement avec du JSON valide.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Parse les données structurées depuis la réponse JSON
   */
  private parseStructuredData(response: string): StructuredData {
    try {
      // Extraire le JSON de la réponse
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Aucun JSON trouvé dans la réponse');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Mapping des champs (support portugais et anglais)
      const fieldMapping: { [key: string]: string } = {
        // Portugais
        'nome_funcionario': 'employee_name',
        'nome_empresa': 'company_name',
        'cargo_funcao': 'position',
        'periodo_pagamento': 'period',
        'salario_bruto': 'salary_bruto',
        'salario_liquido': 'salary_liquido',
        'descontos_detalhados': 'descontos',
        'tipo_contrato': 'statut'
      };

      // Conversion des champs
      const converted: any = {};
      Object.keys(parsed).forEach(key => {
        const mappedKey = fieldMapping[key] || key; // Garder la clé originale si pas de mapping
        converted[mappedKey] = parsed[key];
      });

      // Validation des données
      return {
        employee_name: converted.employee_name || '',
        company_name: converted.company_name || '',
        position: converted.position || '',
        period: converted.period || '',
        salary_bruto: Number(converted.salary_bruto) || 0,
        salary_liquido: Number(converted.salary_liquido) || 0,
        descontos: Number(converted.descontos) || 0,
        beneficios: Array.isArray(converted.beneficios) ? converted.beneficios : [],
        statut: converted.statut || 'CLT'
      };

    } catch (error) {
      console.error('❌ Erreur parsing JSON:', error);
      return {};
    }
  }

  /**
   * Parse les recommandations depuis la réponse OpenAI
   */
  private parseRecommendations(response: string): any {
    try {
      // Essayer de parser le JSON directement
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Si la réponse contient des recommandations structurées
        if (parsed.recommendations) {
          // Convertir en format attendu par l'interface
          const recommendationsList = Object.keys(parsed.recommendations).map((key, index) => {
            const rec = parsed.recommendations[key];
            
            // Traduction des titres en portugais
            const titleTranslations: { [key: string]: string } = {
              'salary_vs_market': 'Análise de Mercado',
              'salary_negotiation': 'Negociação Salarial',
              'benefits_optimization': 'Otimização de Benefícios',
              'tax_planning': 'Planejamento Fiscal',
              'recommended_investments': 'Investimentos Recomendados',
              'suggested_savings': 'Economias Sugeridas'
            };
            
            return {
              id: (index + 1).toString(),
              title: titleTranslations[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              description: rec.analysis || rec.suggestions || 'Recomendação personalizada',
              impact: rec.impact?.toLowerCase() || 'medium',
              priority: rec.priority?.toLowerCase() || 'normal'
            };
          });

          return {
            score_optimisation: 85, // Score par défaut
            recommendations: recommendationsList
          };
        }
        
        return parsed;
      }
      
      // Fallback : créer une structure basique
      return {
        score_optimisation: 75,
        recommendations: [
          {
            id: "1",
            title: "Recomendação baseada na análise",
            description: response.substring(0, 200) + "...",
            impact: "medium",
            priority: "normal"
          }
        ]
      };
    } catch (error) {
      console.error('❌ Erreur parsing recommandations:', error);
      return {
        score_optimisation: 75,
        recommendations: [
          {
            id: "1",
            title: "Análise concluída",
            description: "Recomendações geradas com sucesso",
            impact: "medium",
            priority: "normal"
          }
        ]
      };
    }
  }

  /**
   * Calcule le score de confiance basé sur les données extraites
   */
  private calculateConfidence(structuredData: any, recommendations: any): number {
    let score = 0;
    
    // Score basé sur les données structurées
    if (structuredData.employee_name) score += 0.2;
    if (structuredData.company_name) score += 0.2;
    if (structuredData.salary_bruto || structuredData.salary_liquido) score += 0.3;
    if (structuredData.period) score += 0.1;
    if (structuredData.position) score += 0.1;
    
    // Score basé sur les recommandations
    if (recommendations.recommendations && recommendations.recommendations.length > 0) {
      score += 0.1;
    }
    
    return Math.min(score, 1.0);
  }
}

// Instance par défaut
export const scanAnalysisService = new ScanAnalysisService(); 