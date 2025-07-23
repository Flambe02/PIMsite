# 📱 MOBILE_AUDIT_PLAN.md

## Objectif

Ce document centralise l’audit, les conventions, et toutes les décisions d’architecture pour la refonte mobile-first de l’application Next.js + Tailwind + Supabase. **Il doit être mis à jour à chaque évolution ou choix d’architecture mobile.**

---

## 1. Audit de l’Application – Rapport par Page

| Page/Route                        | Problèmes de responsive identifiés                | Gravité      | Suggestions de refonte rapide                |
|------------------------------------|---------------------------------------------------|--------------|----------------------------------------------|
| **Homepage** (`/`)                | - Sections à largeur fixe<br>- Images non fluides<br>- Boutons petits sur mobile | **Major**    | Utiliser `max-w-` fluides, images `w-full`, CTA larges |
| **Login / Signup** (`/login`, `/signup`) | - Inputs trop étroits<br>- Padding insuffisant<br>- Pas de focus mobile | **Blocking** | Inputs `w-full`, padding `px-4 py-3`, focus visible |
| **Ressources** (`/recursos/*`)    | - Accordéons non collapsibles<br>- Texte trop petit<br>- Marges fixes | **Major**    | Accordéons mobiles, `text-base`, marges `mx-4` |
| **Upload Holerite** (`/calculadora/upload-holerite`) | - Zone drag-drop non adaptée mobile<br>- Boutons trop petits<br>- Pas de feedback tactile | **Blocking** | Utiliser input natif, boutons larges, feedback |
| **Dashboard** (`/dashboard`)      | - Sidebar non masquée<br>- Tableaux horizontaux<br>- Cartes non scrollables | **Major**    | Sidebar masquée, tableaux scroll, cards `overflow-x-auto` |
| **Settings** (`/profile`, `/account`) | - Formulaires trop larges<br>- Switchs petits<br>- Pas de sticky header | **Cosmetic** | Formulaires `w-full`, switchs `h-8 w-14`, header sticky |
| **Pages Authentifiées**           | - Modals non centrées<br>- Largeurs fixes<br>- Boutons trop petits | **Major**    | Modals `w-11/12`, padding, CTA `h-12` |
| **Pages publiques** (`/guia-paises`, `/simulador`, etc.) | - Images non responsives<br>- Grilles cassées<br>- Liens trop petits | **Major**    | Images `w-full`, grilles `grid-cols-1`, liens `text-lg` |

**Résumé des problèmes récurrents :**
- Largeurs fixes (`w-[400px]`, etc.)
- Utilisation de `lg:` sans fallback mobile
- Boutons et inputs trop petits pour le tactile
- Images non fluides
- Sidebars et modals non adaptés mobile
- Tableaux non scrollables horizontalement

---

## 2. Architecture Mobile-First Recommandée

### a. Routing & Layout

- Créer `app/(mobile)/layout.tsx` (mobile) et garder `app/(desktop)/layout.tsx` (desktop)
- Hook `useIsMobile()` pour détecter le viewport et router vers le bon layout
- Exemple :
  ```tsx
  import { useIsMobile } from '@/hooks/use-mobile'
  import MobileHome from '@/components/mobile/MobileHome'
  import DesktopHome from '@/components/desktop/DesktopHome'

  export default function HomePage() {
    const isMobile = useIsMobile()
    return isMobile ? <MobileHome /> : <DesktopHome />
  }
  ```

### b. Organisation des composants

- `components/mobile/` : tous les nouveaux composants mobiles (MobileHome, MobileLogin, etc.)
- `components/desktop/` : composants desktop existants (ou à dupliquer si besoin)
- Logique partagée (hooks, data) : `hooks/`, `lib/`
- UI purement mobile : nouveaux fichiers `MobileXxx.tsx` (pas de modification des existants)

### c. Navigation & UI

- **Mobile** : bottom tab bar (`components/mobile/MobileTabBar.tsx`), header compact, hamburger menu, CTA bas de page, cards scrollables
- **Desktop** : sidebar, header large, navigation inchangée

### d. Conventions Tailwind

- Base mobile : classes par défaut (pas de préfixe)
- Desktop : `lg:`, `xl:` uniquement pour élargir, jamais pour fixer
- Largeurs : `w-full`, `max-w-screen-sm`, `mx-auto`
- Espacements : `p-4`, `gap-4`, `space-y-4`
- Typo : `text-base` min, `text-lg` pour titres

---

## 3. Implémentation Mobile-First par Page

### Homepage
- `components/mobile/MobileHome.tsx`
  - Hero simplifié, CTA large, images `priority`, cards scroll horizontales
  - Footer sticky

### Login & Signup
- `components/mobile/MobileLogin.tsx`, `MobileSignup.tsx`
  - Inputs `w-full`, `h-12`, focus visible
  - Boutons `h-12 w-full`, feedback tactile
  - Messages d’erreur accessibles
  - Google OAuth bouton large

### Ressources
- `components/mobile/MobileResources.tsx`
  - Accordéons (`@headlessui/react`), sections collapsibles
  - Typo lisible, sticky FAB “haut de page”

### Upload Holerite
- `components/mobile/MobileUpload.tsx`
  - Input natif fichier, instructions claires
  - Progress bar, bouton “Réessayer”
  - Feedback d’erreur visible

### Résultats & Recos
- `components/mobile/MobileResults.tsx`
  - Cards scrollables, tags (“Salaire”, “Avantages”)
  - Détails expand/collapse, boutons d’action

### Dashboard & Settings
- `components/mobile/MobileDashboard.tsx`, `MobileSettings.tsx`
  - Navigation tab bar, cards synthétiques
  - Switchs larges, sliders tactiles

---

## 4. Contraintes & Qualité

- **Aucune modification** des composants desktop existants
- Code mobile modulaire, testable (unitaires + Playwright)
- `data-testid` sur tous les nouveaux composants
- Parité fonctionnelle (auth, AI, data) entre mobile et desktop
- Meta viewport tag : `<meta name="viewport" content="width=device-width, initial-scale=1">`
- S’assurer que tout fonctionne sur iOS & Android (test Chrome DevTools + BrowserStack)

---

## 5. Bonus

- **Sentry** : Ajoute `Sentry.init()` dans `app/(mobile)/layout.tsx` + logs dans les handlers critiques
- **Lighthouse CI** : Script npm `"lighthouse:mobile": "lighthouse http://localhost:3000 --preset=mobile --output html --output-path=./lh-mobile.html"`
- **Style Guide Mobile** :
  ```js
  export const mobileTheme = {
    colors: {
      primary: '#F44336', // Rouge PIM
      secondary: '#F9A825',
      background: '#FFF',
      text: '#222',
      accent: '#1976D2'
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem'
    },
    borderRadius: {
      sm: '0.5rem',
      md: '1rem'
    },
    font: {
      base: '1rem',
      lg: '1.25rem',
      xl: '1.5rem'
    }
  }
  ```

---

## 6. Roadmap Actionnable

1. Crée `components/mobile/` et commence par `MobileHome.tsx` ou `MobileLogin.tsx`.
2. Implémente le layout mobile global.
3. Route automatiquement selon le device.
4. Duplique chaque page-clé en version mobile.
5. Teste, ajuste, et assure la parité fonctionnelle.

---

## 7. FAQ / Décisions d’Architecture

- **Pourquoi séparer mobile/desktop ?**
  Pour une UI propre, testable, maintenable, sans hacks CSS/JS.
- **Par où commencer ?**
  Par la page la plus critique sur mobile (souvent Home ou Login).
- **Comment router ?**
  Avec `useIsMobile()` et un switch dans le layout ou la page.
- **Dois-je tout dupliquer ?**
  Oui, pour chaque page-clé, une version mobile dédiée.
- **Et la logique métier ?**
  Elle reste partagée (hooks, lib, etc.), seul le markup UI change.

---

**Rappel : Ce fichier doit être mis à jour à chaque évolution ou choix d’architecture mobile.** 

---

## 8. Routing Automatique Mobile/Desktop

### Patterns disponibles

**1. Middleware (redirection serveur)**
- Détection device via User-Agent
- Redirection immédiate vers la version mobile ou desktop
- Centralisé, pas de flash côté client
- Limite : ne gère pas le resize dynamique

**2. Switch côté client (dans le layout/page)**
- Détection dynamique via hook (ex : useIsMobile)
- Peut router selon le viewport à tout moment
- Limite : possible flash initial, à dupliquer dans chaque page

### Recommandation projet
- Utiliser le middleware pour les routes critiques : `/`, `/dashboard`, `/login`, `/upload-holerite`, etc.
- Compléter par un switch côté client si besoin (SEO, SSR, ou fallback)
- Documenter chaque route ajoutée dans cette section

### Exemple de middleware
```ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(userAgent);

  if (request.nextUrl.pathname === '/dashboard') {
    if (isMobile) {
      return NextResponse.redirect(new URL('/(mobile)/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/(desktop)/dashboard', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard'],
};
```

### Exemple de switch côté client
```tsx
'use client';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const isMobile = useIsMobile();
  const router = useRouter();

  useEffect(() => {
    if (isMobile) {
      router.replace('/(mobile)/dashboard');
    }
  }, [isMobile, router]);

  return null;
}
```

### Routes cibles à router automatiquement
- `/` (homepage)
- `/dashboard`
- `/login`
- `/signup`
- `/upload-holerite`
- `/results` (ou `/dashboard/holerite`)

**Toute évolution ou ajout de route doit être documenté ici.** 