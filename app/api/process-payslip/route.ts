import { type NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { createClient } from "@/lib/supabase/server";
import { newUploadId } from "@/lib/utils";
import { parsePayslipWithRegexV2 } from "@/lib/payroll-parser";
import { convertPdfToPng } from "@/lib/pdfConverter";
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';

export async function POST(request: NextRequest) {
  try {
    console.log("Chemin des credentials Google:", process.env.GOOGLE_APPLICATION_CREDENTIALS);
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Fichier non fourni ou invalide." }, { status: 400 });
    }

    // Création du client admin Supabase pour l'upload
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Supabase admin credentials missing" }, { status: 500 });
    }
    const supabaseAdmin = createSupabaseAdminClient(supabaseUrl, supabaseServiceKey);

    // Client utilisateur pour le reste
    const supabase = await createClient();
    // a. Obtenir l'utilisateur authentifié
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // b. Uploader le fichier sur Supabase Storage avec le client admin
    const fileName = `${newUploadId()}-${file.name}`;
    const filePath = `user_uploads/${user.id}/${fileName}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("payslips")
      .upload(filePath, file, {
        contentType: file.type,
      });
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin
      .storage.from("payslips")
      .getPublicUrl(filePath);
    const publicUrl = urlData?.publicUrl;
    if (!publicUrl) {
      console.error('Failed to get public URL for uploaded file');
      return NextResponse.json({ error: "Failed to generate public URL for uploaded file" }, { status: 500 });
    }
    // Validate URL format
    try {
      new URL(publicUrl);
    } catch (urlError) {
      console.error('Invalid public URL generated:', publicUrl);
      return NextResponse.json({ error: "Invalid public URL generated" }, { status: 500 });
    }

    // c. Convertir PDF en PNG si nécessaire
    let fileToProcess = file;
    if (file.type === 'application/pdf') {
      const pdfBuffer = Buffer.from(await file.arrayBuffer());
      const pngBuffer = await convertPdfToPng(pdfBuffer);
      fileToProcess = new File([pngBuffer], file.name.replace('.pdf', '.png'), { type: 'image/png' });
    }

    // --- NOUVEL OCR : Google Cloud Document AI ---
    const buffer = Buffer.from(await fileToProcess.arrayBuffer());
    const projectId = process.env.GCLOUD_PROJECT_ID;
    const location = 'us'; // ou 'eu' selon la région de ton processor
    const processorId = process.env.GCP_PROCESSOR_ID;
    if (!projectId) {
      throw new Error('GCLOUD_PROJECT_ID non défini dans les variables d\'environnement');
    }
    if (!processorId) {
      throw new Error('GCP_PROCESSOR_ID non défini dans les variables d\'environnement');
    }
    const client = new DocumentProcessorServiceClient();
    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
    const docaiRequest = {
      name,
      rawDocument: {
        content: buffer,
        mimeType: fileToProcess.type || 'application/pdf',
      },
    };
    const [result] = await client.processDocument(docaiRequest);
    const document = result.document;
    if (!document) {
      return NextResponse.json({ error: "Document AI n'a pas retourné de document." }, { status: 500 });
    }
    console.log('RÉPONSE COMPLÈTE DOCUMENT AI:', JSON.stringify(document, null, 2));

    // --- ROBUST HYBRID PARSING STRATEGY ---
    const docText = document.text || "";
    const lines = docText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const entities = document.entities || [];

    // Helper: fallback to entity if regex fails
    const getEntity = (type: string) => {
      const found = entities.find(e => e.type?.toLowerCase().includes(type));
      return found?.mentionText || '';
    };

    // Helper: clean monetary value
    const cleanMoney = (val: string) => val.replace(/r\$|\s/gi, '').replace(/\./g, '').replace(',', '.');

    // Hybrid extraction function for a field
    function extractField({ regex, entityTypes, clean = false }: { regex: RegExp, entityTypes: string[], clean?: boolean }): string {
      let value = '';
      for (const line of lines) {
        const match = line.match(regex);
        if (match && match[1]) {
          value = match[1].trim();
          break;
        }
      }
      if (!value) {
        for (const type of entityTypes) {
          value = getEntity(type);
          if (value) break;
        }
      }
      if (clean && value) value = cleanMoney(value);
      return value || '';
    }

    // Build the final data object
    const parsedData = {
      folha_pagamento: {
        totaux: {
          salario_base: extractField({
            regex: /sal[aá]rio base\s*[:\-]?\s*([\d\.]+,[\d]{2})/i,
            entityTypes: ['base_salary', 'gross_pay', 'salary'],
            clean: true
          }) || null,
          inss: extractField({
            regex: /(?:i\.n\.s\.s\.|inss)[^\d]*([\d\.]+,[\d]{2})/i,
            entityTypes: ['inss', 'social_security', 'social_security_tax'],
            clean: true
          }) || null,
          irrf: extractField({
            regex: /(?:irrf|imposto de renda|i\.r\.r\.f\.)([^\d]*)([\d\.]+,[\d]{2})/i,
            entityTypes: ['irrf', 'income_tax', 'tax'],
            clean: true
          }) || null,
          salario_liquido: extractField({
            regex: /sal[aá]rio l[ií]quido\s*[:\-]?\s*([\d\.]+,[\d]{2})/i,
            entityTypes: ['net_pay', 'net_salary', 'take_home_pay'],
            clean: true
          }) || null,
        }
      },
      colaborador: {
        nome: extractField({
          regex: /nome do funcion[aá]rio\s*[:\-]?\s*([A-ZÀ-ÿ][A-Za-zÀ-ÿ'\- ]+)/i,
          entityTypes: ['employee_name', 'worker_name', 'name']
        }) || null,
      },
      empresa: {
        nome: (() => {
          // Try regex near CNPJ
          for (let i = 0; i < lines.length; i++) {
            if (/cnpj/i.test(lines[i])) {
              if (i > 0 && lines[i-1].length > 3) return lines[i-1].trim();
              if (i+1 < lines.length && lines[i+1].length > 3) return lines[i+1].trim();
            }
          }
          // Fallback to entity
          return getEntity('employer_name') || getEntity('company_name') || getEntity('business_name') || '';
        })() || null,
      },
    };

    // e. Insérer les données finales dans la table holerites de Supabase
    const dataToInsert = {
      user_id: user.id,
      preview_url: publicUrl,
      salario_base: parsedData.folha_pagamento?.totaux?.salario_base === '' ? null : parsedData.folha_pagamento?.totaux?.salario_base,
      inss: parsedData.folha_pagamento?.totaux?.inss === '' ? null : parsedData.folha_pagamento?.totaux?.inss,
      irrf: parsedData.folha_pagamento?.totaux?.irrf === '' ? null : parsedData.folha_pagamento?.totaux?.irrf,
      salario_liquido: parsedData.folha_pagamento?.totaux?.salario_liquido === '' ? null : parsedData.folha_pagamento?.totaux?.salario_liquido,
      structured_data: parsedData,
    };
    const { error: insertError } = await supabase.from("holerites").insert(dataToInsert);
    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // f. Renvoyer une réponse de succès au client
    return NextResponse.json({
      success: true,
      data: parsedData,
      uploadId: fileName,
      previewUrl: publicUrl
    });
  } catch (error: any) {
    console.error("Erreur dans process-payslip:", error);
    return NextResponse.json({ error: error.message || "Une erreur inconnue est survenue." }, { status: 500 });
  }
} 