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
    console.log('🚀 Début du traitement du holerite...');
    
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) throw new Error('Fichier manquant.');
    
    console.log('📁 Fichier reçu:', file.name, 'Taille:', file.size, 'Type:', file.type);
    
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // === DEBUG OCR BUFFER ===
    console.log('Taille du buffer envoyé à OCR:', fileBuffer.length);
    console.log('Premiers octets:', fileBuffer.slice(0, 16));
    console.log('Nom du fichier original:', file.name, 'Type:', file.type);
    // ========================

    if (!fileBuffer || fileBuffer.length === 0) throw new Error('Le fichier est vide ou non lisible.');

    console.log('🔍 Début de l\'extraction OCR...');
    // Passe le nom de fichier à extractText
    const payslipText = await extractText(fileBuffer, 'ocrspace', file.name);
    console.log('✅ OCR terminé, longueur du texte:', payslipText.length);
    
    if (!payslipText || payslipText.trim().length < 50) {
      throw new Error("L'OCR n'a pas pu extraire suffisamment de texte. Le fichier pourrait être illisible ou protégé.");
    }
    
    console.log('🤖 Début de l\'analyse IA...');
    const model = "gpt-4o";
    const llmResponse = await openai.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: payslipAnalysisPrompt },
        { role: "user", content: `Voici le texte du bulletin à analyser:\n\n${payslipText}` }
      ],
    });
    
    console.log('✅ Réponse IA reçue');
    
    const jsonResponse = llmResponse.choices[0].message.content;
    if (!jsonResponse) throw new Error("Le LLM a retourné une réponse vide.");
    
    console.log('🔧 Parsing de la réponse JSON...');
    const parsedData = JSON.parse(jsonResponse);
    console.log('✅ Données parsées avec succès');
    
    console.log('💾 Sauvegarde dans Supabase...');
    const { data: analysisRecord, error } = await supabase
      .from('analyses')
      .insert({ 
        user_id: session.user.id, 
        file_name: file.name, 
        raw_text: payslipText, 
        model_used: model, 
        data: parsedData,
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('❌ Erreur Supabase:', error);
      throw error;
    }
    
    console.log('✅ Analyse complète avec succès, ID:', analysisRecord.id);
    
    return NextResponse.json({ 
      success: true, 
      analysisId: analysisRecord.id, 
      analysisData: parsedData 
    });
    
  } catch (error) {
    console.error('❌ Erreur détaillée dans /api/process-payslip:', error);
    
    // Gestion spécifique des erreurs OCR
    let errorMessage = 'Erreur interne du serveur.';
    if (error instanceof Error) {
      if (error.message.includes('E101')) {
        errorMessage = 'Le service OCR a mis trop de temps à répondre. Essayez avec un fichier plus simple ou plus petit.';
      } else if (error.message.toLowerCase().includes('ocr')) {
        errorMessage = 'Erreur lors de l\'extraction du texte du holerite. Vérifiez que le fichier est lisible et non protégé.';
      } else if (error.message.includes('LLM') || error.message.includes('IA')) {
        errorMessage = 'Erreur lors de l\'analyse IA. Réessayez dans quelques instants.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      {
        error: errorMessage,
        details: error && typeof error === 'object' ? JSON.stringify(error) : String(error)
      },
      { status: 500 }
    );
  }
} 