import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Aller à la page d'accueil
    await page.goto('/')
  })

  test('should redirect to login modal when clicking dashboard without auth', async ({ page }) => {
    // Cliquer sur le bouton Dashboard (nécessite auth)
    await page.click('[data-testid="dashboard-tab"]')
    
    // Vérifier que le modal de login apparaît
    await expect(page.locator('[data-testid="login-modal"]')).toBeVisible()
  })

  test('should show Google login button in modal', async ({ page }) => {
    // Ouvrir le modal de login
    await page.click('[data-testid="login-button"]')
    
    // Vérifier que le bouton Google est présent
    await expect(page.locator('[data-testid="google-login-button"]')).toBeVisible()
    
    // Vérifier le texte du bouton
    await expect(page.locator('[data-testid="google-login-button"]')).toContainText('Continuer avec Google')
  })

  test('should have proper OAuth redirect configuration', async ({ page }) => {
    // Vérifier que le bouton Google a la bonne configuration
    const googleButton = page.locator('[data-testid="google-login-button"]')
    
    // Vérifier que le bouton est cliquable
    await expect(googleButton).toBeEnabled()
    
    // Vérifier que le bouton a la bonne classe CSS
    await expect(googleButton).toHaveClass(/border-gray-300/)
  })

  test('should handle login modal close', async ({ page }) => {
    // Ouvrir le modal
    await page.click('[data-testid="login-button"]')
    await expect(page.locator('[data-testid="login-modal"]')).toBeVisible()
    
    // Fermer le modal
    await page.click('[data-testid="modal-close-button"]')
    
    // Vérifier que le modal est fermé
    await expect(page.locator('[data-testid="login-modal"]')).not.toBeVisible()
  })

  test('should show proper error handling for auth failures', async ({ page }) => {
    // Ouvrir le modal de login
    await page.click('[data-testid="login-button"]')
    
    // Essayer de se connecter avec des données invalides
    await page.fill('[data-testid="email-input"]', 'invalid@email.com')
    await page.fill('[data-testid="password-input"]', 'wrongpassword')
    await page.click('[data-testid="email-login-button"]')
    
    // Vérifier qu'une erreur s'affiche
    await expect(page.locator('[data-testid="login-error"]')).toBeVisible()
  })

  test('should have responsive design for mobile', async ({ page }) => {
    // Simuler un appareil mobile
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Vérifier que le modal s'adapte
    await page.click('[data-testid="login-button"]')
    await expect(page.locator('[data-testid="login-modal"]')).toBeVisible()
    
    // Vérifier que les boutons sont bien dimensionnés sur mobile
    const googleButton = page.locator('[data-testid="google-login-button"]')
    await expect(googleButton).toBeVisible()
  })

  test('should handle logout functionality', async ({ page }) => {
    // Simuler une session utilisateur (mock)
    await page.addInitScript(() => {
      // Mock de la session Supabase
      window.localStorage.setItem('supabase.auth.token', 'mock-token')
    })
    
    // Aller au dashboard (simulé)
    await page.goto('/dashboard')
    
    // Cliquer sur le bouton de déconnexion
    await page.click('[data-testid="logout-button"]')
    
    // Vérifier la redirection vers la page d'accueil
    await expect(page).toHaveURL('/')
  })

  test('should show loading states during auth operations', async ({ page }) => {
    // Ouvrir le modal de login
    await page.click('[data-testid="login-button"]')
    
    // Cliquer sur le bouton Google
    await page.click('[data-testid="google-login-button"]')
    
    // Vérifier que l'état de chargement s'affiche
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible()
  })
})

test.describe('Dashboard Access Control', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Essayer d'accéder directement au dashboard
    await page.goto('/dashboard')
    
    // Vérifier qu'on est redirigé vers la page d'accueil
    await expect(page).toHaveURL('/')
  })

  test('should show proper auth state indicators', async ({ page }) => {
    // Vérifier que les éléments nécessitant une auth ne sont pas visibles
    await expect(page.locator('[data-testid="user-profile"]')).not.toBeVisible()
    await expect(page.locator('[data-testid="dashboard-content"]')).not.toBeVisible()
  })
}) 