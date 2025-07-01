"use client"

import { useState, useTransition } from "react"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { uploadPayslip } from "@/app/dashboard/actions"

export function PayslipUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        setError('Type de fichier non supporté. Utilisez PDF, JPG ou PNG.')
        setSelectedFile(null)
        return
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        setError('Fichier trop volumineux. Taille maximum : 10MB')
        setSelectedFile(null)
        return
      }

      setSelectedFile(file)
      setError(null)
      setSuccess(null)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier')
      return
    }

    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append('payslip', selectedFile)

    startTransition(async () => {
      const result = await uploadPayslip(formData)
      
      if (result.success) {
        setSuccess(result.message || 'Upload réussi')
        setSelectedFile(null)
        // Reset file input
        const fileInput = document.getElementById('payslip-file') as HTMLInputElement
        if (fileInput) {
          fileInput.value = ''
        }
      } else {
        setError(result.error || 'Erreur lors de l\'upload')
      }
    })
  }

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
          Téléchargez votre bulletin de paie pour analyse (PDF, JPG, PNG - max 10MB)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="payslip-file" className="block text-sm font-medium">
              Sélectionner un fichier
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

          <Button 
            type="submit" 
            disabled={!selectedFile || isPending}
            className="w-full"
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Upload en cours...
              </>
            ) : (
              'Télécharger le bulletin'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 