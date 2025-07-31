#!/usr/bin/env tsx

/**
 * Script pour exécuter le SQL de seeding des articles de blog
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { randomUUID } from 'crypto';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Articles de démonstration pour le blog (version corrigée)
const sampleArticles = [
  {
    title: 'Entenda seu holerite: Guia completo para funcionários CLT',
    slug: 'entenda-seu-holerite-guia-completo-funcionarios-clt',
    content_markdown: `# Entenda seu holerite: Guia completo para funcionários CLT

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
    content_markdown: `# Vale refeição: Tudo que você precisa saber sobre este benefício

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
          id: randomUUID(),
          title: article.title,
          slug: article.slug,
          content_markdown: article.content_markdown,
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