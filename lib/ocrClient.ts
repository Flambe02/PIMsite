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
      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          apikey: apiKey,
          ...form.getHeaders(),
        },
        body: form,
      });
      const res = await response.json();
      console.log('Réponse OCR.space:', res); // Pour debug
      if (!res) {
        throw new Error('OCR.space a retourné undefined. Vérifiez la clé API et le format du fichier.');
      }
      if (res.IsErroredOnProcessing) {
        throw new Error(`Erreur OCR.space: ${res.ErrorMessage || res.ErrorDetails || 'Erreur inconnue.'}`);
      }
      if (!res.ParsedResults || !Array.isArray(res.ParsedResults) || !res.ParsedResults[0]) {
        throw new Error(`OCR.space n’a pas retourné ParsedResults. Réponse brute: ${JSON.stringify(res)}`);
      }
      return res.ParsedResults[0].ParsedText || '';
    }
    default:
      throw new Error(`Le fournisseur OCR '${provider}' n'est pas supporté.`);
  }
} 