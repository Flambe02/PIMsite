Write-Host "🚀 Insertion Automatique des Articles de Blog" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Vérification de la configuration..." -ForegroundColor Yellow
npx tsx scripts/quick-test.ts

Write-Host ""
Write-Host "📝 Lancement de l'insertion des articles..." -ForegroundColor Yellow
npx tsx scripts/insert-all-articles.ts

Write-Host ""
Write-Host "✅ Terminé !" -ForegroundColor Green
Read-Host "Appuyez sur Entrée pour continuer" 