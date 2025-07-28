/**
 * Test direct de l'API Google Vision
 */

import 'dotenv/config';

async function testGoogleVisionAPI() {
  console.log('🧪 Test direct de l\'API Google Vision');
  console.log('======================================');

  const apiKey = process.env.GOOGLE_VISION_API_KEY;
  
  if (!apiKey) {
    console.log('❌ Clé API manquante');
    return;
  }

  console.log('🔑 Clé API:', apiKey.substring(0, 20) + '...');

  // Test simple avec une image base64
  const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='; // 1x1 pixel transparent

  try {
    console.log('📡 Test de connexion à l\'API...');
    
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: testImageBase64
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 1
              }
            ]
          }
        ]
      })
    });

    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API accessible');
      console.log('📋 Réponse:', JSON.stringify(data, null, 2));
    } else {
      const errorData = await response.text();
      console.log('❌ Erreur API:', errorData);
      
      if (response.status === 403) {
        console.log('\n🔧 Solutions possibles :');
        console.log('1. Vérifier que l\'API Vision est activée dans Google Cloud Console');
        console.log('2. Vérifier que la clé API a les bonnes permissions');
        console.log('3. Vérifier les quotas et limites');
        console.log('4. Vérifier les restrictions de domaine/IP');
      }
    }

  } catch (error) {
    console.error('❌ Erreur réseau:', error);
  }
}

testGoogleVisionAPI().catch(console.error); 