// lib/ocrClient.ts
import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import fetch from 'node-fetch';
import FormData from 'form-data';
type OcrProvider = 'ocrspace';

// OCR local avec Tesseract.js
export async function extractTextWithTesseract(buffer: Buffer, filename: string): Promise<{ text: string, confidence: number | null, duration_ms: number, provider: string }> {
  let fullText = '';
  let confidences: number[] = [];
  const start = Date.now();
  try {
    if (filename.toLowerCase().endsWith('.pdf')) {
      // PDF multipages : traite chaque page
      const metadata = await sharp(buffer).metadata();
      const numPages = metadata.pages ?? 1;
      for (let i = 0; i < numPages; i++) {
        const page = await sharp(buffer, { page: i })
          .resize({ width: 1200, withoutEnlargement: true })
          .grayscale()
          .normalize()
          .png({ compressionLevel: 9 })
          .toBuffer();
        const { data }: { data: any } = await Tesseract.recognize(page, 'por');
        fullText += '\n' + data.text.trim();
        if (Array.isArray(data.words)) {
          confidences.push(...data.words.map((w: any) => w.confidence).filter((c: number) => typeof c === 'number'));
        } else if (typeof data.confidence === 'number') {
          confidences.push(data.confidence);
        }
      }
    } else {
      // Image unique
      let imageBuffer = buffer;
      imageBuffer = await sharp(imageBuffer)
        .grayscale()
        .normalize()
        .resize({ width: 1200, withoutEnlargement: true })
        .png({ compressionLevel: 9 })
        .toBuffer();
      const { data }: { data: any } = await Tesseract.recognize(imageBuffer, 'por');
      fullText = data.text.trim();
      if (Array.isArray(data.words)) {
        confidences.push(...data.words.map((w: any) => w.confidence).filter((c: number) => typeof c === 'number'));
      } else if (typeof data.confidence === 'number') {
        confidences.push(data.confidence);
      }
    }
  } catch (err: any) {
    if (err.message && err.message.includes('unsupported image format')) {
      throw new Error('Le fichier envoyé n\'est pas une image ou un PDF supporté.');
    }
    throw err;
  }
  const duration = Date.now() - start;
  const confidence = confidences.length ? (confidences.reduce((a, b) => a + b, 0) / confidences.length) : null;
  return {
    text: fullText.trim(),
    confidence,
    duration_ms: duration,
    provider: 'tesseract',
  };
}

// Fallback OCR.Space (corrigé pour Node.js)
export async function extractTextWithOcrSpace(buffer: Buffer, filename: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', buffer, { filename });
  formData.append('language', 'por');
  formData.append('isOverlayRequired', 'false');
  formData.append('apikey', process.env.OCR_SPACE_API_KEY!);

  const response = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();
  return result?.ParsedResults?.[0]?.ParsedText || '';
}

// Fonction principale avec switch provider et fallback
export async function extractText(
  buffer: Buffer,
  provider: 'tesseract' | 'ocrspace' = 'tesseract',
  filename: string
): Promise<{ text: string, confidence: number | null, duration_ms: number, provider: string }> {
  try {
    if (provider === 'tesseract') {
      return await extractTextWithTesseract(buffer, filename);
    } else {
      // Pour compatibilité, fallback OCR.space retourne juste le texte
      const text = await extractTextWithOcrSpace(buffer, filename);
      return { text, confidence: null, duration_ms: 0, provider: 'ocrspace' };
    }
  } catch (err) {
    console.error('OCR failed with provider:', provider, err);
    if (provider !== 'ocrspace') {
      console.warn('Trying fallback OCR.space...');
      const text = await extractTextWithOcrSpace(buffer, filename);
      return { text, confidence: null, duration_ms: 0, provider: 'ocrspace' };
    }
    throw new Error('OCR failed completely.');
  }
} 