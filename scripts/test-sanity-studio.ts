import 'dotenv/config';

console.log('🧪 Test de Sanity Studio');
console.log('========================\n');

console.log('📋 Configuration actuelle:');
console.log(`📦 Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
console.log(`🗄️ Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
console.log(`🌐 API Version: ${process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-29'}`);
console.log('');

console.log('🔗 URLs de test:');
console.log('   • Sanity Studio: http://localhost:3000/studio');
console.log('   • Blog BR: http://localhost:3000/br/blog');
console.log('   • Blog FR: http://localhost:3000/fr/blog');
console.log('');

console.log('📝 Instructions pour créer un article de test:');
console.log('   1. Allez sur http://localhost:3000/studio');
console.log('   2. Cliquez sur "Create new" → "Post"');
console.log('   3. Remplissez les champs:');
console.log('      - Titre: "Test Article"');
console.log('      - Pays: "Brésil" (br)');
console.log('      - Date de publication: Aujourd\'hui');
console.log('      - Extrait: "Article de test"');
console.log('      - Body: Ajoutez du contenu');
console.log('   4. Cliquez sur "Publish"');
console.log('   5. Testez http://localhost:3000/br/blog');
console.log('');

console.log('✅ Test terminé !'); 