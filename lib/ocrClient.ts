// lib/ocrClient.ts
import fetch from 'node-fetch';
import FormData from 'form-data';
type OcrProvider = 'ocrspace';

export async function extractText(buffer: Buffer, provider: OcrProvider = 'ocrspace', filename?: string): Promise<string> {
  switch (provider) {
    case 'ocrspace': {
      const apiKey = process.env.OCR_SPACE_API_KEY;
      if (!apiKey) throw new Error('La clé API OCR.space est manquante.');
      const form = new FormData();
      // Utilise le nom de fichier original si fourni
      form.append('file', buffer, { filename: filename || 'payslip.pdf', contentType: 'application/pdf' });
      form.append('OCREngine', '2');
      form.append('isTable', 'true');
      form.append('language', 'por'); // Portugais
      form.append('scale', 'true'); // Améliore la qualité
      form.append('detectOrientation', 'true'); // Détecte l'orientation

      // Log headers pour debug
      const headers = {
        apikey: apiKey,
        'User-Agent': 'Mozilla/5.0 (compatible; PIMBot/1.0)',
        ...form.getHeaders(),
      };
      console.log('Headers envoyés à OCR.space:', headers);

      // Augmentation du timeout à 60 secondes pour les gros fichiers
      const fetchWithTimeout = (url: string, options: any, timeout = 60000): Promise<any> => {
        return Promise.race([
          fetch(url, options),
          new Promise<any>((_, reject) => 
            setTimeout(() => reject(new Error('E101: Le service OCR a mis trop de temps à répondre (60s). Essayez avec un fichier plus simple.')), timeout)
          )
        ]);
      };

      let response: any;
      try {
        console.log('Envoi du fichier à OCR.space...');
        response = await fetchWithTimeout('https://api.ocr.space/parse/image', {
          method: 'POST',
          headers,
          body: form,
        });
        console.log('Réponse reçue d\'OCR.space');
      } catch (err) {
        console.error('Erreur lors de l\'appel OCR.space:', err);
        throw new Error((err as Error).message || 'E101: Le service OCR a mis trop de temps à répondre.');
      }

      const res = await response.json();
      console.log('Réponse OCR.space:', res); // Pour debug

      if (!res) {
        throw new Error('OCR.space a retourné undefined. Vérifiez la clé API et le format du fichier.');
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((res as any).IsErroredOnProcessing) {
        const errorMsg = (res as any).ErrorMessage || (res as any).ErrorDetails || 'Erreur inconnue.';
        console.error('Erreur OCR.space:', errorMsg, 'Réponse complète:', res);
        throw new Error(`Erreur OCR.space: ${errorMsg}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(res as any).ParsedResults || !Array.isArray((res as any).ParsedResults) || !(res as any).ParsedResults[0]) {
        console.error('Réponse OCR.space invalide:', res);
        throw new Error(`OCR.space n'a pas retourné ParsedResults. Réponse brute: ${JSON.stringify(res)}`);
      }

      const parsedText = (res as any).ParsedResults[0].ParsedText || '';
      console.log('Texte extrait avec succès, longueur:', parsedText.length);
      return parsedText;
    }
    default:
      throw new Error(`Le fournisseur OCR '${provider}' n'est pas supporté.`);
  }
} 