'use client'
import { Flag, PenLine, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { AddCountryForm } from "@/components/admin/add-country-form"
import { EditCountryForm } from "@/components/admin/edit-country-form"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { deleteCountry, deleteBenefitProvider } from "@/app/admin/actions"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { AddBenefitProviderForm } from "@/components/admin/add-benefit-provider-form"
import { EditProviderForm } from "@/components/admin/edit-provider-form"
import { useState } from 'react'

export default function AdminPage() {
  const [country, setCountry] = useState({ code: '', name: '', capital: '', currency: '', currency_code: '', language: '', population: '' })
  const [message, setMessage] = useState('')

  async function handleAddCountry(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    const supabase = createClient()
    const { error } = await supabase.from('countries').insert({
      code: country.code.toUpperCase(),
      name: country.name,
      capital: country.capital,
      currency: country.currency,
      currency_code: country.currency_code,
      language: country.language,
      population: Number(country.population)
    })
    if (error) setMessage('Erreur: ' + error.message)
    else setMessage('Pays ajouté !')
  }

  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Admin - Ajouter un pays</h1>
      <form className="space-y-4" onSubmit={handleAddCountry}>
        <Input placeholder="Code (ex: BRA)" value={country.code} onChange={e => setCountry({ ...country, code: e.target.value })} required />
        <Input placeholder="Nom" value={country.name} onChange={e => setCountry({ ...country, name: e.target.value })} required />
        <Input placeholder="Capitale" value={country.capital} onChange={e => setCountry({ ...country, capital: e.target.value })} required />
        <Input placeholder="Devise" value={country.currency} onChange={e => setCountry({ ...country, currency: e.target.value })} required />
        <Input placeholder="Code devise (ex: BRL)" value={country.currency_code} onChange={e => setCountry({ ...country, currency_code: e.target.value })} required />
        <Input placeholder="Langue" value={country.language} onChange={e => setCountry({ ...country, language: e.target.value })} required />
        <Input placeholder="Population" type="number" value={country.population} onChange={e => setCountry({ ...country, population: e.target.value })} required />
        <Button type="submit">Ajouter le pays</Button>
      </form>
      {message && <div className="mt-4 text-sm text-emerald-600">{message}</div>}
      <div className="mt-12 text-gray-400 text-xs">(Plus tard : CRUD entreprises, bénéfices, etc.)</div>
    </div>
  )
}
