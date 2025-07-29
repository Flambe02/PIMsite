#!/usr/bin/env tsx

/**
 * Script pour insérer des articles de blog de démonstration dans Supabase
 * Utilise l'API Supabase directement pour éviter les problèmes de dépendances
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.log('Vérifiez que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont définies');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Articles de démonstration pour le blog
const sampleArticles = [
  {
    title: 'Entenda seu holerite: Guia completo para funcionários CLT',
    slug: 'entenda-seu-holerite-guia-completo-funcionarios-clt',
    content: `# Entenda seu holerite: Guia completo para funcionários CLT

Receber o holerite parece simples, mas muitos trabalhadores têm dúvidas sobre seus detalhes. Neste artigo, explicamos os principais elementos que compõem sua folha de pagamento e como interpretá-los corretamente.

## O que é o holerite?

O holerite (ou contracheque) é o documento que detalha todos os valores recebidos e descontados do seu salário no mês. É um direito do trabalhador receber este documento mensalmente.

## Principais seções do holerite

### 1. Cabeçalho
- **Nome do funcionário**: Seu nome completo
- **Cargo**: Sua função na empresa
- **Período**: Mês/ano de referência
- **Empresa**: Nome da empresa contratante

### 2. Proventos (Vencimentos)
São os valores que você recebe:

- **Salário base**: Valor do seu salário contratado
- **Adicionais**: Horas extras, comissões, bonificações
- **Benefícios**: Vale refeição, vale transporte, plano de saúde

### 3. Descontos
Valores descontados do seu salário:

- **INSS**: Previdência Social (7,5% a 14%)
- **IRRF**: Imposto de Renda Retido na Fonte
- **Outros**: Plano de saúde, vale refeição, etc.

### 4. Totais
- **Base de cálculo**: Valor usado para calcular impostos
- **Líquido**: Valor que você recebe efetivamente

## Como calcular seu salário líquido

\`\`\`
Salário Líquido = Proventos - Descontos
\`\`\`

## Dicas importantes

1. **Guarde sempre**: Mantenha todos os seus holerites organizados
2. **Verifique os valores**: Confirme se os descontos estão corretos
3. **Consulte dúvidas**: Em caso de divergências, procure o RH
4. **Use ferramentas**: Aproveite o PIM para analisar seu holerite automaticamente

## Conclusão

Entender seu holerite é fundamental para ter controle sobre suas finanças. Com o PIM, você pode analisar automaticamente sua folha de pagamento e receber recomendações personalizadas para otimizar seus ganhos.

**Quer analisar seu holerite agora?** [Faça o upload da sua folha de pagamento](/br/scan-new-pim) e receba insights personalizados!`,
    excerpt: 'Receber o holerite parece simples, mas muitos trabalhadores têm dúvidas sobre seus detalhes. Neste artigo, explicamos os principais elementos que compõem sua folha de pagamento e como interpretá-los corretamente.',
    country: 'br'
  },
  {
    title: 'Vale refeição: Tudo que você precisa saber sobre este benefício',
    slug: 'vale-refeicao-tudo-que-voce-precisa-saber-beneficio',
    content: `# Vale refeição: Tudo que você precisa saber sobre este benefício

O vale refeição é um dos benefícios mais valorizados pelos trabalhadores brasileiros. Mas você sabe como ele funciona e quais são seus direitos? Vamos esclarecer todas as dúvidas.

## O que é o vale refeição?

O vale refeição é um benefício oferecido pelas empresas para ajudar os funcionários com as despesas de alimentação durante o trabalho. Pode ser fornecido em dinheiro ou através de cartões específicos.

## Tipos de vale refeição

### 1. Vale Refeição (VR)
- **Objetivo**: Cobrir o custo da refeição principal
- **Valor médio**: R$ 20 a R$ 30 por dia
- **Isenção de impostos**: Até R$ 26,55 por dia (2024)

### 2. Vale Alimentação (VA)
- **Objetivo**: Compras em supermercados e estabelecimentos
- **Valor médio**: R$ 15 a R$ 25 por dia
- **Isenção de impostos**: Até R$ 26,55 por dia (2024)

## Como funciona o desconto?

### Para o funcionário
- **VR**: Desconto de até 20% do valor
- **VA**: Desconto de até 20% do valor
- **Exemplo**: VR de R$ 30 = desconto de R$ 6

### Para a empresa
- **Deduções fiscais**: Redução do imposto de renda
- **Benefício social**: Melhora a qualidade de vida do funcionário

## Valor facial vs. valor recebido

### Valor facial
- **Definição**: Preço real da refeição no mercado
- **Média nacional**: R$ 51,61 por refeição (2024)
- **Variação regional**: R$ 45 a R$ 55 dependendo da região

### Valor recebido
- **Definição**: Valor que você recebe do vale
- **Cálculo**: Valor facial - desconto do funcionário

## Como otimizar seu vale refeição

1. **Compare valores**: Verifique se está recebendo um valor adequado
2. **Analise a rede**: Confirme se o cartão é aceito em bons restaurantes
3. **Negocie**: Solicite reajustes baseados no custo de vida
4. **Use ferramentas**: O PIM analisa automaticamente se seu vale está adequado

## Direitos e obrigações

### Direitos do funcionário
- Receber o benefício mensalmente
- Escolher onde usar (rede credenciada)
- Solicitar reajustes baseados na inflação

### Obrigações
- Usar apenas para alimentação
- Não transferir para terceiros
- Respeitar as regras da empresa

## Conclusão

O vale refeição é um benefício importante que pode representar uma economia significativa no seu orçamento. É fundamental entender como funciona e garantir que está recebendo um valor adequado ao mercado.

**Quer analisar se seu vale refeição está adequado?** [Faça o upload do seu holerite](/br/scan-new-pim) e receba uma análise detalhada!`,
    excerpt: 'O vale refeição é um dos benefícios mais valorizados pelos trabalhadores brasileiros. Mas você sabe como ele funciona e quais são seus direitos? Vamos esclarecer todas as dúvidas.',
    country: 'br'
  },
  {
    title: 'Impostos na folha de pagamento: INSS e IRRF explicados',
    slug: 'impostos-folha-pagamento-inss-irrf-explicados',
    content: `# Impostos na folha de pagamento: INSS e IRRF explicados

Os impostos descontados na folha de pagamento são uma das maiores dúvidas dos trabalhadores. Vamos explicar como funcionam o INSS e o IRRF, os principais impostos que afetam seu salário.

## O que é o INSS?

O INSS (Instituto Nacional do Seguro Social) é responsável pela Previdência Social brasileira. É um desconto obrigatório que garante benefícios como aposentadoria, auxílio-doença e outros.

## Como funciona o INSS?

### Tabela de contribuição (2024)
- **Até R$ 1.412,00**: 7,5%
- **De R$ 1.412,01 a R$ 2.666,68**: 9%
- **De R$ 2.666,69 a R$ 4.000,03**: 12%
- **De R$ 4.000,04 a R$ 7.786,02**: 14%

### Exemplo prático
Se você ganha R$ 3.000,00:
- **Primeira faixa**: R$ 1.412,00 × 7,5% = R$ 105,90
- **Segunda faixa**: R$ 1.254,68 × 9% = R$ 112,92
- **Terceira faixa**: R$ 333,32 × 12% = R$ 40,00
- **Total INSS**: R$ 258,82

## O que é o IRRF?

O IRRF (Imposto de Renda Retido na Fonte) é o desconto do Imposto de Renda que é feito diretamente na folha de pagamento.

## Como funciona o IRRF?

### Tabela progressiva (2024)
- **Até R$ 2.259,20**: Isento
- **De R$ 2.259,21 a R$ 2.826,65**: 7,5%
- **De R$ 2.826,66 a R$ 3.751,05**: 15%
- **De R$ 3.751,06 a R$ 4.664,68**: 22,5%
- **Acima de R$ 4.664,68**: 27,5%

### Deduções permitidas
- Dependentes: R$ 189,59 por dependente
- Previdência privada: até 12% da renda bruta
- Despesas médicas: sem limite

## Diferenças importantes

### INSS
- **Base de cálculo**: Salário bruto
- **Limite**: Teto do INSS (R$ 7.786,02)
- **Benefícios**: Aposentadoria, auxílio-doença, etc.

### IRRF
- **Base de cálculo**: Salário bruto - INSS - deduções
- **Limite**: Sem limite
- **Benefícios**: Redução do imposto anual

## Como otimizar seus impostos

### 1. Plano de Previdência Privada
- Dedução de até 12% da renda bruta
- Reduz a base de cálculo do IRRF

### 2. Dependentes
- Dedução de R$ 189,59 por dependente
- Inclui filhos, cônjuge, pais

### 3. Despesas médicas
- Dedução integral
- Inclui consultas, exames, medicamentos

## Erros comuns

### 1. Confundir base de cálculo
- INSS: sobre o salário bruto
- IRRF: sobre o salário bruto - INSS

### 2. Não considerar deduções
- Muitos não aproveitam as deduções disponíveis
- Perdem dinheiro desnecessariamente

### 3. Ignorar o teto do INSS
- Acima de R$ 7.786,02, o INSS não aumenta
- Mas o IRRF continua progressivo

## Conclusão

Entender como funcionam o INSS e o IRRF é fundamental para otimizar sua situação fiscal. Com o PIM, você pode analisar automaticamente sua folha de pagamento e identificar oportunidades de economia.

**Quer analisar seus impostos?** [Faça o upload do seu holerite](/br/scan-new-pim) e receba uma análise detalhada!`,
    excerpt: 'Os impostos descontados na folha de pagamento são uma das maiores dúvidas dos trabalhadores. Vamos explicar como funcionam o INSS e o IRRF, os principais impostos que afetam seu salário.',
    country: 'br'
  },
  {
    title: 'Benefícios trabalhistas: Como maximizar seus ganhos',
    slug: 'beneficios-trabalhistas-como-maximizar-ganhos',
    content: `# Benefícios trabalhistas: Como maximizar seus ganhos

Os benefícios trabalhistas podem representar uma parte significativa da sua remuneração total. Vamos explorar os principais benefícios e como otimizá-los para maximizar seus ganhos.

## Principais benefícios trabalhistas

### 1. Vale Refeição/Alimentação
- **Objetivo**: Cobrir despesas de alimentação
- **Valor médio**: R$ 20-30 por dia
- **Vantagem fiscal**: Isenção de impostos até R$ 26,55/dia

### 2. Vale Transporte
- **Objetivo**: Cobrir despesas de transporte
- **Valor**: 6% do salário base
- **Vantagem**: Desconto de 6% do funcionário

### 3. Plano de Saúde
- **Objetivo**: Cobertura médica
- **Vantagem fiscal**: Dedução no IRRF
- **Cobertura**: Funcionário e dependentes

### 4. Plano Odontológico
- **Objetivo**: Cobertura odontológica
- **Vantagem**: Melhora a saúde bucal
- **Cobertura**: Funcionário e dependentes

### 5. Gympass/Plano de Academia
- **Objetivo**: Incentivar atividade física
- **Vantagem**: Melhora qualidade de vida
- **Custo**: Geralmente subsidiado pela empresa

## Como calcular o valor total dos benefícios

### Exemplo prático
**Salário base**: R$ 3.000,00
**Vale refeição**: R$ 25/dia × 22 dias = R$ 550,00
**Vale transporte**: R$ 180,00
**Plano de saúde**: R$ 300,00
**Gympass**: R$ 50,00

**Total benefícios**: R$ 1.080,00
**Remuneração total**: R$ 4.080,00

**Aumento real**: 36% sobre o salário base

## Estratégias para maximizar benefícios

### 1. Negociação na contratação
- **Pesquise o mercado**: Conheça os benefícios padrão da área
- **Priorize benefícios**: Escolha os mais importantes para você
- **Negocie pacotes**: Alguns benefícios são mais baratos em conjunto

### 2. Otimização fiscal
- **Vale refeição**: Máximo de R$ 26,55/dia (isento)
- **Plano de saúde**: Dedução no IRRF
- **Previdência privada**: Dedução de até 12%

### 3. Benefícios flexíveis
- **Cesta de benefícios**: Escolha os que mais fazem sentido
- **Flexibilidade**: Adapte conforme suas necessidades
- **Revisão anual**: Negocie ajustes baseados na inflação

## Benefícios por nível hierárquico

### Estagiário/Júnior
- Vale refeição
- Vale transporte
- Plano de saúde básico

### Pleno
- Todos os benefícios básicos
- Plano odontológico
- Gympass

### Sênior/Gestão
- Todos os benefícios
- Plano de saúde premium
- Carro/combustível
- Participação nos lucros

## Como negociar benefícios

### 1. Preparação
- **Pesquise o mercado**: Salários e benefícios da área
- **Calcule o valor**: Some todos os benefícios
- **Defina prioridades**: Quais são mais importantes para você

### 2. Negociação
- **Apresente dados**: Use pesquisas de mercado
- **Mostre valor**: Como você contribui para a empresa
- **Seja flexível**: Ofereça alternativas

### 3. Follow-up
- **Documente**: Registre tudo por escrito
- **Acompanhe**: Verifique se está sendo implementado
- **Reavalie**: Revise periodicamente

## Erros comuns

### 1. Focar apenas no salário
- Benefícios podem representar 30-50% da remuneração
- Considere o valor total

### 2. Não negociar benefícios
- Muitas empresas estão abertas à negociação
- Benefícios são mais flexíveis que salário

### 3. Ignorar benefícios fiscais
- Alguns benefícios têm vantagens fiscais
- Reduzem impostos indiretamente

## Conclusão

Os benefícios trabalhistas são uma parte fundamental da sua remuneração total. Entender como funcionam e como otimizá-los pode aumentar significativamente seus ganhos.

**Quer analisar seus benefícios?** [Faça o upload do seu holerite](/br/scan-new-pim) e receba uma análise detalhada!`,
    excerpt: 'Os benefícios trabalhistas podem representar uma parte significativa da sua remuneração total. Vamos explorar os principais benefícios e como otimizá-los para maximizar seus ganhos.',
    country: 'br'
  },
  {
    title: 'Planejamento de carreira: Como aumentar seu salário',
    slug: 'planejamento-carreira-como-aumentar-salario',
    content: `# Planejamento de carreira: Como aumentar seu salário

Aumentar o salário é um objetivo comum entre os profissionais. Mas como fazer isso de forma estratégica e sustentável? Vamos explorar as melhores práticas.

## Estratégias para aumentar o salário

### 1. Desenvolvimento de habilidades
- **Habilidades técnicas**: Mantenha-se atualizado
- **Soft skills**: Comunicação, liderança, negociação
- **Certificações**: Invista em certificações relevantes
- **Idiomas**: Inglês é fundamental em muitas áreas

### 2. Networking estratégico
- **Construa relacionamentos**: Com colegas, gestores, profissionais da área
- **Participe de eventos**: Conferências, meetups, workshops
- **Use LinkedIn**: Mantenha perfil atualizado e ativo
- **Mentoria**: Busque mentores experientes

### 3. Visibilidade e resultados
- **Documente conquistas**: Registre projetos e resultados
- **Comunique valor**: Mostre como você contribui para a empresa
- **Métricas**: Use números para demonstrar impacto
- **Feedback**: Solicite feedback regular

## Quando negociar aumento

### Sinais de que é hora de negociar
- **Desempenho excepcional**: Resultados acima do esperado
- **Responsabilidades aumentadas**: Novas funções ou projetos
- **Mercado aquecido**: Alta demanda na sua área
- **Tempo na empresa**: Geralmente após 1-2 anos
- **Promoção**: Mudança de cargo ou nível

### Preparação para a negociação
- **Pesquise o mercado**: Salários da sua posição e experiência
- **Documente conquistas**: Prepare exemplos específicos
- **Defina objetivos**: Salário desejado e benefícios
- **Planeje argumentos**: Por que você merece o aumento

## Técnicas de negociação

### 1. Abordagem colaborativa
- **Foque no valor**: Como você beneficia a empresa
- **Seja específico**: Use exemplos e números
- **Escute**: Entenda as preocupações da empresa
- **Ofereça alternativas**: Salário, benefícios, flexibilidade

### 2. Timing adequado
- **Ciclos de avaliação**: Aproveite momentos de feedback
- **Resultados positivos**: Após conquistas importantes
- **Mudanças na empresa**: Reorganizações, novos projetos
- **Mercado favorável**: Alta demanda na área

### 3. Comunicação efetiva
- **Seja confiante**: Mas não arrogante
- **Use dados**: Pesquisas de mercado, resultados
- **Foque no futuro**: Como você pode contribuir mais
- **Seja flexível**: Considere diferentes opções

## Alternativas ao aumento salarial

### 1. Benefícios
- **Plano de saúde premium**: Melhor cobertura
- **Vale refeição maior**: Aumento do valor diário
- **Flexibilidade**: Home office, horário flexível
- **Desenvolvimento**: Cursos, certificações

### 2. Participação nos lucros
- **PLR**: Participação nos lucros e resultados
- **Bônus**: Bônus por performance
- **Ações**: Participação acionária
- **Comissões**: Para vendas ou projetos

### 3. Crescimento profissional
- **Promoção**: Mudança de cargo
- **Novos projetos**: Responsabilidades mais desafiadoras
- **Mentoria**: Apoio para desenvolvimento
- **Visibilidade**: Participação em eventos, palestras

## Quando considerar mudança de empresa

### Sinais de alerta
- **Salário abaixo do mercado**: Mesmo com experiência
- **Sem perspectiva de crescimento**: Empresa não investe em desenvolvimento
- **Cultura tóxica**: Ambiente de trabalho negativo
- **Falta de reconhecimento**: Esforços não são valorizados
- **Estagnação**: Sem novos desafios ou aprendizados

### Preparação para mudança
- **Atualize currículo**: Destaque conquistas recentes
- **Mantenha rede ativa**: Networking constante
- **Desenvolva habilidades**: Invista em capacitação
- **Pesquise empresas**: Conheça cultura e benefícios

## Ferramentas para acompanhar o mercado

### 1. Pesquisas salariais
- **Glassdoor**: Salários e avaliações de empresas
- **LoveMondays**: Informações sobre empresas
- **LinkedIn**: Pesquisas de mercado
- **Sites especializados**: Área específica

### 2. Networking
- **Colegas**: Troque informações sobre salários
- **Profissionais da área**: Participe de grupos
- **Recrutadores**: Mantenha contato
- **Mentores**: Busque orientação

## Conclusão

Aumentar o salário requer planejamento, preparação e estratégia. Foque no desenvolvimento de habilidades, construa relacionamentos e demonstre valor para a empresa.

**Quer analisar sua situação atual?** [Faça o upload do seu holerite](/br/scan-new-pim) e receba insights sobre otimização salarial!`,
    excerpt: 'Aumentar o salário é um objetivo comum entre os profissionais. Mas como fazer isso de forma estratégica e sustentável? Vamos explorar as melhores práticas.',
    country: 'br'
  }
];

async function seedBlogArticles() {
  console.log('🌱 Début du seeding des articles de blog...');

  try {
    for (const article of sampleArticles) {
      console.log(`📝 Ajout de l'article: ${article.title}`);
      
      // Insérer directement dans Supabase
      const { data, error } = await supabase
        .from('blog_articles')
        .upsert({
          title: article.title,
          slug: article.slug,
          content: article.content,
          excerpt: article.excerpt,
          country: article.country,
          published_at: new Date().toISOString()
        }, {
          onConflict: 'slug'
        });

      if (error) {
        console.error(`❌ Erreur lors de l'ajout de l'article ${article.slug}:`, error);
      } else {
        console.log(`✅ Article ajouté avec succès: ${article.slug}`);
      }
    }

    console.log('🎉 Seeding des articles de blog terminé avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedBlogArticles();
}

export { seedBlogArticles }; 