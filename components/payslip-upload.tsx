"use client"

import { useState, useTransition } from "react"
import { Upload, FileText, AlertCircle, CheckCircle, Loader2, Scan, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useParams } from "next/navigation";

export function PayslipUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPending] = useTransition()
  const [loading, setLoading] = useState(false)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const locale = typeof params?.locale === 'string' ? params.locale : (Array.isArray(params?.locale) ? params.locale[0] : 'br');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        setError('Tipo de arquivo não suportado. Utilize PDF, JPG ou PNG.')
        setSelectedFile(null)
        return
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        setError('Arquivo muito grande. Tamanho máximo: 10MB')
        setSelectedFile(null)
        return
      }

      setSelectedFile(file)
      setError(null)
      setSuccess(null)
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setSelectedFile(file);
    setLoading(true);
    setOcrLoading(true);
    setAiLoading(false);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('📤 Upload du fichier:', file.name);
      
      const response = await fetch('/api/process-payslip', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Erreur API:', result);
        
        // Gestion spécifique des erreurs OCR
        if (result.error === 'OCR_FAILED') {
          setError(`❌ Erreur OCR: ${result.message || 'Le service OCR est temporairement indisponible. Veuillez réessayer avec une image plus claire.'}`);
          setOcrLoading(false);
          setAiLoading(false);
          setLoading(false);
          return;
        }
        
        // Gestion des erreurs 500 (OCR timeout)
        if (response.status === 500) {
          setError('❌ Erreur OCR: Le service OCR a pris trop de temps à répondre. Veuillez réessayer avec une image plus petite ou plus claire.');
          setOcrLoading(false);
          setAiLoading(false);
          setLoading(false);
          return;
        }
        
        setError(`❌ Erreur: ${result.error || 'Erreur inconnue'}`);
        setOcrLoading(false);
        setAiLoading(false);
        setLoading(false);
        return;
      }

      console.log('✅ Réponse API reçue:', result);
      
      // Vérifier que les données ne sont pas des fallbacks
      if (result.final_data && (
        result.final_data.employee_name === 'Test User' ||
        result.final_data.company_name === 'Test Company Ltda' ||
        result.final_data.salario_bruto === 5000
      )) {
        console.warn('⚠️ Données de fallback détectées, pas d\'affichage');
        setError('❌ Les données extraites semblent être des données de test. Veuillez réessayer avec un document valide.');
        setOcrLoading(false);
        setAiLoading(false);
        setLoading(false);
        return;
      }

      setOcrLoading(false);
      setAiLoading(true);

      // Simuler le temps d'analyse IA
      await new Promise(resolve => setTimeout(resolve, 2000));

      setAiLoading(false);
      setLoading(false);
      setSuccess('✅ Analyse terminée avec succès !');
      
      // Rediriger vers le dashboard pour voir les résultats
      if (typeof window !== 'undefined') {
        window.location.href = '/br/dashboard';
      }

    } catch (error) {
      console.error('❌ Erreur lors de l\'upload:', error);
      setError('❌ Erreur de connexion. Veuillez réessayer.');
      setOcrLoading(false);
      setAiLoading(false);
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getLoadingMessage = () => {
    if (ocrLoading) return "Scan de l'holerite en cours...";
    if (aiLoading) return "Analyse IA en cours...";
    return "Traitement en cours...";
  }

  const getLoadingIcon = () => {
    if (ocrLoading) return <Scan className="animate-pulse w-5 h-5 mr-2" />;
    if (aiLoading) return <Brain className="animate-pulse w-5 h-5 mr-2" />;
    return <Loader2 className="animate-spin w-5 h-5 mr-2" />;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload de Bulletin de Paie
        </CardTitle>
        <CardDescription>
          Téléchargez votre bulletin de paie para análise (PDF, JPG, PNG - max 10MB)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {analysisResult ? (
          <div className="flex flex-col items-center gap-4">
            <div className="text-green-700 font-bold text-lg mb-2">Holerite analisado com sucesso!</div>
            <div className="bg-green-50 rounded-lg p-4 w-full text-sm text-green-900">
              {/* Affiche un résumé du résultat */}
              {analysisResult.finalData?.salario_bruto && (
                <div><b>Salário bruto:</b> R$ {analysisResult.finalData.salario_bruto.toLocaleString('pt-BR')}</div>
              )}
              {analysisResult.finalData?.salario_liquido && (
                <div><b>Salário líquido:</b> R$ {analysisResult.finalData.salario_liquido.toLocaleString('pt-BR')}</div>
              )}
              {analysisResult.recommendations?.recommendations && (
                <div><b>Recomendações IA:</b> {analysisResult.recommendations.recommendations.length} encontradas</div>
              )}
              {analysisResult.recommendations?.score_optimisation && (
                <div><b>Score d'optimisation:</b> {analysisResult.recommendations.score_optimisation}%</div>
              )}
            </div>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-full shadow transition text-lg"
              onClick={() => router.push(`/${locale}/dashboard`)}
            >
              Ir para o Dashboard
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="payslip-file" className="block text-sm font-medium">
                Sélectionner um arquivo
              </label>
              <input
                id="payslip-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={loading || isPending}
              />
            </div>

            {selectedFile && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <FileText className="h-4 w-4 text-gray-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
            )}

            {/* Indicateurs de progression */}
            {(ocrLoading || aiLoading) && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  {getLoadingIcon()}
                  <span className="text-sm font-medium text-blue-700">
                    {getLoadingMessage()}
                  </span>
                </div>
                {ocrLoading && (
                  <div className="text-xs text-blue-600 ml-6">
                    Extraction du texte du document...
                  </div>
                )}
                {aiLoading && (
                  <div className="text-xs text-blue-600 ml-6">
                    Génération des recommandations IA...
                  </div>
                )}
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-full shadow transition text-lg"
                disabled={loading || isPending || !selectedFile}
              >
                {loading ? getLoadingIcon() : null}
                {loading ? getLoadingMessage() : "Enviar"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
} 