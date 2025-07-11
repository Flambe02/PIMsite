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
    const ocrResult = await extractText(fileBuffer, 'tesseract', file.name);
    const payslipText = ocrResult.text;
    console.log('✅ OCR terminé, longueur du texte:', payslipText.length);
    console.log('📊 Métriques OCR:', {
      provider: ocrResult.provider,
      confidence: ocrResult.confidence,
      duration_ms: ocrResult.duration_ms
    });
    
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
    // Enregistrement dans la table analyses (historique)
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

    // Log du JSON analysé avant insertion dans holerites
    console.log('🔎 JSON analysé à insérer dans holerites:', JSON.stringify(parsedData, null, 2));
    // Enregistrement dans la table holerites (pour dashboard)
    const { data: holeriteData, error: holeriteError } = await supabase
      .from('holerites')
      .insert({
        user_id: session.user.id,
        structured_data: parsedData,
        nome: parsedData.employee_name || '',
        empresa: parsedData.company_name || '',
        perfil: parsedData.profile_type || '',
        salario_bruto: parsedData.gross_salary || null,
        salario_liquido: parsedData.net_salary || null,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();
    if (holeriteError) {
      console.error('❌ Erreur insertion holerites:', holeriteError);
      // On ne bloque pas la réponse, mais on peut l'indiquer côté client si besoin
    }

    // Insertion des résultats OCR dans la table ocr_results
    if (holeriteData?.id) {
      const { error: ocrError } = await supabase
        .from('ocr_results')
        .insert({
          holerite_id: holeriteData.id,
          provider: ocrResult.provider,
          raw_text: ocrResult.text,
          confidence: ocrResult.confidence,
          duration_ms: ocrResult.duration_ms,
        });
      
      if (ocrError) {
        console.error('❌ Erreur insertion ocr_results:', ocrError);
        // On ne bloque pas la réponse, mais on log l'erreur
      } else {
        console.log('✅ Résultats OCR sauvegardés avec succès');
      }
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