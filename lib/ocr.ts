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

export async function parseWithOCRSpaceEnhanced(file: File | Buffer) {
  const key = process.env.NEXT_PUBLIC_OCR_SPACE_KEY ?? "helloworld";
  let buf: Buffer;
  if (typeof Buffer !== "undefined" && file instanceof Buffer) {
    buf = file;
  } else if (typeof File !== "undefined" && file instanceof File) {
    buf = Buffer.from(await file.arrayBuffer());
  } else {
    throw new Error("Unsupported file type");
  }

  // PDF ? => convert via API
  const isPdf = buf.slice(0, 4).toString("hex") === "25504446";
  let img: Buffer;
  
  if (isPdf) {
    const formData = new FormData();
    formData.append("file", new Blob([buf]), "document.pdf");
    
    const response = await fetch("/api/convert-pdf", {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Failed to convert PDF");
    }
    
    img = Buffer.from(await response.arrayBuffer());
  } else {
    img = buf;
  }

  const form = new FormData();
  form.append("file", new Blob([img]), "page.png");
  form.append("language", "por");
  form.append("isTable", "true");
  form.append("scale", "true");
  form.append("OCREngine", "2");
  form.append("isOverlayRequired", "true");

  const res = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: { apikey: key },
    body: form,
  }).then(r => r.json() as Promise<{ ParsedResults: { ParsedText: string; TextOverlay: { Lines: unknown[] } }[]; ErrorMessage: string }>);

  if (!res.ParsedResults?.[0]?.ParsedText) throw new Error(res.ErrorMessage || "OCR failed");
  return res.ParsedResults[0]; // { ParsedText, TextOverlay, … }
} 