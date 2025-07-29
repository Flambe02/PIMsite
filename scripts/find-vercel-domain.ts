#!/usr/bin/env tsx

import 'dotenv/config';

console.log('🌐 Recherche du Domaine Vercel');
console.log('==============================\n');

console.log('📋 Comment trouver votre domaine Vercel :');
console.log('');
console.log('1. 🌐 Allez sur https://vercel.com/dashboard');
console.log('2. 📁 Sélectionnez votre projet');
console.log('3. 🔗 Regardez l\'URL dans la barre d\'adresse');
console.log('4. 📝 Copiez le domaine (ex: https://mon-app.vercel.app)');
console.log('');

console.log('🔍 Domaines Vercel typiques :');
console.log('   - https://[nom-projet].vercel.app');
console.log('   - https://[nom-projet]-[hash].vercel.app');
console.log('   - https://[nom-personnalisé].vercel.app');
console.log('');

console.log('📝 Étapes pour ajouter le CORS :');
console.log('');
console.log('1. 🌐 Allez sur https://www.sanity.io/manage');
console.log('2. 📁 Sélectionnez votre projet (y5sty7n2)');
console.log('3. ⚙️  Allez dans "Settings" > "API"');
console.log('4. 🔗 Cliquez sur "CORS Origins"');
console.log('5. ➕ Cliquez "Add CORS Origin"');
console.log('');
console.log('📋 Configuration à remplir :');
console.log('   Nom: Vercel Production');
console.log('   Origin: https://[votre-domaine].vercel.app');
console.log('   Allow Credentials: ✅ Coché');
console.log('   Allow Origin: ✅ Coché');
console.log('');

console.log('🔧 Domaines à ajouter (selon votre cas) :');
console.log('');
console.log('✅ Production :');
console.log('   https://[votre-app].vercel.app');
console.log('');
console.log('✅ Preview (optionnel) :');
console.log('   https://[votre-app]-git-[branch]-[user].vercel.app');
console.log('');
console.log('✅ Développement (optionnel) :');
console.log('   http://localhost:3000');
console.log('   http://localhost:3001');
console.log('');

console.log('💡 Conseil :');
console.log('   Ajoutez d\'abord le domaine de production');
console.log('   Testez que ça fonctionne');
console.log('   Puis ajoutez les autres si nécessaire');
console.log('');

console.log('🔄 Après avoir ajouté le CORS :');
console.log('   1. Attendez quelques minutes');
console.log('   2. Redéployez votre app Vercel');
console.log('   3. Testez l\'affichage des articles'); 