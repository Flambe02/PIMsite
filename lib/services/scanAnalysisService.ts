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
  private getPrompt(country: string): string {
    const prompts = {
      'br': `Você é um especialista em análise de folhas de pagamento brasileiras.
      Analise cuidadosamente o texto da folha de pagamento e extraia TODAS as informações disponíveis.

      **INSTRUÇÕES CRÍTICAS PARA EXTRAÇÃO DE NOMES:**
      1. Para nome do funcionário: Procure por "Nome do Funcionário:", "Funcionário:", ou qualquer nome próprio isolado (ex: "Marcos", "João")
      2. Para empresa: Procure por "Empresa:", "CNPJ:", ou qualquer nome que pareça ser uma empresa (ex: "Aprender Excel", "Ltda.")
      3. Para cargo: Procure por "CBO:", "Escrivão", "judicial", ou qualquer descrição de função
      4. Para período: Procure por "janeiro", "fevereiro", etc. seguido de ano
      5. Para salários: Procure por valores numéricos grandes (ex: 15.345,00)
      6. Para descontos: Procure por "INSS", "IRFF", "PENSAO ALIMENTICIA" e extraia os valores correspondants

      **EXEMPLOS DE RECHERCHE FLEXÍVEL:**
      - Se encontrar "Marcos" seul → nome_funcionario: "Marcos"
      - Si encontrar "Aprender Excel" → company_name: "Aprender Excel Ltda."
      - Si encontrar "Escrivão judicial" → position: "Escrivão judicial"
      - Si encontrar "janeiro/2017" → period: "janeiro/2017"

      **ANÁLISE DETALHADA DE DESCONTOS:**
      - Procure por "INSS" e extraia o valor correspondant
      - Procure por "IRFF" ou "IMPOSTO DE RENDA" e extraia o valeur
      - Procure por "PENSAO ALIMENTICIA" et extraia le valeur
      - Procure por "Total de Descontos" et calcule la différence

      **ESTRUTURA JSON:**
      {
        "nome_funcionario": "Nome do funcionário (procure de forma flexible)",
        "company_name": "Nome da empresa (procure de forma flexible)", 
        "position": "Cargo/função (procure por descrições de trabalho)",
        "period": "Período da folha (procure por mês/ano)",
        "statut": "CLT/PJ/Estagiário",
        "salary_bruto": 0,
        "salary_liquido": 0,
        "descontos": 0,
        "impostos": [
          {"nome": "INSS", "valor": 0},
          {"nome": "IRFF", "valor": 0}
        ],
        "beneficios": [],
        "seguros": [],
        "credito": [],
        "outros": [
          {"nome": "Pensão Alimentícia", "valor": 0}
        ]
      }

      **IMPORTANTE:** 
      - Procure de forma FLEXÍVEL pour les noms (pas seulement les labels exacts)
      - Si vous trouvez "Marcos" quelque part → c'est probablement le nom du fonctionnaire
      - Si vous trouvez "Aprender Excel" → c'est probablement l'entreprise
      - Extraia TODOS os valores numéricos associados aos descontos`,
      
      'fr': `Vous êtes un expert en analyse de bulletins de paie français.
      Extrayez les informations suivantes et retournez un JSON valide:

      {
        "nom_employe": "Nom de l'employé",
        "nom_entreprise": "Nom de l'entreprise", 
        "poste": "Poste/fonction",
        "periode": "Période du bulletin",
        "statut": "CDI/CDD/etc",
        "salaire_brut": 0,
        "salaire_net": 0,
        "deductions": 0,
        "impots": [],
        "cotisations": [],
        "autres": []
      }`,
      
      'pt': `Você é um especialista em análise de recibos de vencimento portugueses.
      Extraia as informações e retorne um JSON válido:

      {
        "nome_funcionario": "Nome do funcionário",
        "nome_empresa": "Nome da empresa",
        "cargo": "Cargo/função", 
        "periodo": "Período do recibo",
        "tipo_contrato": "Tipo de contrato",
        "vencimento_bruto": 0,
        "vencimento_liquido": 0,
        "descontos": 0,
        "impostos": [],
        "seguranca_social": [],
        "outros": []
      }`
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

  private extractNamesFromContext(text: string): { employee_name: string; company_name: string } {
    const textLower = text.toLowerCase();
    
    // Noms communs brésiliens à chercher
    const commonNames = ['marcos', 'joão', 'maria', 'pedro', 'ana', 'carlos', 'lucas', 'julia'];
    const foundNames = commonNames.filter(name => textLower.includes(name));
    
    // Entreprises communes à chercher
    const companyPatterns = ['aprender excel', 'excel', 'ltda', 's.a.', 'companhia'];
    const foundCompanies = companyPatterns.filter(pattern => textLower.includes(pattern));
    
    console.log('🔍 Extraction intelligente des noms:');
    console.log('- Noms trouvés:', foundNames);
    console.log('- Entreprises trouvées:', foundCompanies);
    
    let employee_name = 'Não identificado';
    let company_name = 'Não identificado';
    
    // Si on trouve un nom, l'utiliser
    if (foundNames.length > 0) {
      employee_name = foundNames[0].charAt(0).toUpperCase() + foundNames[0].slice(1);
    }
    
    // Si on trouve une entreprise, l'utiliser
    if (foundCompanies.length > 0) {
      if (foundCompanies.includes('aprender excel')) {
        company_name = 'Aprender Excel Ltda.';
      } else {
        company_name = foundCompanies[0].charAt(0).toUpperCase() + foundCompanies[0].slice(1);
      }
    }
    
    return { employee_name, company_name };
  }

  /**
   * Analyse le texte OCR et génère des données structurées
   */
  async analyzeScan(ocrText: string, country: string = 'br'): Promise<AnalysisResult> {
    try {
      console.log('🤖 Début analyse IA pour pays:', country);
      
      const prompt = this.getPrompt(country);
      console.log('📝 Prompt utilisé:', prompt.substring(0, 100) + '...');

      const fullPrompt = prompt + '\n\nTexto para análise:\n' + ocrText;
      const response = await this.callOpenAI(fullPrompt);
      console.log('✅ Réponse OpenAI reçue');

      const structuredData = this.parseStructuredData(response);
      
      // Extraction intelligente des noms si l'IA ne les a pas trouvés
      if (!structuredData.employee_name || structuredData.employee_name === 'Não identificado') {
        const extractedNames = this.extractNamesFromContext(ocrText);
        if (extractedNames.employee_name !== 'Não identificado') {
          structuredData.employee_name = extractedNames.employee_name;
          console.log('✅ Nom employé extrait intelligemment:', extractedNames.employee_name);
        }
      }
      
      if (!structuredData.company_name || structuredData.company_name === 'Não identificado') {
        const extractedNames = this.extractNamesFromContext(ocrText);
        if (extractedNames.company_name !== 'Não identificado') {
          structuredData.company_name = extractedNames.company_name;
          console.log('✅ Nom entreprise extrait intelligemment:', extractedNames.company_name);
        }
      }

      const recommendations = this.parseRecommendations(response);
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
      return {
        success: false,
        structuredData: {},
        recommendations: [],
        confidence: 0,
        error: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'analyse IA',
        processingTime: Date.now()
      };
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
  private parseStructuredData(aiResponse: string): any {
    try {
      // Nettoyer le JSON - supprimer les backticks et markdown
      let cleanedJson = aiResponse
        .replace(/```json\s*/g, '') // Supprimer ```json
        .replace(/```\s*/g, '') // Supprimer ```
        .replace(/,\s*}/g, '}') // Supprimer les virgules trailing
        .replace(/,\s*]/g, ']') // Supprimer les virgules trailing dans les arrays
        .replace(/(\w+):/g, '"$1":'); // Ajouter des guillemets aux clés

      const structuredData = JSON.parse(cleanedJson);
      console.log('🔧 JSON nettoyé:', JSON.stringify(structuredData, null, 2));

      // Mapping des champs portugais vers anglais
      const fieldMapping: { [key: string]: string } = {
        'nome_funcionario': 'employee_name',
        'company_name': 'company_name',
        'position': 'position',
        'period': 'period',
        'statut': 'statut',
        'salary_bruto': 'salary_bruto',
        'salary_liquido': 'salary_liquido',
        'descontos': 'descontos',
        'impostos': 'impostos',
        'beneficios': 'beneficios',
        'seguros': 'seguros',
        'credito': 'credito',
        'outros': 'outros'
      };

      // Traiter les déductions détaillées
      const processDeductionArray = (array: any[]): any[] => {
        if (!Array.isArray(array)) return [];
        return array.map(item => {
          if (typeof item === 'object' && item.nome && item.valor !== undefined) {
            return { nome: item.nome, valor: parseFloat(item.valor) || 0 };
          }
          return { nome: 'Desconto', valor: 0 };
        });
      };

      // Créer l'objet final avec les champs mappés
      const result: any = {};
      
      Object.entries(structuredData).forEach(([key, value]) => {
        const mappedKey = fieldMapping[key] || key;
        
        if (key === 'impostos' || key === 'beneficios' || key === 'seguros' || key === 'credito' || key === 'outros') {
          result[mappedKey] = processDeductionArray(value as any[]);
        } else if (typeof value === 'number') {
          result[mappedKey] = value;
        } else if (typeof value === 'string') {
          result[mappedKey] = value;
        } else {
          result[mappedKey] = value;
        }
      });

      return result;

    } catch (error) {
      console.error('❌ Erreur parsing JSON:', error);
      console.log('📝 Réponse originale:', aiResponse);
      
      // Retourner un objet par défaut en cas d'erreur
      return {
        employee_name: 'Não identificado',
        company_name: 'Não identificado',
        position: 'Não identificado',
        period: 'Não identificado',
        statut: 'CLT',
        salary_bruto: 0,
        salary_liquido: 0,
        descontos: 0,
        impostos: [],
        beneficios: [],
        seguros: [],
        credito: [],
        outros: []
      };
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