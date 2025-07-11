'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Eye, Copy, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface OcrResult {
  id: string
  holerite_id: string
  provider: 'tesseract' | 'ocrspace'
  raw_text: string
  confidence: number | null
  duration_ms: number | null
  created_at: string
}

export function OcrResults() {
  const [results, setResults] = useState<OcrResult[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedText, setSelectedText] = useState('')
  const [selectedResult, setSelectedResult] = useState<OcrResult | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadOcrResults()
  }, [])

  const loadOcrResults = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('ocr_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Erreur lors du chargement des résultats OCR:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les résultats OCR",
          variant: "destructive",
        })
        return
      }

      setResults(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des résultats OCR:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les résultats OCR",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewText = (result: OcrResult) => {
    setSelectedText(result.raw_text)
    setSelectedResult(result)
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(selectedText)
      toast({
        title: "Copié !",
        description: "Le texte OCR a été copié dans le presse-papiers",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le texte",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getProviderBadge = (provider: string) => {
    const isTesseract = provider === 'tesseract'
    return (
      <Badge variant={isTesseract ? "default" : "secondary"}>
        {isTesseract ? 'Tesseract' : 'OCR.Space'}
      </Badge>
    )
  }

  const getConfidenceDisplay = (confidence: number | null) => {
    if (confidence === null) return '–'
    return `${Math.round(confidence)}%`
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement des résultats OCR...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Résultats OCR ({results.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun résultat OCR trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Confiance</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">
                        {formatDate(result.created_at)}
                      </TableCell>
                      <TableCell>
                        {getProviderBadge(result.provider)}
                      </TableCell>
                      <TableCell>
                        {getConfidenceDisplay(result.confidence)}
                      </TableCell>
                      <TableCell>
                        {result.duration_ms ? `${result.duration_ms}ms` : '–'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewText(result)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Voir texte
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh]">
                              <DialogHeader>
                                <DialogTitle className="flex items-center justify-between">
                                  <span>Texte OCR extrait</span>
                                  <div className="flex items-center gap-2">
                                    {getProviderBadge(result.provider)}
                                    <span className="text-sm text-gray-500">
                                      {getConfidenceDisplay(result.confidence)} • {result.duration_ms}ms
                                    </span>
                                  </div>
                                </DialogTitle>
                              </DialogHeader>
                                                             <div className="space-y-4">
                                 <div className="h-96 overflow-y-auto">
                                   <Textarea
                                     value={selectedText}
                                     readOnly
                                     className="min-h-[300px] font-mono text-sm"
                                     placeholder="Aucun texte extrait..."
                                   />
                                 </div>
                                <div className="flex justify-between">
                                  <Button onClick={handleCopyText} variant="outline">
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copier le texte
                                  </Button>
                                  <Button variant="outline" asChild>
                                    <a href={`/dashboard/holerite/${result.holerite_id}`} target="_blank">
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Voir holerite
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 