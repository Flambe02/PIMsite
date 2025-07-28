import { createClient } from '@/lib/supabase/server';
import { BlogService } from '@/lib/blog/blogService';

const sampleArticles = [
  {
    country: 'br',
    title: 'Como ler e interpretar seu holerite: salário bruto, líquido e descontos',
    slug: 'como-ler-holerite-salario-bruto-liquido-descontos',
    content_markdown: `# Como ler e interpretar seu holerite: salário bruto, líquido e descontos

## Introdução

O holerite (contracheque) é um documento essencial que detalha sua remuneração e direitos como funcionário. Entender cada elemento deste documento permite que você gerencie melhor suas finanças e garanta que está recebendo o que lhe é devido.

## Estrutura do Holerite

### 1. Informações Básicas

**Empresa**: Nome do seu empregador
**Funcionário**: Seu nome completo
**Cargo**: Sua função na empresa
**Período**: Mês e ano de referência

### 2. Salário Bruto

O salário bruto representa sua remuneração total antes das deduções. É a base de cálculo para todos os impostos e contribuições.

**Exemplo**: R$ 5.000,00

### 3. Deduções Obrigatórias

#### INSS (Instituto Nacional do Seguro Social)
- **Taxa**: 8% a 11% dependendo do seu salário
- **Objetivo**: Aposentadoria, invalidez, morte
- **Exemplo**: R$ 550,00 sobre R$ 5.000,00

#### IRRF (Imposto de Renda Retido na Fonte)
- **Taxa**: 0% a 27,5% dependendo da sua renda
- **Objetivo**: Imposto de renda
- **Exemplo**: R$ 450,00 sobre R$ 5.000,00

### 4. Salário Líquido

O salário líquido é o que você recebe efetivamente após todas as deduções.

**Cálculo**: Salário Bruto - INSS - IRRF = Salário Líquido
**Exemplo**: R$ 5.000,00 - R$ 550,00 - R$ 450,00 = R$ 4.000,00

## Benefícios e Vantagens

### Vale Refeição
- **Objetivo**: Auxílio para refeições
- **Vantagem fiscal**: Redução do IRRF
- **Exemplo**: R$ 500,00/mês

### Vale Transporte
- **Objetivo**: Auxílio para transporte
- **Limite**: 6% do salário bruto
- **Exemplo**: R$ 200,00/mês

### Plano de Saúde
- **Objetivo**: Cobertura médica
- **Vantagem**: Redução do IRRF
- **Exemplo**: R$ 200,00/mês

## Pontos de Verificação Importantes

### 1. Coerência Matemática
Verifique que: **Salário Líquido = Salário Bruto - Total Deduções**

### 2. Taxas de Deduções
- **INSS**: Verifique se a taxa corresponde ao seu salário
- **IRRF**: Verifique a tabela de progressão

### 3. Benefícios
- Certifique-se de que todos os seus benefícios estão listados
- Verifique os valores e as reduções fiscais

## Erros Comuns a Evitar

### 1. Confusão Bruto/Líquido
- O salário bruto é sempre maior que o líquido
- Se for o contrário, provavelmente há um erro

### 2. Deduções Faltantes
- Verifique se INSS e IRRF estão presentes para CLT
- PJ têm regras diferentes

### 3. Benefícios Não Declarados
- Certifique-se de que todos os seus benefícios estão listados
- Verifique as reduções fiscais associadas

## Otimizações Possíveis

### 1. Deduções IRRF
- **Despesas médicas**: Gastos médicos dedutíveis
- **Despesas educacionais**: Gastos com educação
- **PGBL/VGBL**: Planos de previdência privada

### 2. Benefícios Otimizados
- **Vale Alimentação**: Mais vantajoso que Vale Refeição
- **Plano de Saúde**: Redução de IRRF
- **PLR**: Participação nos lucros

## Perguntas Frequentes

### Q: Meu salário líquido parece muito baixo, o que fazer?
R: Verifique as deduções INSS e IRRF, assim como todos os benefícios declarados.

### Q: Como otimizar meu salário líquido?
R: Use as deduções IRRF disponíveis e negocie benefícios vantajosos.

### Q: As taxas de deduções estão corretas?
R: Consulte as tabelas oficiais do INSS e da Receita Federal.

## Conclusão

Entender seu holerite é essencial para otimizar sua situação financeira. Verificando regularmente este documento, você garante que está recebendo todos os seus direitos e identifica oportunidades de otimização.

**Recursos úteis**:
- [Calculadora Salário Líquido](https://www.mobills.com.br/calculadoras/calculadora-salario-liquido/)
- [Guia do Holerite](https://alice.com.br/blog/empresas/o-que-e-o-holerite-e-quais-informacoes-ele-apresenta/)
- [Entenda seu Holerite](https://meusalario.org.br/salario-e-renda/entenda-o-seu-holerite)

---

*Este artigo é baseado na legislação brasileira em vigor. Consulte sempre um profissional para conselhos personalizados.*`,
    excerpt: 'Guia completo para entender e interpretar sua fiche de paie brésilienne, incluindo salário bruto, líquido, deduções e benefícios.',
    author: 'PIM Team'
  },
  {
    country: 'fr',
    title: 'Comment lire et interpréter votre fiche de paie : salaire brut, net et déductions',
    slug: 'comment-lire-fiche-paie-salaire-brut-net-deductions',
    content_markdown: `# Comment lire et interpréter votre fiche de paie : salaire brut, net et déductions

## Introduction

La fiche de paie française est un document essentiel qui détaille votre rémunération et vos droits en tant que salarié. Comprendre chaque élément de ce document vous permet de mieux gérer vos finances et de vous assurer que vous recevez ce qui vous est dû.

## Structure de la Fiche de Paie

### 1. Informations de Base

**Employeur** : Nom de votre entreprise
**Salarié** : Votre nom complet
**Poste** : Votre fonction dans l'entreprise
**Période** : Mois et année de référence

### 2. Salaire Brut

Le salaire brut représente votre rémunération totale avant déductions. C'est la base de calcul pour tous les impôts et cotisations.

**Exemple** : 3 500,00 €

### 3. Déductions Obligatoires

#### Charges Sociales
- **Sécurité Sociale** : 15,5% du salaire brut
- **Assurance Chômage** : 2,4% du salaire brut
- **Retraite Complémentaire** : 8,55% du salaire brut
- **CSG/CRDS** : 9,2% du salaire brut

#### Impôt sur le Revenu
- **Prélevé à la source** selon votre taux personnalisé
- **Calculé** sur le salaire net imposable

### 4. Salaire Net

Le salaire net est ce que vous recevez effectivement après toutes les déductions.

**Calcul** : Salaire Brut - Charges Sociales - CSG/CRDS = Salaire Net
**Exemple** : 3 500,00 € - 1 225,00 € = 2 275,00 €

## Avantages et Bénéfices

### Mutuelle Santé
- **Objectif** : Couverture médicale complémentaire
- **Avantage fiscal** : Réduction de l'impôt sur le revenu
- **Exemple** : 150,00 €/mois

### Tickets Restaurant
- **Objectif** : Aide aux repas
- **Limite** : 19 € par jour
- **Exemple** : 380,00 €/mois

### Transport
- **Objectif** : Remboursement des frais de transport
- **Limite** : 50% du coût
- **Exemple** : 75,00 €/mois

## Points de Vérification Importants

### 1. Cohérence Mathématique
Vérifiez que : **Salaire Net = Salaire Brut - Total Déductions**

### 2. Taux de Cotisations
- **Sécurité Sociale** : Vérifiez les taux en vigueur
- **Retraite** : Vérifiez les cotisations patronales et salariales

### 3. Bénéfices
- Assurez-vous que tous vos avantages sont listés
- Vérifiez les montants et les réductions fiscales

## Erreurs Courantes à Éviter

### 1. Confusion Brut/Net
- Le salaire brut est toujours supérieur au salaire net
- Si c'est l'inverse, il y a probablement une erreur

### 2. Déductions Manquantes
- Vérifiez que toutes les charges sociales sont présentes
- Les CDI et CDD ont des règles différentes

### 3. Bénéfices Non Déclarés
- Assurez-vous que tous vos avantages sont listés
- Vérifiez les réductions fiscales associées

## Optimisations Possibles

### 1. Déductions Fiscales
- **Frais professionnels** : Déductions pour frais de transport, repas
- **Épargne salariale** : PEE, PERCO, intéressement
- **Dons** : Réduction d'impôt pour dons

### 2. Bénéfices Optimisés
- **Mutuelle** : Réduction d'impôt sur le revenu
- **Tickets restaurant** : Plus avantageux que l'indemnité repas
- **Transport** : Remboursement des frais de transport

## Questions Fréquentes

### Q: Mon salaire net semble trop faible, que faire ?
R: Vérifiez les charges sociales et tous les avantages déclarés.

### Q: Comment optimiser mon salaire net ?
R: Utilisez les déductions fiscales disponibles et négociez des avantages.

### Q: Les taux de cotisations sont-ils corrects ?
R: Consultez les taux officiels de l'URSSAF et de votre convention collective.

## Conclusion

Comprendre votre fiche de paie est essentiel pour optimiser votre situation financière. En vérifiant régulièrement ce document, vous vous assurez de recevoir tous vos droits et identifiez les opportunités d'optimisation.

**Ressources utiles** :
- [Calculatrice Salaire Net](https://www.urssaf.fr/portail/home/employeur/calculer-et-declarer/calculer-les-cotisations/calculer-le-salaire-net.html)
- [Guide Fiche de Paie](https://www.service-public.fr/particuliers/vosdroits/N367)
- [Comprendre sa Fiche de Paie](https://www.urssaf.fr/portail/home/employeur/calculer-et-declarer/calculer-les-cotisations/comprendre-sa-fiche-de-paie.html)

---

*Cet article est basé sur la législation française en vigueur. Consultez toujours un professionnel pour des conseils personnalisés.*`,
    excerpt: 'Guide complet pour comprendre et interpréter votre fiche de paie française, incluant salaire brut, net, déductions et avantages.',
    author: 'PIM Team'
  }
];

async function seedBlogArticles() {
  console.log('🌱 Début du seeding des articles de blog...');

  try {
    for (const article of sampleArticles) {
      console.log(`📝 Ajout de l'article: ${article.title}`);
      
      await BlogService.createArticle({
        country: article.country,
        title: article.title,
        slug: article.slug,
        content_markdown: article.content_markdown,
        excerpt: article.excerpt,
        author: article.author
      });
      
      console.log(`✅ Article ajouté avec succès: ${article.slug}`);
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