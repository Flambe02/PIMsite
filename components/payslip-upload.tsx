"use client"

import { useState, useTransition } from "react"
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useParams } from "next/navigation";

export function PayslipUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPending] = useTransition()
  const [loading, setLoading] = useState(false)
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

  async function handleUpload() {
    if (!selectedFile) return;
    setLoading(true); setError(null); setSuccess(null);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('/api/process-payslip', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao enviar holerite');
      }
      const data = await res.json();
      setSuccess('Upload concluído!');
      setAnalysisResult(data.analysisData || null);
      toast({ title: "Upload concluído!", description: "Seu holerite foi enviado.", variant: "default" });
      setSelectedFile(null); // reset le champ après succès
    } catch (err: any) {
      setError(err.message || "Erro ao enviar holerite");
      toast({ title: "Erro ao enviar holerite", description: err.message || "Erro ao enviar holerite", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpload();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
              {/* Affiche un résumé du résultat (ex: salaire, période, etc.) */}
              {analysisResult.gross_salary && (
                <div><b>Salário bruto:</b> R$ {analysisResult.gross_salary}</div>
              )}
              {analysisResult.net_salary && (
                <div><b>Salário líquido:</b> R$ {analysisResult.net_salary}</div>
              )}
              {analysisResult.period && (
                <div><b>Período:</b> {analysisResult.period}</div>
              )}
              {analysisResult.insights && Array.isArray(analysisResult.insights) && (analysisResult.insights as Array<{label: string, valor?: any, value?: any}>).map((insight: {label: string, valor?: any, value?: any}, idx: number) => {
                let displayValue = insight.valor ?? insight.value ?? '';
                if (typeof displayValue === 'object') {
                  displayValue = JSON.stringify(displayValue);
                }
                return (
                  <div key={idx}>
                    <b>{insight.label}:</b> {displayValue}
                  </div>
                );
              })}
              {/* Ajoute d'autres infos utiles si besoin */}
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
                disabled={isPending}
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
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                Enviar
              </Button>
            </div>
            {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
          </form>
        )}
      </CardContent>
    </Card>
  )
} 