export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Instrumentation pour le serveur Node.js
    console.log('🔧 Instrumentation Node.js chargée');
  }
  
  if (process.env.NEXT_RUNTIME === 'edge') {
    // Instrumentation pour Edge Runtime
    console.log('🔧 Instrumentation Edge chargée');
  }
}
