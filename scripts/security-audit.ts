import { config } from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

config({ path: '.env.local' });
config({ path: '.env' });

interface SecurityIssue {
  type: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  file?: string;
  line?: number;
}

const securityIssues: SecurityIssue[] = [];

function checkEnvironmentVariables() {
  console.log('🔒 Audit de sécurité des variables d\'environnement...\n');

  // Vérifier les variables sensibles
  const sensitiveVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET',
    'NEXT_PUBLIC_SANITY_API_VERSION'
  ];

  for (const varName of sensitiveVars) {
    const value = process.env[varName];
    if (value) {
      if (value.includes('http') || value.includes('https')) {
        securityIssues.push({
          type: 'MEDIUM',
          message: `Variable ${varName} contient une URL - vérifiez qu'elle n'est pas exposée publiquement`,
          file: '.env.local'
        });
      }
      
      if (value.length > 50) {
        securityIssues.push({
          type: 'HIGH',
          message: `Variable ${varName} semble être une clé longue - vérifiez qu'elle n'est pas exposée`,
          file: '.env.local'
        });
      }
    } else {
      securityIssues.push({
        type: 'LOW',
        message: `Variable ${varName} non définie`,
        file: '.env.local'
      });
    }
  }
}

function checkPackageJson() {
  console.log('📦 Vérification du package.json...\n');
  
  try {
    const packagePath = join(process.cwd(), 'package.json');
    const packageContent = readFileSync(packagePath, 'utf8');
    
    if (packageContent.includes('SUPABASE_URL') || packageContent.includes('SUPABASE_ANON_KEY')) {
      securityIssues.push({
        type: 'CRITICAL',
        message: 'Variables Supabase exposées dans package.json',
        file: 'package.json'
      });
    }
  } catch (error) {
    console.error('❌ Erreur lors de la lecture du package.json:', error);
  }
}

function checkGitHistory() {
  console.log('📚 Vérification de l\'historique Git...\n');
  
  // Vérifier si des fichiers .env sont dans l'historique
  try {
    const { execSync } = require('child_process');
    const result = execSync('git log --name-only --oneline', { encoding: 'utf8' });
    
    if (result.includes('.env')) {
      securityIssues.push({
        type: 'CRITICAL',
        message: 'Fichiers .env détectés dans l\'historique Git',
        file: 'git history'
      });
    }
  } catch (error) {
    // Pas de fichiers .env dans l'historique (bon signe)
  }
}

function checkCurrentStatus() {
  console.log('📋 Vérification du statut Git actuel...\n');
  
  try {
    const { execSync } = require('child_process');
    const result = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (result.includes('.env')) {
      securityIssues.push({
        type: 'HIGH',
        message: 'Fichiers .env détectés dans les modifications non commitées',
        file: 'git status'
      });
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du statut Git:', error);
  }
}

function generateReport() {
  console.log('📊 RAPPORT DE SÉCURITÉ');
  console.log('========================\n');
  
  if (securityIssues.length === 0) {
    console.log('✅ Aucun problème de sécurité détecté');
    return;
  }
  
  const critical = securityIssues.filter(issue => issue.type === 'CRITICAL');
  const high = securityIssues.filter(issue => issue.type === 'HIGH');
  const medium = securityIssues.filter(issue => issue.type === 'MEDIUM');
  const low = securityIssues.filter(issue => issue.type === 'LOW');
  
  console.log(`🚨 CRITIQUE: ${critical.length}`);
  console.log(`🔴 HAUT: ${high.length}`);
  console.log(`🟡 MOYEN: ${medium.length}`);
  console.log(`🟢 FAIBLE: ${low.length}\n`);
  
  securityIssues.forEach((issue, index) => {
    const icon = {
      'CRITICAL': '🚨',
      'HIGH': '🔴',
      'MEDIUM': '🟡',
      'LOW': '🟢'
    }[issue.type];
    
    console.log(`${icon} ${issue.type}: ${issue.message}`);
    if (issue.file) {
      console.log(`   📁 Fichier: ${issue.file}`);
    }
    if (issue.line) {
      console.log(`   📄 Ligne: ${issue.line}`);
    }
    console.log('');
  });
  
  console.log('💡 RECOMMANDATIONS:');
  console.log('1. Supprimez immédiatement les variables sensibles du package.json');
  console.log('2. Vérifiez que .env.local est dans .gitignore');
  console.log('3. Régénérez les clés Supabase si elles ont été exposées');
  console.log('4. Utilisez des variables d\'environnement sécurisées en production');
}

async function main() {
  console.log('🛡️ AUDIT DE SÉCURITÉ GITHUB/SUPABASE');
  console.log('=====================================\n');
  
  checkEnvironmentVariables();
  checkPackageJson();
  checkGitHistory();
  checkCurrentStatus();
  generateReport();
}

main().catch(console.error); 