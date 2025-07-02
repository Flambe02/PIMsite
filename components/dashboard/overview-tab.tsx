'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ResponsiveContainer, PieChart, Pie, Legend, Cell, Tooltip } from 'recharts'
import { getLatestPayrollAnalysis } from '@/app/dashboard/actions' 
import { PayrollAnalysisResult } from '@/types' 
import { Button } from '@/components/ui/button'

const COLORS = ['#16a34a', '#ef4444', '#f97316'];

export function OverviewTab({ onGoToUpload }: { onGoToUpload: () => void }) {
  const [data, setData] = useState<PayrollAnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getLatestPayrollAnalysis()
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger les données d'analyse.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center p-8">Chargement des données...</div>
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }
  
  if (!data) {
    return (
      <div className="text-center p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-72">
        <h3 className="text-2xl font-bold tracking-tight">
          Start Your Financial Analysis
        </h3>
        <p className="text-muted-foreground mt-2 mb-6 max-w-md">
          Upload your first payslip to get a detailed overview of your income, deductions, and benefits.
        </p>
        <Button onClick={onGoToUpload}>
          Upload Payslip
        </Button>
      </div>
    )
  }

  const chartData = [
    { name: 'Revenu Net', value: data.net_income },
    { name: 'Impôts', value: data.taxes },
    { name: 'Déductions', value: data.deductions },
  ];

  return (
    <div className='space-y-6'>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Revenu Brut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{data.gross_income.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenu Net</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{data.net_income.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Utilisation des Bénéfices</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={data.benefits_utilization} className='h-3' />
            <div className='text-sm text-muted-foreground mt-2'>{data.benefits_utilization}% de vos avantages optimisés</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Répartition du Revenu</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
} 