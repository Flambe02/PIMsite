import { Canvas } from '@napi-rs/canvas';

// Fonction simple pour convertir un PDF en PNG
// Pour l'instant, nous allons créer une image de placeholder
// car pdfjs-dist pose des problèmes de worker sur le serveur
export async function convertPdfToPng(pdfBuffer: Buffer): Promise<Buffer> {
  try {
    // Créer un canvas avec une taille par défaut
    const canvas = new Canvas(800, 600);
    const context = canvas.getContext('2d');
    
    // Remplir avec un fond blanc
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 800, 600);
    
    // Ajouter du texte pour indiquer que c'est un placeholder
    context.fillStyle = '#000000';
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.fillText('PDF Preview', 400, 250);
    context.font = '16px Arial';
    context.fillText('PDF processing temporarily unavailable', 400, 300);
    context.fillText('File size: ' + (pdfBuffer.length / 1024).toFixed(1) + ' KB', 400, 330);
    
    // Convertir le canvas en buffer PNG
    const pngBuffer = canvas.toBuffer('image/png');
    
    return pngBuffer;
  } catch (error) {
    console.error("PDF conversion error:", error);
    throw new Error(`Failed to convert PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
} 