/**
 * Appelle l'API OCR.Space (clé "helloworld" par défaut) et renvoie :
 *  • rawText : tout le texte du bulletin
 *  • lines   : tableau de lignes OCR avec leurs coordonnées
 */
export async function parseWithOCRSpace(file: File) {
  const form = new FormData();
  form.append("language", "por");          // portugais
  form.append("isOverlayRequired", "true"); // ← récupère les blocs + coords
  form.append("isTable", "true");           // aide pour colonnes
  form.append("scale", "true");             // meilleur rendu PDF → image
  form.append("OCREngine", "2");            // moteur 2 = le plus précis
  form.append("file", file);

  const res = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: {
      apikey: process.env.OCR_SPACE_KEY ?? "helloworld", // clé env si dispo
    },
    body: form,
  });

  if (!res.ok) throw new Error(`OCR.Space HTTP ${res.status}`);

  const { ParsedResults, IsErroredOnProcessing, ErrorMessage } = await res.json();
  if (IsErroredOnProcessing) throw new Error(`OCR error: ${ErrorMessage}`);

  const first = ParsedResults?.[0] ?? {};
  return {
    rawText: first.ParsedText ?? "",
    lines: first.TextOverlay?.Lines ?? [],
  };
} 