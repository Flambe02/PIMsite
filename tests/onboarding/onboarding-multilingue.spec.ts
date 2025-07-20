import { test, expect } from '@playwright/test';

test.describe('Onboarding Multilingue', () => {
  test.beforeEach(async ({ page }) => {
    // Aller à la page d'accueil
    await page.goto('http://localhost:3000');
  });

  test('Nouvel utilisateur brésilien → onboarding en portugais', async ({ page }) => {
    // Simuler un navigateur en portugais
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'language', {
        value: 'pt-BR',
        configurable: true
      });
    });

    // Cliquer sur le bouton de connexion
    await page.click('[data-testid="login-button"]');
    
    // Attendre que la modal de login s'affiche
    await page.waitForSelector('[data-testid="login-modal"]');
    
    // Cliquer sur le bouton Google
    await page.click('[data-testid="google-login-button"]');
    
    // Simuler la connexion Google (mock)
    // En réalité, cela redirigerait vers Google OAuth
    await page.goto('http://localhost:3000/auth/callback?code=test-code&locale=br');
    
    // Vérifier qu'on est redirigé vers l'onboarding en portugais
    await expect(page).toHaveURL(/\/br\/onboarding/);
    
    // Vérifier que l'interface est en portugais
    await expect(page.locator('h1')).toContainText('Bem-vindo ao PIM');
    await expect(page.locator('button')).toContainText('Próximo');
  });

  test('Nouvel utilisateur français → onboarding en français', async ({ page }) => {
    // Simuler un navigateur en français
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'language', {
        value: 'fr-FR',
        configurable: true
      });
    });

    // Cliquer sur le bouton de connexion
    await page.click('[data-testid="login-button"]');
    
    // Attendre que la modal de login s'affiche
    await page.waitForSelector('[data-testid="login-modal"]');
    
    // Cliquer sur le bouton Google
    await page.click('[data-testid="google-login-button"]');
    
    // Simuler la connexion Google (mock)
    await page.goto('http://localhost:3000/auth/callback?code=test-code&locale=fr');
    
    // Vérifier qu'on est redirigé vers l'onboarding en français
    await expect(page).toHaveURL(/\/fr\/onboarding/);
    
    // Vérifier que l'interface est en français
    await expect(page.locator('h1')).toContainText('Bienvenue sur PIM');
    await expect(page.locator('button')).toContainText('Suivant');
  });

  test('Changement de langue pendant l\'onboarding (état préservé)', async ({ page }) => {
    // Aller directement à l'onboarding en français
    await page.goto('http://localhost:3000/fr/onboarding');
    
    // Remplir le premier champ
    await page.fill('input[placeholder*="Prénom"]', 'Jean');
    await page.fill('input[placeholder*="Nom"]', 'Dupont');
    
    // Changer la langue vers le portugais
    await page.selectOption('select', 'br');
    
    // Vérifier qu'on est redirigé vers l'onboarding en portugais
    await expect(page).toHaveURL(/\/br\/onboarding/);
    
    // Vérifier que l'interface est en portugais
    await expect(page.locator('h1')).toContainText('Bem-vindo ao PIM');
    
    // Vérifier que les données du formulaire sont préservées
    await expect(page.locator('input[value="Jean"]')).toBeVisible();
    await expect(page.locator('input[value="Dupont"]')).toBeVisible();
  });

  test('Utilisateur déjà onboardé → va directement au dashboard', async ({ page }) => {
    // Simuler un utilisateur avec onboarding complété
    await page.addInitScript(() => {
      // Mock Supabase pour simuler un utilisateur onboardé
      window.localStorage.setItem('mock-onboarding-completed', 'true');
    });

    // Aller au callback avec un utilisateur "onboardé"
    await page.goto('http://localhost:3000/auth/callback?code=test-code&locale=fr&onboarding_completed=true');
    
    // Vérifier qu'on est redirigé vers le dashboard
    await expect(page).toHaveURL(/\/fr\/dashboard/);
    
    // Vérifier qu'on ne voit pas l'onboarding
    await expect(page.locator('text=onboarding')).not.toBeVisible();
  });

  test('Détection automatique de la langue depuis l\'URL', async ({ page }) => {
    // Aller directement à l'onboarding en portugais
    await page.goto('http://localhost:3000/br/onboarding');
    
    // Vérifier que l'interface est en portugais
    await expect(page.locator('h1')).toContainText('Bem-vindo ao PIM');
    await expect(page.locator('button')).toContainText('Próximo');
    
    // Vérifier que le sélecteur de langue affiche le bon choix
    await expect(page.locator('select')).toHaveValue('br');
  });

  test('Navigation entre les étapes de l\'onboarding', async ({ page }) => {
    // Aller à l'onboarding
    await page.goto('http://localhost:3000/fr/onboarding');
    
    // Vérifier qu'on est à l'étape 1
    await expect(page.locator('text=Étape 1')).toBeVisible();
    
    // Remplir les champs de l'étape 1
    await page.fill('input[placeholder*="Prénom"]', 'Marie');
    await page.fill('input[placeholder*="Nom"]', 'Martin');
    await page.selectOption('select', 'FR');
    
    // Passer à l'étape suivante
    await page.click('button:has-text("Suivant")');
    
    // Vérifier qu'on est à l'étape 2
    await expect(page.locator('text=Étape 2')).toBeVisible();
    
    // Sélectionner la langue
    await page.selectOption('select', 'fr');
    
    // Passer à l'étape suivante
    await page.click('button:has-text("Suivant")');
    
    // Vérifier qu'on est à l'étape 3
    await expect(page.locator('text=Étape 3')).toBeVisible();
    
    // Sélectionner des objectifs
    await page.click('button:has-text("Épargner de l\'argent")');
    await page.click('button:has-text("Investir")');
    
    // Terminer l'onboarding
    await page.click('button:has-text("Terminer")');
    
    // Vérifier qu'on est redirigé vers le dashboard
    await expect(page).toHaveURL(/\/fr\/dashboard/);
  });

  test('Gestion d\'erreur lors de l\'onboarding', async ({ page }) => {
    // Aller à l'onboarding
    await page.goto('http://localhost:3000/fr/onboarding');
    
    // Essayer de passer à l'étape suivante sans remplir les champs
    await page.click('button:has-text("Suivant")');
    
    // Vérifier qu'un message d'erreur s'affiche
    await expect(page.locator('text=Erreur')).toBeVisible();
  });

  test('Responsive design de l\'onboarding', async ({ page }) => {
    // Tester sur mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/fr/onboarding');
    
    // Vérifier que l'interface s'adapte
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button')).toBeVisible();
    
    // Tester sur tablette
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    
    // Vérifier que l'interface s'adapte
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button')).toBeVisible();
  });
}); 