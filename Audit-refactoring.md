# 🛡️ Audit & Refactoring Sécurité/API (Next.js + Supabase)

## Tâches en attente

- [ ] Refactoriser toutes les routes API sensibles pour utiliser le helper `getServerSession()` (`lib/supabase/server.ts`)
    - Objectif : factoriser la vérification de session côté serveur (moins de duplication, plus lisible)
- [ ] Appliquer ce helper dans les pages SSR sensibles (dashboard, profil, onboarding, scan, etc.)
- [ ] Centraliser la gestion des erreurs 401/403 (helpers ou middleware)
- [ ] (Optionnel) Ajouter une vérification de rôle (admin) pour les routes critiques (`/api/delete-user`)

## Helper à utiliser

```js
import { getServerSession } from "@/lib/supabase/server";

const user = await getServerSession();
if (!user) {
  // 401 Unauthorized
}
```

## Historique
- Helper `getServerSession()` créé dans `lib/supabase/server.ts` (factorisation session serveur)
- Routes `/api/delete-account` et `/api/delete-user` sécurisées (check session, 401/403)

---

**À reprendre :**
- Refacto API + SSR avec ce helper
- Tests de sécurité (401/403)
- Factorisation des messages d’erreur 