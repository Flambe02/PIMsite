export const financialCheckupData = {
  fr: {
    hero: {
      title: "Financial Check-up 360°",
      subtitle: "Évaluez votre santé financière en 5 minutes",
      description: "Notre diagnostic complet analyse vos finances selon 5 axes clés pour identifier vos forces et vos axes d'amélioration.",
      cta: "Commencer le diagnostic",
      features: [
        "5 blocs thématiques",
        "Score personnalisé",
        "Recommandations actionnables",
        "Résultats instantanés"
      ]
    },
    blocks: {
      resilience: {
        title: "Sécurité & Résilience Financière",
        subtitle: "Votre capacité à faire face aux imprévus",
        description: "Évaluez votre protection contre les risques financiers et votre capacité à maintenir votre niveau de vie en cas de difficulté.",
        icon: "Shield",
        color: "blue",
        questions: [
          {
            id: "emergency_savings",
            question: "Combien de mois pouvez-vous tenir sans revenu grâce à votre épargne ?",
            type: "multiple_choice",
            options: [
              { value: "0", label: "Aucun mois", score: 0 },
              { value: "1-2", label: "1-2 mois", score: 10 },
              { value: "3-6", label: "3-6 mois", score: 20 },
              { value: "6-12", label: "6-12 mois", score: 15 },
              { value: "12+", label: "Plus de 12 mois", score: 10 }
            ],
            maxScore: 20
          },
          {
            id: "life_insurance",
            question: "Avez-vous une assurance prévoyance (vie, incapacité) ?",
            type: "multiple_choice",
            options: [
              { value: "none", label: "Aucune", score: 0 },
              { value: "basic", label: "Assurance de base", score: 10 },
              { value: "comprehensive", label: "Couverture complète", score: 20 },
              { value: "family", label: "Protection familiale", score: 15 }
            ],
            maxScore: 20
          },
          {
            id: "emergency_used",
            question: "Avez-vous dû puiser dans votre épargne pour un imprévu cette année ?",
            type: "multiple_choice",
            options: [
              { value: "yes_often", label: "Oui, plusieurs fois", score: 0 },
              { value: "yes_once", label: "Oui, une fois", score: 10 },
              { value: "no", label: "Non", score: 20 },
              { value: "increased", label: "J'ai augmenté mon épargne", score: 25 }
            ],
            maxScore: 25
          },
          {
            id: "job_security",
            question: "Quelle est votre perception de la sécurité de votre emploi ?",
            type: "multiple_choice",
            options: [
              { value: "very_secure", label: "Très sécurisé", score: 20 },
              { value: "secure", label: "Sécurisé", score: 15 },
              { value: "moderate", label: "Modérément sécurisé", score: 10 },
              { value: "insecure", label: "Peu sécurisé", score: 5 },
              { value: "very_insecure", label: "Très peu sécurisé", score: 0 }
            ],
            maxScore: 20
          }
        ]
      },
      income: {
        title: "Revenus, Paie & Avantages",
        subtitle: "Votre situation salariale et vos bénéfices",
        description: "Analysez la clarté de votre rémunération, vos avantages sociaux et votre satisfaction salariale.",
        icon: "TrendingUp",
        color: "green",
        questions: [
          {
            id: "payslip_clarity",
            question: "Comprenez-vous clairement votre fiche de paie ?",
            type: "multiple_choice",
            options: [
              { value: "very_clear", label: "Très claire", score: 20 },
              { value: "clear", label: "Claire", score: 15 },
              { value: "somewhat", label: "Assez claire", score: 10 },
              { value: "unclear", label: "Peu claire", score: 5 },
              { value: "very_unclear", label: "Très peu claire", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "benefits_satisfaction",
            question: "Êtes-vous satisfait de vos avantages sociaux (mutuelle, tickets resto, etc.) ?",
            type: "multiple_choice",
            options: [
              { value: "very_satisfied", label: "Très satisfait", score: 20 },
              { value: "satisfied", label: "Satisfait", score: 15 },
              { value: "neutral", label: "Neutre", score: 10 },
              { value: "dissatisfied", label: "Peu satisfait", score: 5 },
              { value: "very_dissatisfied", label: "Très peu satisfait", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "salary_satisfaction",
            question: "Êtes-vous satisfait de votre niveau de rémunération ?",
            type: "multiple_choice",
            options: [
              { value: "very_satisfied", label: "Très satisfait", score: 20 },
              { value: "satisfied", label: "Satisfait", score: 15 },
              { value: "neutral", label: "Neutre", score: 10 },
              { value: "dissatisfied", label: "Peu satisfait", score: 5 },
              { value: "very_dissatisfied", label: "Très peu satisfait", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "payslip_issues",
            question: "Avez-vous constaté des erreurs ou incohérences sur votre fiche de paie cette année ?",
            type: "multiple_choice",
            options: [
              { value: "never", label: "Jamais", score: 20 },
              { value: "rarely", label: "Rarement", score: 15 },
              { value: "sometimes", label: "Parfois", score: 10 },
              { value: "often", label: "Souvent", score: 5 },
              { value: "very_often", label: "Très souvent", score: 0 }
            ],
            maxScore: 20
          }
        ]
      },
      wellbeing: {
        title: "Santé & Bien-être",
        subtitle: "Votre équilibre vie pro/perso et santé",
        description: "Évaluez votre couverture santé, votre accès aux programmes de bien-être et votre niveau de stress financier.",
        icon: "Heart",
        color: "pink",
        questions: [
          {
            id: "health_coverage",
            question: "Avez-vous une couverture santé personnelle ou familiale ?",
            type: "multiple_choice",
            options: [
              { value: "comprehensive", label: "Couverture complète", score: 20 },
              { value: "basic", label: "Couverture de base", score: 15 },
              { value: "partial", label: "Couverture partielle", score: 10 },
              { value: "none", label: "Aucune couverture", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "wellness_programs",
            question: "Avez-vous accès à des programmes de bien-être dans votre entreprise ?",
            type: "multiple_choice",
            options: [
              { value: "many", label: "Beaucoup d'options", score: 20 },
              { value: "some", label: "Quelques options", score: 15 },
              { value: "few", label: "Peu d'options", score: 10 },
              { value: "none", label: "Aucune option", score: 5 }
            ],
            maxScore: 20
          },
          {
            id: "financial_stress",
            question: "À quel point le stress financier impacte-t-il votre bien-être ?",
            type: "multiple_choice",
            options: [
              { value: "none", label: "Aucun impact", score: 20 },
              { value: "low", label: "Impact faible", score: 15 },
              { value: "moderate", label: "Impact modéré", score: 10 },
              { value: "high", label: "Impact élevé", score: 5 },
              { value: "very_high", label: "Impact très élevé", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "work_life_balance",
            question: "Êtes-vous satisfait de votre équilibre vie professionnelle/personnelle ?",
            type: "multiple_choice",
            options: [
              { value: "very_satisfied", label: "Très satisfait", score: 20 },
              { value: "satisfied", label: "Satisfait", score: 15 },
              { value: "neutral", label: "Neutre", score: 10 },
              { value: "dissatisfied", label: "Peu satisfait", score: 5 },
              { value: "very_dissatisfied", label: "Très peu satisfait", score: 0 }
            ],
            maxScore: 20
          }
        ]
      },
      future: {
        title: "Préparation du Futur & Objectifs",
        subtitle: "Votre planification à long terme",
        description: "Analysez votre préparation à la retraite, vos projets futurs et votre épargne pour les objectifs.",
        icon: "Target",
        color: "purple",
        questions: [
          {
            id: "retirement_planning",
            question: "Avez-vous un plan de retraite (publique et/ou privée) ?",
            type: "multiple_choice",
            options: [
              { value: "both", label: "Publique et privée", score: 20 },
              { value: "public", label: "Publique uniquement", score: 15 },
              { value: "private", label: "Privée uniquement", score: 15 },
              { value: "planning", label: "En cours de planification", score: 10 },
              { value: "none", label: "Aucun plan", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "long_term_goals",
            question: "Avez-vous des projets financiers à moyen/long terme (achat, formation, etc.) ?",
            type: "multiple_choice",
            options: [
              { value: "defined", label: "Objectifs bien définis", score: 20 },
              { value: "some", label: "Quelques objectifs", score: 15 },
              { value: "vague", label: "Objectifs vagues", score: 10 },
              { value: "none", label: "Aucun objectif", score: 5 }
            ],
            maxScore: 20
          },
          {
            id: "savings_rate",
            question: "Quel pourcentage de vos revenus épargnez-vous mensuellement ?",
            type: "multiple_choice",
            options: [
              { value: "20+", label: "Plus de 20%", score: 20 },
              { value: "15-20", label: "15-20%", score: 15 },
              { value: "10-15", label: "10-15%", score: 10 },
              { value: "5-10", label: "5-10%", score: 5 },
              { value: "0-5", label: "Moins de 5%", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "investment_knowledge",
            question: "Comment évaluez-vous vos connaissances en investissement ?",
            type: "multiple_choice",
            options: [
              { value: "expert", label: "Expert", score: 20 },
              { value: "advanced", label: "Avancé", score: 15 },
              { value: "intermediate", label: "Intermédiaire", score: 10 },
              { value: "beginner", label: "Débutant", score: 5 },
              { value: "none", label: "Aucune connaissance", score: 0 }
            ],
            maxScore: 20
          }
        ]
      },
      budget: {
        title: "Dettes & Gestion du Budget",
        subtitle: "Votre maîtrise budgétaire",
        description: "Évaluez votre gestion des dettes, votre suivi budgétaire et votre capacité à contrôler vos dépenses.",
        icon: "CreditCard",
        color: "orange",
        questions: [
          {
            id: "debt_level",
            question: "Avez-vous des crédits ou dettes en cours ?",
            type: "multiple_choice",
            options: [
              { value: "none", label: "Aucune dette", score: 20 },
              { value: "mortgage", label: "Uniquement crédit immobilier", score: 15 },
              { value: "low", label: "Dettes faibles", score: 10 },
              { value: "moderate", label: "Dettes modérées", score: 5 },
              { value: "high", label: "Dettes importantes", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "debt_ratio",
            question: "Quel pourcentage de vos revenus est consacré au remboursement de dettes ?",
            type: "multiple_choice",
            options: [
              { value: "0-10", label: "0-10%", score: 20 },
              { value: "10-20", label: "10-20%", score: 15 },
              { value: "20-30", label: "20-30%", score: 10 },
              { value: "30-40", label: "30-40%", score: 5 },
              { value: "40+", label: "Plus de 40%", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "budget_tracking",
            question: "Suivez-vous régulièrement votre budget ?",
            type: "multiple_choice",
            options: [
              { value: "daily", label: "Quotidiennement", score: 20 },
              { value: "weekly", label: "Hebdomadairement", score: 15 },
              { value: "monthly", label: "Mensuellement", score: 10 },
              { value: "rarely", label: "Rarement", score: 5 },
              { value: "never", label: "Jamais", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "spending_control",
            question: "Contrôlez-vous facilement vos dépenses ?",
            type: "multiple_choice",
            options: [
              { value: "excellent", label: "Excellente maîtrise", score: 20 },
              { value: "good", label: "Bonne maîtrise", score: 15 },
              { value: "moderate", label: "Maîtrise modérée", score: 10 },
              { value: "difficult", label: "Difficile", score: 5 },
              { value: "very_difficult", label: "Très difficile", score: 0 }
            ],
            maxScore: 20
          }
        ]
      }
    },
    summary: {
      title: "Votre Diagnostic Financier",
      subtitle: "Voici votre score global et vos axes d'amélioration",
      restart: "Refaire le diagnostic",
      download: "Télécharger le rapport",
      share: "Partager les résultats"
    }
  },
  pt: {
    hero: {
      title: "Financial Check-up 360°",
      subtitle: "Avalie sua saúde financeira em 5 minutos",
      description: "Nosso diagnóstico completo analisa suas finanças em 5 eixos principais para identificar seus pontos fortes e áreas de melhoria.",
      cta: "Começar o diagnóstico",
      features: [
        "5 blocos temáticos",
        "Score personalizado",
        "Recomendações acionáveis",
        "Resultados instantâneos"
      ]
    },
    blocks: {
      resilience: {
        title: "Segurança & Resiliência Financeira",
        subtitle: "Sua capacidade de enfrentar imprevistos",
        description: "Avalie sua proteção contra riscos financeiros e sua capacidade de manter seu padrão de vida em caso de dificuldade.",
        icon: "Shield",
        color: "blue",
        questions: [
          {
            id: "emergency_savings",
            question: "Quantos meses você consegue se manter sem renda usando sua poupança?",
            type: "multiple_choice",
            options: [
              { value: "0", label: "Nenhum mês", score: 0 },
              { value: "1-2", label: "1-2 meses", score: 10 },
              { value: "3-6", label: "3-6 meses", score: 20 },
              { value: "6-12", label: "6-12 meses", score: 15 },
              { value: "12+", label: "Mais de 12 meses", score: 10 }
            ],
            maxScore: 20
          },
          {
            id: "life_insurance",
            question: "Você tem seguro de vida/incapacidade?",
            type: "multiple_choice",
            options: [
              { value: "none", label: "Nenhum", score: 0 },
              { value: "basic", label: "Seguro básico", score: 10 },
              { value: "comprehensive", label: "Cobertura completa", score: 20 },
              { value: "family", label: "Proteção familiar", score: 15 }
            ],
            maxScore: 20
          },
          {
            id: "emergency_used",
            question: "Já precisou usar sua poupança para emergência este ano?",
            type: "multiple_choice",
            options: [
              { value: "yes_often", label: "Sim, várias vezes", score: 0 },
              { value: "yes_once", label: "Sim, uma vez", score: 10 },
              { value: "no", label: "Não", score: 20 },
              { value: "increased", label: "Aumentei minha poupança", score: 25 }
            ],
            maxScore: 25
          },
          {
            id: "job_security",
            question: "Qual sua percepção sobre a segurança do seu emprego?",
            type: "multiple_choice",
            options: [
              { value: "very_secure", label: "Muito seguro", score: 20 },
              { value: "secure", label: "Seguro", score: 15 },
              { value: "moderate", label: "Moderadamente seguro", score: 10 },
              { value: "insecure", label: "Pouco seguro", score: 5 },
              { value: "very_insecure", label: "Muito pouco seguro", score: 0 }
            ],
            maxScore: 20
          }
        ]
      },
      income: {
        title: "Renda, Salário & Benefícios",
        subtitle: "Sua situação salarial e benefícios",
        description: "Analise a clareza da sua remuneração, seus benefícios sociais e sua satisfação salarial.",
        icon: "TrendingUp",
        color: "green",
        questions: [
          {
            id: "payslip_clarity",
            question: "Você entende claramente seu holerite?",
            type: "multiple_choice",
            options: [
              { value: "very_clear", label: "Muito claro", score: 20 },
              { value: "clear", label: "Claro", score: 15 },
              { value: "somewhat", label: "Bastante claro", score: 10 },
              { value: "unclear", label: "Pouco claro", score: 5 },
              { value: "very_unclear", label: "Muito pouco claro", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "benefits_satisfaction",
            question: "Você está satisfeito com seus benefícios sociais (plano de saúde, vale refeição, etc.)?",
            type: "multiple_choice",
            options: [
              { value: "very_satisfied", label: "Muito satisfeito", score: 20 },
              { value: "satisfied", label: "Satisfeito", score: 15 },
              { value: "neutral", label: "Neutro", score: 10 },
              { value: "dissatisfied", label: "Pouco satisfeito", score: 5 },
              { value: "very_dissatisfied", label: "Muito pouco satisfeito", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "salary_satisfaction",
            question: "Você está satisfeito com seu nível de remuneração?",
            type: "multiple_choice",
            options: [
              { value: "very_satisfied", label: "Muito satisfeito", score: 20 },
              { value: "satisfied", label: "Satisfeito", score: 15 },
              { value: "neutral", label: "Neutro", score: 10 },
              { value: "dissatisfied", label: "Pouco satisfeito", score: 5 },
              { value: "very_dissatisfied", label: "Muito pouco satisfeito", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "payslip_issues",
            question: "Você notou erros ou inconsistências no seu holerite este ano?",
            type: "multiple_choice",
            options: [
              { value: "never", label: "Nunca", score: 20 },
              { value: "rarely", label: "Raramente", score: 15 },
              { value: "sometimes", label: "Às vezes", score: 10 },
              { value: "often", label: "Frequentemente", score: 5 },
              { value: "very_often", label: "Muito frequentemente", score: 0 }
            ],
            maxScore: 20
          }
        ]
      },
      wellbeing: {
        title: "Saúde & Bem-estar",
        subtitle: "Seu equilíbrio vida pro/pessoal e saúde",
        description: "Avalie sua cobertura de saúde, acesso a programas de bem-estar e nível de estresse financeiro.",
        icon: "Heart",
        color: "pink",
        questions: [
          {
            id: "health_coverage",
            question: "Você tem cobertura de saúde pessoal ou familiar?",
            type: "multiple_choice",
            options: [
              { value: "comprehensive", label: "Cobertura completa", score: 20 },
              { value: "basic", label: "Cobertura básica", score: 15 },
              { value: "partial", label: "Cobertura parcial", score: 10 },
              { value: "none", label: "Nenhuma cobertura", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "wellness_programs",
            question: "Você tem acesso a programas de bem-estar na sua empresa?",
            type: "multiple_choice",
            options: [
              { value: "many", label: "Muitas opções", score: 20 },
              { value: "some", label: "Algumas opções", score: 15 },
              { value: "few", label: "Poucas opções", score: 10 },
              { value: "none", label: "Nenhuma opção", score: 5 }
            ],
            maxScore: 20
          },
          {
            id: "financial_stress",
            question: "Até que ponto o estresse financeiro impacta seu bem-estar?",
            type: "multiple_choice",
            options: [
              { value: "none", label: "Nenhum impacto", score: 20 },
              { value: "low", label: "Impacto baixo", score: 15 },
              { value: "moderate", label: "Impacto moderado", score: 10 },
              { value: "high", label: "Impacto alto", score: 5 },
              { value: "very_high", label: "Impacto muito alto", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "work_life_balance",
            question: "Você está satisfeito com seu equilíbrio vida profissional/pessoal?",
            type: "multiple_choice",
            options: [
              { value: "very_satisfied", label: "Muito satisfeito", score: 20 },
              { value: "satisfied", label: "Satisfeito", score: 15 },
              { value: "neutral", label: "Neutro", score: 10 },
              { value: "dissatisfied", label: "Pouco satisfeito", score: 5 },
              { value: "very_dissatisfied", label: "Muito pouco satisfeito", score: 0 }
            ],
            maxScore: 20
          }
        ]
      },
      future: {
        title: "Preparação do Futuro & Objetivos",
        subtitle: "Sua planejamento de longo prazo",
        description: "Analise sua preparação para aposentadoria, projetos futuros e poupança para objetivos.",
        icon: "Target",
        color: "purple",
        questions: [
          {
            id: "retirement_planning",
            question: "Você tem um plano de aposentadoria (público e/ou privado)?",
            type: "multiple_choice",
            options: [
              { value: "both", label: "Público e privado", score: 20 },
              { value: "public", label: "Apenas público", score: 15 },
              { value: "private", label: "Apenas privado", score: 15 },
              { value: "planning", label: "Em planejamento", score: 10 },
              { value: "none", label: "Nenhum plano", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "long_term_goals",
            question: "Você tem projetos financeiros de médio/longo prazo (compra, formação, etc.)?",
            type: "multiple_choice",
            options: [
              { value: "defined", label: "Objetivos bem definidos", score: 20 },
              { value: "some", label: "Alguns objetivos", score: 15 },
              { value: "vague", label: "Objetivos vagos", score: 10 },
              { value: "none", label: "Nenhum objetivo", score: 5 }
            ],
            maxScore: 20
          },
          {
            id: "savings_rate",
            question: "Qual percentual da sua renda você poupa mensalmente?",
            type: "multiple_choice",
            options: [
              { value: "20+", label: "Mais de 20%", score: 20 },
              { value: "15-20", label: "15-20%", score: 15 },
              { value: "10-15", label: "10-15%", score: 10 },
              { value: "5-10", label: "5-10%", score: 5 },
              { value: "0-5", label: "Menos de 5%", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "investment_knowledge",
            question: "Como você avalia seus conhecimentos em investimentos?",
            type: "multiple_choice",
            options: [
              { value: "expert", label: "Especialista", score: 20 },
              { value: "advanced", label: "Avançado", score: 15 },
              { value: "intermediate", label: "Intermediário", score: 10 },
              { value: "beginner", label: "Iniciante", score: 5 },
              { value: "none", label: "Nenhum conhecimento", score: 0 }
            ],
            maxScore: 20
          }
        ]
      },
      budget: {
        title: "Dívidas & Gestão do Orçamento",
        subtitle: "Sua domínio orçamentário",
        description: "Avalie sua gestão de dívidas, acompanhamento orçamentário e capacidade de controlar despesas.",
        icon: "CreditCard",
        color: "orange",
        questions: [
          {
            id: "debt_level",
            question: "Você tem créditos ou dívidas em andamento?",
            type: "multiple_choice",
            options: [
              { value: "none", label: "Nenhuma dívida", score: 20 },
              { value: "mortgage", label: "Apenas financiamento imobiliário", score: 15 },
              { value: "low", label: "Dívidas baixas", score: 10 },
              { value: "moderate", label: "Dívidas moderadas", score: 5 },
              { value: "high", label: "Dívidas altas", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "debt_ratio",
            question: "Qual percentual da sua renda é destinado ao pagamento de dívidas?",
            type: "multiple_choice",
            options: [
              { value: "0-10", label: "0-10%", score: 20 },
              { value: "10-20", label: "10-20%", score: 15 },
              { value: "20-30", label: "20-30%", score: 10 },
              { value: "30-40", label: "30-40%", score: 5 },
              { value: "40+", label: "Mais de 40%", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "budget_tracking",
            question: "Você acompanha regularmente seu orçamento?",
            type: "multiple_choice",
            options: [
              { value: "daily", label: "Diariamente", score: 20 },
              { value: "weekly", label: "Semanalmente", score: 15 },
              { value: "monthly", label: "Mensalmente", score: 10 },
              { value: "rarely", label: "Raramente", score: 5 },
              { value: "never", label: "Nunca", score: 0 }
            ],
            maxScore: 20
          },
          {
            id: "spending_control",
            question: "Você controla facilmente seus gastos?",
            type: "multiple_choice",
            options: [
              { value: "excellent", label: "Excelente domínio", score: 20 },
              { value: "good", label: "Bom domínio", score: 15 },
              { value: "moderate", label: "Domínio moderado", score: 10 },
              { value: "difficult", label: "Difícil", score: 5 },
              { value: "very_difficult", label: "Muito difícil", score: 0 }
            ],
            maxScore: 20
          }
        ]
      }
    },
    summary: {
      title: "Seu Diagnóstico Financeiro",
      subtitle: "Aqui está seu score global e áreas de melhoria",
      restart: "Refazer o diagnóstico",
      download: "Baixar relatório",
      share: "Compartilhar resultados"
    }
  }
}; 