import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { payslipAnalysisPrompt } from '@/lib/prompts';
import { extractText } from '@/lib/ocrClient';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) throw new Error('Fichier manquant.');
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // === DEBUG OCR BUFFER ===
    console.log('Taille du buffer envoyé à OCR:', fileBuffer.length);
    console.log('Premiers octets:', fileBuffer.slice(0, 16));
    // ========================

    if (!fileBuffer || fileBuffer.length === 0) throw new Error('Le fichier est vide ou non lisible.');

    const model = "gpt-4o";
    const payslipText = await extractText(fileBuffer);
    if (!payslipText) throw new Error("L'OCR n'a pas pu extraire de texte.");
    const llmResponse = await openai.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: payslipAnalysisPrompt },
        { role: "user", content: `Voici le texte du bulletin à analyser:\n\n${payslipText}` }
      ],
    });
    const jsonResponse = llmResponse.choices[0].message.content;
    if (!jsonResponse) throw new Error("Le LLM a retourné une réponse vide.");
    const parsedData = JSON.parse(jsonResponse);
    const { data: analysisRecord, error } = await supabase
      .from('analyses')
      .insert({ user_id: session.user.id, file_name: file.name, raw_text: payslipText, model_used: model, data: parsedData })
      .select('id')
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, analysisId: analysisRecord.id, analysisData: parsedData });
  } catch (error) {
    console.error('Erreur détaillée dans /api/process-payslip:', error);
    return NextResponse.json(
      {
        error: 'Erreur interne du serveur.',
        details: error && typeof error === 'object' ? JSON.stringify(error) : String(error)
      },
      { status: 500 }
    );
  }
} 