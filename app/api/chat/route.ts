import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

console.log('DEBUG OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Format de messages invalide' }, { status: 400 });
    }

    const systemPrompt = "Tu es Pim, un assistant expert en paie brésilienne. Tu es bienveillant, pédagogue et tu vulgarises les concepts complexes pour aider les utilisateurs à comprendre leur bulletin de paie. Réponds de manière concise et amicale.";

    const llmResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    });

    const responseMessage = llmResponse.choices[0].message.content;
    if (!responseMessage) {
      return NextResponse.json({ error: 'Le LLM a retourné une réponse vide.' }, { status: 500 });
    }

    // Tentative de sauvegarde si l'utilisateur est connecté
    try {
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const finalMessages = [...messages, { role: 'assistant', content: responseMessage }];
        const { error } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: session.user.id,
            title: messages.find((m: { role: string; content: string }) => m.role === 'user')?.content.substring(0, 50) || 'Nouvelle conversation',
            messages: finalMessages
          });

        if (error) {
          console.error('Erreur lors de la sauvegarde de la conversation:', error);
        }
      }
    } catch (dbError) {
      console.error('Erreur de base de données:', dbError);
      // Ne pas faire échouer la requête si la DB échoue
    }

    return NextResponse.json({ reply: responseMessage });

  } catch (error) {
    console.error('Erreur dans /api/chat:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
} 