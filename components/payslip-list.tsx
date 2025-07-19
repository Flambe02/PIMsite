"use client"

import { useState, useEffect } from "react"
import { FileText, Download, Eye, Calendar, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getUserPayslips } from "@/app/[locale]/dashboard/actions"
import { Payslip } from "@/types";

export function PayslipList() {
  const [payslips, setPayslips] = useState<Payslip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPayslips()
  }, [])

  const loadPayslips = async () => {
    setLoading(true)
    setError(null)
    
    const result = await getUserPayslips()
    
    if (result.success) {
      setPayslips(result.data)
    } else {
      setError(result.error || 'Erreur lors du chargement')
    }
    
    setLoading(false)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return '📄'
    } else if (fileType.includes('image')) {
      return '🖼️'
    }
    return '📎'
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Chargement des bulletins...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (payslips.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun bulletin uploadé</h3>
          <p className="text-gray-500">
            Vous n&apos;avez pas encore uploadé de bulletins de paie.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Mes Bulletins de Paie ({payslips.length})
        </CardTitle>
        <CardDescription>
          Liste de vos bulletins de paie uploadés
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {payslips.map((payslip) => (
            <div
              key={payslip.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl">{getFileIcon(payslip.file_type || 'unknown')}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {payslip.file_name}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{payslip.file_size ? formatFileSize(payslip.file_size) : 'Taille inconnue'}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {payslip.upload_date ? formatDate(payslip.upload_date) : 'Date inconnue'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(payslip.file_url || '#', '_blank')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Voir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = payslip.file_url || '#'
                    link.download = payslip.file_name || 'download'
                    link.click()
                  }}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Télécharger
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 