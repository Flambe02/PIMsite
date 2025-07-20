# 📱 Composants Mobile PIM

Ce dossier contient les composants de base pour toutes les pages mobiles PIM.

## 🎯 Composants disponibles

### `MobilePageWrapper`
Wrapper principal pour toutes les pages mobiles.

```tsx
import { MobilePageWrapper } from "@/components/mobile"

export default function MaPageMobile() {
  return (
    <MobilePageWrapper title="Titre de la page">
      {/* Contenu de votre page */}
      <div>Votre contenu ici</div>
    </MobilePageWrapper>
  )
}
```

**Props :**
- `title?: string` - Titre de la page (optionnel)
- `children: React.ReactNode` - Contenu de la page
- `showFAB?: boolean` - Afficher le FAB (défaut: true)
- `fabAction?: () => void` - Action personnalisée pour le FAB
- `fabIcon?: React.ReactNode` - Icône personnalisée pour le FAB
- `fabLabel?: string` - Label d'accessibilité pour le FAB
- `fabRequiresAuth?: boolean` - Le FAB nécessite-t-il une authentification (défaut: false)

### `FAB` (Floating Action Button)
Bouton d'action flottant pour les actions rapides.

```tsx
import { FAB } from "@/components/mobile"
import { Upload } from "lucide-react"

// Utilisation simple
<FAB />

// Avec personnalisation
<FAB 
  href="/calculadora"
  icon={<Upload className="w-6 h-6" />}
  label="Upload holerite"
  variant="success"
/>
```

**Props :**
- `action?: () => void` - Fonction personnalisée
- `icon?: React.ReactNode` - Icône personnalisée
- `label?: string` - Label d'accessibilité
- `href?: string` - Lien de navigation
- `variant?: "primary" | "secondary" | "success" | "warning"` - Couleur
- `requiresAuth?: boolean` - Nécessite une authentification (défaut: false)

### `BottomTabBar`
Navigation en bas d'écran avec 4 onglets.

```tsx
import { BottomTabBar } from "@/components/mobile"

// Utilisation automatique dans MobilePageWrapper
<MobilePageWrapper>
  {/* Le BottomTabBar est automatiquement inclus */}
</MobilePageWrapper>
```

**Fonctionnalités :**
- Navigation automatique vers `/`, `/dashboard`, `/chat`, `/account`
- **Authentification automatique** : Les onglets protégés ouvrent le modal de connexion si l'utilisateur n'est pas connecté
- Indicateur d'onglet actif
- Support des badges de notification
- Responsive (visible uniquement sur mobile)

## 🎨 Design System

### Couleurs
- **Primary** : `emerald-600` (vert PIM)
- **Secondary** : `slate-600` (gris)
- **Success** : `emerald-600` (vert)
- **Warning** : `orange-600` (orange)

### Espacement
- **Padding principal** : `px-4 pt-6 pb-28`
- **Espacement FAB** : `bottom-20 right-4`
- **Hauteur BottomTabBar** : `py-2`

### Responsive
- **Mobile uniquement** : `md:hidden`
- **Z-index** : `z-30` (BottomTabBar), `z-40` (FAB)

## 📱 Exemple d'utilisation complète

```tsx
import { MobilePageWrapper, FAB } from "@/components/mobile"
import { Upload, MessageCircle } from "lucide-react"

export default function MaPageMobile() {
  const handleUpload = () => {
    // Logique d'upload
  }

  return (
    <MobilePageWrapper 
      title="Mon Dashboard"
      showFAB={true}
      fabAction={handleUpload}
      fabIcon={<Upload className="w-6 h-6" />}
      fabLabel="Upload holerite"
      fabRequiresAuth={true} // Le FAB nécessite une authentification
    >
      {/* Contenu de votre page */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Mon Dashboard</h1>
        <div className="bg-white rounded-xl p-4">
          <p>Contenu de votre page...</p>
        </div>
      </div>
    </MobilePageWrapper>
  )
}
```

## 🔧 Évolutivité

### Ajouter des badges de notification
```tsx
// Dans BottomTabBar.tsx, ajouter des badges
const tabs: TabItem[] = [
  {
    href: "/chat",
    icon: MessageSquare,
    label: "Chat",
    badge: 3 // Affichera un badge "3"
  }
]
```

### Personnaliser les onglets
```tsx
// Modifier les onglets dans BottomTabBar.tsx
const tabs: TabItem[] = [
  {
    href: "/",
    icon: Home,
    label: "Accueil"
  },
  // Ajouter vos onglets personnalisés
]
```

### Créer des variantes de FAB
```tsx
// Utiliser différentes variantes
<FAB variant="success" />
<FAB variant="warning" />
<FAB variant="secondary" />
```

## ⚡ Performance

- **Lazy loading** : Les composants sont chargés dynamiquement
- **Responsive** : Affichage conditionnel selon la taille d'écran
- **Accessibilité** : Labels ARIA et navigation clavier
- **Animations** : Transitions fluides et feedback tactile 