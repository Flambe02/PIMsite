// lib/ocrClient.ts
import fetch from 'node-fetch';
import FormData from 'form-data';
type OcrProvider = 'ocrspace';

export async function extractText(buffer: Buffer, provider: OcrProvider = 'ocrspace'): Promise<string> {
  switch (provider) {
    case 'ocrspace': {
      const apiKey = process.env.OCR_SPACE_API_KEY;
      if (!apiKey) throw new Error('La clé API OCR.space est manquante.');
      const form = new FormData();
      form.append('file', buffer, { filename: 'payslip.pdf', contentType: 'application/pdf' });
      form.append('OCREngine', '2');
      form.append('isTable', 'true');
      // Ajout d'un timeout de 20s sur l'appel OCR
      // On utilise Promise<any> pour compatibilité node-fetch/Response
      const fetchWithTimeout = (url: string, options: any, timeout = 20000): Promise<any> => {
        return Promise.race([
          fetch(url, options),
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Le service OCR a mis trop de temps à répondre.')), timeout))
        ]);
      };
      let response: any;
      try {
        response = await fetchWithTimeout('https://api.ocr.space/parse/image', {
          method: 'POST',
          headers: {
            apikey: apiKey,
            ...form.getHeaders(),
          },
          body: form,
        });
      } catch (err) {
        throw new Error((err as Error).message || 'Le service OCR a mis trop de temps à répondre.');
      }
      const res = await response.json();
      console.log('Réponse OCR.space:', res); // Pour debug
      if (!res) {
        throw new Error('OCR.space a retourné undefined. Vérifiez la clé API et le format du fichier.');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((res as any).IsErroredOnProcessing) {
        throw new Error(`Erreur OCR.space: ${(res as any).ErrorMessage || (res as any).ErrorDetails || 'Erreur inconnue.'}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(res as any).ParsedResults || !Array.isArray((res as any).ParsedResults) || !(res as any).ParsedResults[0]) {
        throw new Error(`OCR.space n’a pas retourné ParsedResults. Réponse brute: ${JSON.stringify(res)}`);
      }
      return (res as any).ParsedResults[0].ParsedText || '';
    }
    default:
      throw new Error(`Le fournisseur OCR '${provider}' n'est pas supporté.`);
  }
} 