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

// Texte de fallback pour les tests
const FALLBACK_TEXT = `
EMPREGADOR: Test Company Ltda
Recibo de Pagamento de Salário
Nome: Test User
Referente ao Mês: Janeiro/2025
Função: Desenvolvedor Test

Salário Base: R$ 5.000,00
Total Vencimentos: R$ 5.000,00
Total Descontos: R$ 1.200,00
Líquido a Receber: R$ 3.800,00

DESCONTOS:
INSS: R$ 400,00
IRRF: R$ 300,00
Plano de Saúde: R$ 200,00
Vale Refeição: R$ 300,00

BENEFÍCIOS:
Vale Transporte: R$ 150,00
FGTS: R$ 400,00
`;

export async function parseWithOCRSpaceEnhanced(file: File | Buffer, enableFallback: boolean = false) {
  // Essayer d'abord la clé payante, puis la clé gratuite, puis la nouvelle clé
  const paidKey = process.env.OCR_SPACE_PAID_KEY;
  const freeKey = process.env.NEXT_PUBLIC_OCR_SPACE_KEY;
  const newKey = "K85784560988957"; // Nouvelle clé fournie
  const key = paidKey || freeKey || newKey || "helloworld";
  
  console.log('🔑 Clé OCR utilisée:', 
    key === "helloworld" ? "clé gratuite par défaut" : 
    key === newKey ? "nouvelle clé fournie" :
    paidKey ? "clé payante" : 
    "clé personnalisée");
  
  let buf: Buffer;
  if (typeof Buffer !== "undefined" && file instanceof Buffer) {
    buf = file;
  } else if (typeof File !== "undefined" && file instanceof File) {
    buf = Buffer.from(await file.arrayBuffer());
  } else {
    throw new Error("Unsupported file type");
  }

  console.log('📁 Taille du fichier:', buf.length, 'bytes');

  // PDF ? => convert via API
  const isPdf = buf.slice(0, 4).toString("hex") === "25504446";
  let img: Buffer;
  
  if (isPdf) {
    console.log('📄 Fichier PDF détecté, conversion en cours...');
    const formData = new FormData();
    formData.append("file", new Blob([buf as ArrayBuffer]), "document.pdf");
    
    const response = await fetch("/api/convert-pdf", {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Failed to convert PDF");
    }
    
    img = Buffer.from(await response.arrayBuffer());
    console.log('✅ PDF converti en image');
  } else {
    img = buf;
    console.log('🖼️ Fichier image détecté');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondes timeout (réduit de 45s)
    
    const form = new FormData();
    form.append("apikey", key);
    form.append("language", "por");
    form.append("isTable", "true");
    form.append("scale", "true");
    form.append("OCREngine", "2");
    form.append("filetype", "jpg"); // Spécifier le type de fichier
    form.append("detectOrientation", "true"); // Détecter l'orientation
    form.append("removeTextLayer", "false"); // Garder la couche de texte
    form.append("file", new Blob([buf as ArrayBuffer]), "image.jpg");

    console.log('🚀 Envoi vers OCR.Space...');
    
    const res = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: { apikey: key },
      body: form,
      signal: controller.signal,
    }).then(r => r.json() as Promise<{ 
      ParsedResults: { ParsedText: string; TextOverlay: { Lines: unknown[] } }[]; 
      ErrorMessage: string;
      IsErroredOnProcessing?: boolean;
    }>);

    clearTimeout(timeoutId);
    console.log('✅ Réponse OCR reçue');

    if (res.IsErroredOnProcessing) {
      throw new Error(`OCR.Space error: ${res.ErrorMessage}`);
    }

    if (!res.ParsedResults?.[0]?.ParsedText) {
      console.error('❌ Pas de texte extrait:', res);
      throw new Error(res.ErrorMessage || "OCR failed - no text extracted");
    }

    const result = res.ParsedResults[0];
    console.log('📝 Texte extrait:', result.ParsedText.length, 'caractères');
    
    return result; // { ParsedText, TextOverlay, … }
    
  } catch (error) {
    console.error('❌ Erreur OCR:', error);
    
    // DÉSACTIVATION DU FALLBACK - Faire échouer l'OCR proprement
    console.log('❌ OCR échoué, process annulé');
    throw new Error(`OCR failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    // FALLBACK TEMPORAIRE - Rétablir pour que le système fonctionne
    // console.log('🔄 Utilisation du texte de fallback (OCR temporairement indisponible)...');
    // return {
    //   ParsedText: FALLBACK_TEXT,
    //   TextOverlay: { Lines: [] }
    // };
  }
} 