import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const envPath = join(process.cwd(), '.env.local');

// Variables d'environnement Sanity
const sanityEnvVars = `
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=y5sty7n2
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-07-29
`;

function setupSanityEnv() {
  try {
    console.log('🔧 Configuration des variables d\'environnement Sanity...');
    
    let envContent = '';
    
    // Lire le fichier .env.local existant s'il existe
    if (existsSync(envPath)) {
      envContent = readFileSync(envPath, 'utf8');
      console.log('📁 Fichier .env.local existant trouvé');
    } else {
      console.log('📁 Création d\'un nouveau fichier .env.local');
    }
    
    // Vérifier si les variables Sanity existent déjà
    if (envContent.includes('NEXT_PUBLIC_SANITY_PROJECT_ID')) {
      console.log('✅ Variables Sanity déjà configurées');
      return;
    }
    
    // Ajouter les variables Sanity
    const newEnvContent = envContent + sanityEnvVars;
    
    // Écrire le fichier
    writeFileSync(envPath, newEnvContent);
    
    console.log('✅ Variables d\'environnement Sanity ajoutées avec succès !');
    console.log('📋 Variables ajoutées :');
    console.log('   - NEXT_PUBLIC_SANITY_PROJECT_ID=y5sty7n2');
    console.log('   - NEXT_PUBLIC_SANITY_DATASET=production');
    console.log('   - NEXT_PUBLIC_SANITY_API_VERSION=2025-07-29');
    console.log('\n🔄 Redémarrez le serveur de développement pour appliquer les changements.');
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration :', error);
  }
}

setupSanityEnv(); 