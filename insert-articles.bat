@echo off
echo 🚀 Insertion Automatique des Articles de Blog
echo =============================================
echo.

echo 📋 Vérification de la configuration...
npx tsx scripts/quick-test.ts

echo.
echo 📝 Lancement de l'insertion des articles...
npx tsx scripts/insert-all-articles.ts

echo.
echo ✅ Terminé !
pause 