import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

const articles = [
  // Articles pour la France
  {
    id: randomUUID(),
    title: "Comprendre votre bulletin de paie : Guide complet pour les salariés",
    slug: "comprendre-bulletin-paie-guide-complet-salaries",
    excerpt: "Découvrez comment lire et comprendre votre bulletin de paie français. Explications détaillées des différentes sections, cotisations sociales et impôts.",
    content_markdown: `# Comprendre votre bulletin de paie : Guide complet pour les salariés

## Qu'est-ce que le bulletin de paie ?

Le bulletin de paie est un document légal obligatoire que votre employeur doit vous remettre à chaque versement de salaire. Il détaille tous les éléments de votre rémunération.

## Les sections principales du bulletin de paie

### 1. Informations générales
- Nom et adresse de l'employeur
- Nom et adresse du salarié
- Période de paie
- Numéro de sécurité sociale

### 2. Salaire brut
Le salaire brut comprend :
- Salaire de base
- Heures supplémentaires
- Primes et indemnités
- Avantages en nature

### 3. Cotisations sociales
Les principales cotisations :
- **Sécurité sociale** : 15,5% du salaire brut
- **Assurance chômage** : 2,4%
- **Retraite complémentaire** : 8,55%
- **Mutuelle** : variable selon l'entreprise

### 4. Salaire net
Le salaire net est ce qui vous est effectivement versé après déduction de toutes les cotisations.

## Comment calculer votre salaire net

**Formule simplifiée :**
Salaire Net = Salaire Brut - Cotisations Sociales - CSG/CRDS - Impôt sur le revenu

## Les points importants à vérifier

1. **Vérifiez les heures travaillées**
2. **Contrôlez les cotisations**
3. **Vérifiez les avantages**
4. **Conservez vos bulletins**

## Conseils pour optimiser votre rémunération

- Négociez votre salaire de base
- Demandez des avantages en nature
- Optimisez votre mutuelle
- Utilisez les dispositifs d'épargne salariale`,
    published_at: new Date('2024-01-15').toISOString(),
    country: 'fr'
  },
  {
    id: randomUUID(),
    title: "Les avantages sociaux en France : Guide des bénéfices salariaux",
    slug: "avantages-sociaux-france-guide-benefices-salaraux",
    excerpt: "Tour d'horizon complet des avantages sociaux en France : mutuelle, prévoyance, épargne salariale, tickets restaurant et plus encore.",
    content_markdown: `# Les avantages sociaux en France : Guide des bénéfices salariaux

## Qu'est-ce qu'un avantage social ?

Un avantage social est un élément de rémunération non monétaire offert par l'employeur pour améliorer les conditions de vie et de travail des salariés.

## Les principaux avantages sociaux

### 1. Mutuelle santé
- **Obligatoire** depuis 2016 pour les entreprises de plus de 50 salariés
- Couvre les frais non remboursés par la Sécurité sociale
- Participation employeur minimum de 50%

### 2. Prévoyance
- Assurance décès et invalidité
- Rente d'invalidité
- Indemnités journalières en cas d'arrêt de travail

### 3. Épargne salariale
- **PEE** (Plan d'Épargne Entreprise)
- **PERCO** (Plan d'Épargne Retraite Collectif)
- **Intéressement** et **participation**

### 4. Tickets restaurant
- Valeur maximale : 19€ par jour
- Participation employeur : 50% minimum
- Avantage fiscal intéressant

### 5. Transport
- **Forfait mobilité durable** : jusqu'à 500€/an
- Prise en charge des abonnements de transport
- Vélo de fonction

## Avantages fiscaux

### Pour l'employeur
- Déductibilité des charges
- Réduction des cotisations sociales

### Pour le salarié
- Exonération partielle d'impôts
- Réduction des cotisations sociales

## Comment négocier vos avantages

1. **Évaluez vos besoins**
2. **Comparez avec le marché**
3. **Préparez votre argumentaire**
4. **Négociez au bon moment**

## Conseils pratiques

- Conservez tous vos justificatifs
- Vérifiez les conditions d'attribution
- Optimisez selon votre situation familiale
- Renseignez-vous sur les nouveautés légales`,
    published_at: new Date('2024-01-20').toISOString(),
    country: 'fr'
  },
  // Articles pour l'Angleterre
  {
    id: randomUUID(),
    title: "Understanding Your Payslip: Complete Guide for UK Employees",
    slug: "understanding-payslip-complete-guide-uk-employees",
    excerpt: "Learn how to read and understand your UK payslip. Detailed explanations of different sections, tax deductions, and National Insurance contributions.",
    content_markdown: `# Understanding Your Payslip: Complete Guide for UK Employees

## What is a Payslip?

A payslip is a legal document that your employer must provide every time you are paid. It shows a detailed breakdown of your earnings and deductions.

## Key Sections of Your Payslip

### 1. Personal Information
- Employee name and address
- National Insurance number
- Tax code
- Pay period

### 2. Gross Pay
Your gross pay includes:
- Basic salary
- Overtime
- Bonuses and commissions
- Benefits in kind

### 3. Deductions

#### Income Tax
- Calculated based on your tax code
- Different rates: 20%, 40%, 45%
- Personal Allowance: £12,570 (2023/24)

#### National Insurance (NI)
- **Class 1 NI**: 12% on earnings between £12,570 and £50,270
- **Class 1 NI**: 2% on earnings above £50,270
- **Class 1A**: On benefits in kind

#### Pension Contributions
- **Auto-enrolment**: Minimum 5% employee, 3% employer
- **Salary sacrifice**: Tax-efficient pension contributions

### 4. Net Pay
This is the amount actually paid into your bank account.

## How to Calculate Your Take-Home Pay

**Basic Formula:**
Net Pay = Gross Pay - Income Tax - National Insurance - Pension - Other Deductions

## Important Things to Check

1. **Verify your tax code**
2. **Check NI contributions**
3. **Review pension deductions**
4. **Keep payslips for 6 years**

## Tax Code Explained

Your tax code tells HMRC:
- How much you can earn before paying tax
- Any adjustments needed
- Emergency tax codes (W1, M1, X)

## Common Payslip Abbreviations

- **PAYE**: Pay As You Earn
- **NI**: National Insurance
- **YTD**: Year to Date
- **OT**: Overtime
- **BON**: Bonus

## Tips for Optimising Your Pay

- Check your tax code regularly
- Consider salary sacrifice for pensions
- Use tax-free benefits
- Claim tax relief on work expenses`,
    published_at: new Date('2024-01-25').toISOString(),
    country: 'autre'
  },
  {
    id: randomUUID(),
    title: "Employee Benefits in the UK: Complete Guide to Workplace Perks",
    slug: "employee-benefits-uk-complete-guide-workplace-perks",
    excerpt: "Comprehensive overview of employee benefits in the UK: health insurance, pension schemes, flexible working, and more workplace advantages.",
    content_markdown: `# Employee Benefits in the UK: Complete Guide to Workplace Perks

## What are Employee Benefits?

Employee benefits are non-cash compensation provided by employers to improve employee satisfaction, retention, and overall wellbeing.

## Main Types of Employee Benefits

### 1. Health and Wellbeing
- **Private Medical Insurance (PMI)**
- **Dental Insurance**
- **Health Cash Plans**
- **Employee Assistance Programmes (EAP)**
- **Gym memberships**

### 2. Financial Benefits
- **Pension Schemes**
  - Defined Benefit (DB)
  - Defined Contribution (DC)
  - Auto-enrolment minimums
- **Life Insurance**
- **Income Protection**
- **Critical Illness Cover**

### 3. Work-Life Balance
- **Flexible Working**
  - Remote work
  - Flexible hours
  - Compressed hours
- **Annual Leave**
  - Minimum 28 days (including bank holidays)
  - Additional days for long service
- **Sick Pay**
  - Statutory Sick Pay (SSP)
  - Enhanced sick pay schemes

### 4. Professional Development
- **Training and Development**
- **Professional Qualifications**
- **Conference Attendance**
- **Mentoring Programmes**

### 5. Lifestyle Benefits
- **Cycle to Work Scheme**
- **Season Ticket Loans**
- **Childcare Vouchers**
- **Employee Discounts**

## Tax Implications

### Tax-Free Benefits
- **Pension contributions** (up to limits)
- **Cycle to Work** (up to £1,000)
- **Childcare vouchers** (up to £55/week)
- **Health screenings**

### Taxable Benefits
- **Company cars**
- **Private medical insurance**
- **Interest-free loans**

## How to Negotiate Benefits

1. **Research market rates**
2. **Identify your priorities**
3. **Prepare your case**
4. **Timing is crucial**

## Benefits Trends in 2024

- **Mental health support**
- **Financial wellbeing**
- **Sustainability initiatives**
- **Technology allowances**

## Making the Most of Your Benefits

- **Read your benefits handbook**
- **Use all available benefits**
- **Review annually**
- **Ask questions**

## Legal Requirements

- **Auto-enrolment pensions**
- **Statutory sick pay**
- **Minimum holiday entitlement**
- **Equal pay requirements**`,
    published_at: new Date('2024-01-30').toISOString(),
    country: 'autre'
  }
];

async function addMoreArticles() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Variables d\'environnement Supabase manquantes');
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('📝 Ajout de nouveaux articles de blog...');

    for (const article of articles) {
      const { error } = await supabase
        .from('blog_articles')
        .insert(article);

      if (error) {
        console.error(`❌ Erreur lors de l'ajout de "${article.title}":`, error);
      } else {
        console.log(`✅ Article ajouté: ${article.title} (${article.country.toUpperCase()})`);
      }
    }

    console.log('🎉 Ajout d\'articles terminé !');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

addMoreArticles(); 