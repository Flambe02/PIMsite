/**
 * Service Google Cloud Vision pour l'OCR du module SCAN NEW PIM
 * Gestion de l'extraction de texte avec Google Vision API
 */

export interface GoogleVisionConfig {
  apiKey: string;
  timeout: number;
  retryCount: number;
  maxFileSize: number;
}

export interface ScanResult {
  success: boolean;
  text: string;
  confidence: number;
  error?: string;
  processingTime: number;
}

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  isPayslip: boolean;
  missingFields: string[];
  suggestions: string[];
}

export class GoogleVisionService {
  private config: GoogleVisionConfig;
  private baseUrl = 'https://vision.googleapis.com/v1/images:annotate';

  constructor(config?: Partial<GoogleVisionConfig>) {
    this.config = {
      apiKey: process.env.GOOGLE_VISION_API_KEY || '',
      timeout: 15000, // 15 secondes
      retryCount: 1,
      maxFileSize: 2 * 1024 * 1024, // 2MB
      ...config
    };
  }

  /**
   * Scanne un document avec Google Vision OCR
   */
  async scanDocument(file: File): Promise<ScanResult> {
    const startTime = Date.now();

    try {
      // Validation du fichier
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return {
          success: false,
          text: '',
          confidence: 0,
          error: validation.error,
          processingTime: Date.now() - startTime
        };
      }

      // Conversion du fichier en base64
      const base64Data = await this.fileToBase64(file);
      
      // Appel à l'API Google Vision
      const response = await this.callGoogleVisionAPI(base64Data);
      
      // Traitement de la réponse
      const scanResult = this.processVisionResponse(response, Date.now() - startTime);

      // Si l'OCR a réussi, valider que c'est bien un holerite
      if (scanResult.success && scanResult.text) {
        const documentValidation = await this.validateDocument(scanResult.text);
        
        if (!documentValidation.isPayslip) {
          return {
            success: false,
            text: scanResult.text,
            confidence: documentValidation.confidence,
            error: 'O documento fornecido não parece ser um holerite reconhecido. Verifique o formato ou tente outro arquivo.',
            processingTime: Date.now() - startTime
          };
        }
      }

      return scanResult;

    } catch (error) {
      console.error('❌ Erreur Google Vision:', error);
      
      // Retry en cas d'erreur réseau
      if (this.config.retryCount > 0) {
        console.log('🔄 Tentative de retry...');
        return await this.retryScan(file);
      }

      return {
        success: false,
        text: '',
        confidence: 0,
        error: 'O scan falhou, tente novamente com um documento mais nítido ou formato PDF nativo.',
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Valide un fichier avant scan
   */
  private validateFile(file: File): { isValid: boolean; error?: string } {
    // Vérification de la taille
    if (file.size > this.config.maxFileSize) {
      return {
        isValid: false,
        error: 'Arquivo muito grande (máximo 2MB)'
      };
    }

    // Vérification du type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Formato não suportado (apenas JPG, PNG, PDF)'
      };
    }

    return { isValid: true };
  }

  /**
   * Convertit un fichier en base64
   */
  private async fileToBase64(file: File): Promise<string> {
    // Vérifier si nous sommes côté serveur (Node.js)
    if (typeof window === 'undefined') {
      // Côté serveur - utiliser Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return buffer.toString('base64');
    } else {
      // Côté client - utiliser FileReader
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1]; // Enlever le préfixe data:image/...
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  }

  /**
   * Appel à l'API Google Vision
   */
  private async callGoogleVisionAPI(base64Data: string): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Data
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 1
                }
              ]
            }
          ]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Google Vision API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Traite la réponse de Google Vision
   */
  private processVisionResponse(response: any, processingTime: number): ScanResult {
    try {
      const annotations = response.responses?.[0]?.textAnnotations;
      
      if (!annotations || annotations.length === 0) {
        return {
          success: false,
          text: '',
          confidence: 0,
          error: 'Aucun texte détecté dans le document',
          processingTime
        };
      }

      // Le premier élément contient tout le texte
      const fullText = annotations[0].description || '';
      
      // Calculer un score de confiance basé sur la quantité de texte
      const confidence = Math.min(fullText.length / 1000, 1.0); // Max 1.0

      return {
        success: true,
        text: fullText,
        confidence,
        processingTime
      };

    } catch (error) {
      console.error('❌ Erreur traitement réponse Google Vision:', error);
      return {
        success: false,
        text: '',
        confidence: 0,
        error: 'Erreur lors du traitement du scan',
        processingTime
      };
    }
  }

  /**
   * Retry en cas d'échec
   */
  private async retryScan(file: File): Promise<ScanResult> {
    console.log('🔄 Retry Google Vision...');
    
    try {
      const base64Data = await this.fileToBase64(file);
      const response = await this.callGoogleVisionAPI(base64Data);
      return this.processVisionResponse(response, 0);
      
    } catch (error) {
      console.error('❌ Retry échoué:', error);
      return {
        success: false,
        text: '',
        confidence: 0,
        error: 'Le scan a échoué après retry, veuillez réessayer avec un document plus net.',
        processingTime: 0
      };
    }
  }

  /**
   * Valide si le texte extrait ressemble à une feuille de paie
   */
  async validateDocument(text: string): Promise<ValidationResult> {
    const payslipKeywords = [
      // Mots-clés principaux (Brésil)
      'salário', 'pagamento', 'funcionário', 'empresa', 'período', 'bruto', 'líquido', 'descontos',
      // Mots-clés secondaires
      'comprovante', 'recibo', 'holerite', 'contracheque', 'cargo', 'função', 'benefícios',
      // Mots-clés internationaux
      'salary', 'payment', 'employee', 'company', 'period', 'gross', 'net', 'deductions',
      'salaire', 'paiement', 'employé', 'entreprise', 'période', 'brut', 'déductions',
      // Mots-clés génériques
      'remuneração', 'vencimentos', 'proventos', 'descontos', 'abatimentos', 'retenções'
    ];

    const textLower = text.toLowerCase();
    const foundKeywords = payslipKeywords.filter(keyword => 
      textLower.includes(keyword.toLowerCase())
    );

    // Calculer un score de confiance plus généreux
    const confidence = Math.min(foundKeywords.length / 8, 1.0); // Au moins 8 mots-clés sur 25+
    const isPayslip = confidence > 0.2; // Seuil réduit de 0.3 à 0.2

    const missingFields = payslipKeywords.filter(keyword => 
      !textLower.includes(keyword.toLowerCase())
    );

    return {
      isValid: isPayslip,
      confidence,
      isPayslip,
      missingFields,
      suggestions: isPayslip ? [] : [
        'Verifique se o documento é realmente um holerite (contracheque)',
        'Certifique-se de que o documento está legível e completo',
        'Tente com um documento mais recente ou melhor digitalizado',
        'Formatos aceitos: JPG, PNG, PDF (máximo 2MB)',
        'O documento deve conter informações de salário, empresa e funcionário'
      ]
    };
  }
}

// Instance par défaut
export const googleVisionService = new GoogleVisionService(); 