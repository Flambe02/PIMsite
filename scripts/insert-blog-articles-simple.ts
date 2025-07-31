#!/usr/bin/env tsx

/**
 * Script simple pour insérer des articles de blog dans Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('🔍 Variables d\'environnement:');
console.log('URL:', supabaseUrl ? '✅ Définie' : '❌ Manquante');
console.log('KEY:', supabaseKey ? '✅ Définie' : '❌ Manquante');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
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
    country: 'br',
    tags: ['holerite', 'CLT', 'folha de pagamento', 'salário']
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
    country: 'br',
    tags: ['vale refeição', 'benefícios', 'alimentação', 'VR', 'VA']
  },
  {
    title: 'Impostos na folha de pagamento: INSS e IRRF explicados',
    slug: 'impostos-folha-pagamento-inss-irrf-explicados',
    content: `# Impostos na folha de pagamento: INSS e IRRF explicados

Os impostos descontados na folha de pagamento são uma das maiores dúvidas dos trabalhadores. Vamos explicar como funcionam o INSS e o IRRF, os principais impostos que afetam seu salário.

## INSS (Instituto Nacional do Seguro Social)

### O que é o INSS?
O INSS é a contribuição para a Previdência Social, que garante benefícios como aposentadoria, auxílio-doença e outros direitos sociais.

### Como é calculado?
- **Alíquotas progressivas**: 7,5% a 14% dependendo do salário
- **Base de cálculo**: Salário de contribuição
- **Teto**: R$ 7.507,49 (2024)

### Tabela de alíquotas (2024)

| Faixa de salário | Alíquota |
|------------------|----------|
| Até R$ 1.412,00 | 7,5% |
| R$ 1.412,01 a R$ 2.666,68 | 9% |
| R$ 2.666,69 a R$ 4.000,03 | 12% |
| R$ 4.000,04 a R$ 7.507,49 | 14% |

### Exemplo prático
**Salário**: R$ 3.000,00
- 1ª faixa: R$ 1.412,00 × 7,5% = R$ 105,90
- 2ª faixa: R$ 1.254,68 × 9% = R$ 112,92
- 3ª faixa: R$ 333,32 × 12% = R$ 40,00
- **Total INSS**: R$ 258,82

## IRRF (Imposto de Renda Retido na Fonte)

### O que é o IRRF?
O IRRF é o Imposto de Renda descontado diretamente na fonte, ou seja, no momento do pagamento do salário.

### Como é calculado?
1. **Base de cálculo**: Salário bruto - INSS - dependentes
2. **Alíquotas progressivas**: 0% a 27,5%
3. **Deduções**: Por dependentes e outros gastos

### Tabela de alíquotas (2024)

| Base de cálculo | Alíquota | Parcela a deduzir |
|-----------------|----------|-------------------|
| Até R$ 2.259,20 | 0% | R$ 0 |
| R$ 2.259,21 a R$ 3.823,98 | 7,5% | R$ 169,44 |
| R$ 3.823,99 a R$ 5.006,94 | 15% | R$ 381,44 |
| R$ 5.006,95 a R$ 7.507,49 | 22,5% | R$ 662,77 |
| Acima de R$ 7.507,49 | 27,5% | R$ 896,00 |

### Exemplo prático
**Salário**: R$ 4.000,00
- **INSS**: R$ 258,82
- **Base IRRF**: R$ 4.000,00 - R$ 258,82 = R$ 3.741,18
- **Alíquota**: 15%
- **IRRF**: (R$ 3.741,18 × 15%) - R$ 381,44 = R$ 179,74

## Deduções permitidas

### Dependentes
- **Valor**: R$ 189,59 por dependente
- **Tipos**: Filhos, cônjuge, pais, etc.

### Outras deduções
- **Previdência privada**: PGBL/VGBL
- **Despesas médicas**: Com comprovantes
- **Educação**: Despesas com ensino

## Como otimizar seus impostos

1. **Declare dependentes**: Reduz a base de cálculo do IRRF
2. **Invista em previdência**: PGBL oferece dedução no IR
3. **Controle despesas médicas**: Guarde comprovantes
4. **Use ferramentas**: O PIM analisa automaticamente seus impostos

## Conclusão

Entender como funcionam os impostos é fundamental para planejar suas finanças. Com o PIM, você pode analisar automaticamente sua folha de pagamento e identificar oportunidades de economia.

**Quer uma análise detalhada dos seus impostos?** [Faça o upload do seu holerite](/br/scan-new-pim) e receba insights personalizados!`,
    excerpt: 'Os impostos descontados na folha de pagamento são uma das maiores dúvidas dos trabalhadores. Vamos explicar como funcionam o INSS e o IRRF, os principais impostos que afetam seu salário.',
    country: 'br',
    tags: ['impostos', 'INSS', 'IRRF', 'folha de pagamento', 'descontos']
  }
];

async function insertBlogArticles() {
  console.log('🌱 Début de l\'insertion des articles de blog...');

  try {
    for (const article of sampleArticles) {
      console.log(`📝 Ajout de l'article: ${article.title}`);
      
      // Insérer directement dans Supabase
      const { data, error } = await supabase
        .from('blog_articles')
        .insert({
          title: article.title,
          slug: article.slug,
          content_markdown: article.content,
          excerpt: article.excerpt,
          country: article.country,
          published_at: new Date().toISOString()
        });

      if (error) {
        console.error(`❌ Erreur lors de l'ajout de l'article ${article.slug}:`, error);
      } else {
        console.log(`✅ Article ajouté avec succès: ${article.slug}`);
      }
    }

    console.log('🎉 Insertion des articles de blog terminée avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion:', error);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  insertBlogArticles();
} 