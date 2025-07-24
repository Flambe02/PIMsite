"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client";
import { ConfirmDialog } from './confirm-dialog'
import { EditModal } from './edit-modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export interface Country {
  code: string
  name: string
  capital: string
  currency: string
  currency_code: string
  language: string
  population: number
  flag_url?: string
}

export function CountryList() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState<Country | null>(null)

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true)
      setError(null)
      const supabase = createClient();
      const { data, error } = await supabase.from('countries').select('*')
      if (error) setError(error.message)
      else if (data) setCountries(data)
      setLoading(false)
    }
    fetchCountries()
  }, [])

  const handleDelete = async (code: string) => {
    setToDelete(code)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    const supabase = createClient();
    await supabase.from('countries').delete().eq('code', toDelete)
    setCountries(countries.filter(c => c.code !== toDelete))
    setConfirmOpen(false)
    setToDelete(null)
  }

  const cancelDelete = () => {
    setConfirmOpen(false)
    setToDelete(null)
  }

  const handleEdit = (country: Country) => {
    setEditForm({ ...country })
    setEditOpen(true)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editForm) return
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm) return
    const supabase = createClient();
    await supabase.from('countries').update({
      name: editForm.name,
      capital: editForm.capital,
      currency: editForm.currency,
      currency_code: editForm.currency_code,
      language: editForm.language,
      population: Number(editForm.population)
    }).eq('code', editForm.code)
    setCountries(countries.map(c => c.code === editForm.code ? { ...c, ...editForm } : c))
    setEditOpen(false)
    setEditForm(null)
  }

  if (loading) return <div>Chargement des pays...</div>
  if (error) return <div className="text-red-600">Erreur: {error}</div>
  if (countries.length === 0) return <div>Aucun pays enregistré.</div>

  return (
    <div className="overflow-x-auto mt-8">
      <h3 className="text-lg font-semibold mb-2">Pays existants</h3>
      <table className="min-w-full text-sm border">
        <thead>
          <tr>
            <th className="text-left p-2 border">Code</th>
            <th className="text-left p-2 border">Nom</th>
            <th className="text-left p-2 border">Capitale</th>
            <th className="text-left p-2 border">Devise</th>
            <th className="text-left p-2 border">Population</th>
            <th className="text-left p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((c) => (
            <tr key={c.code}>
              <td className="p-2 border">{c.code}</td>
              <td className="p-2 border">{c.name}</td>
              <td className="p-2 border">{c.capital}</td>
              <td className="p-2 border">{c.currency} ({c.currency_code})</td>
              <td className="p-2 border">{c.population ? c.population.toLocaleString() : '–'}</td>
              <td className="p-2 border">
                <button className="text-blue-600 hover:underline mr-2" onClick={() => handleEdit(c)}>Éditer</button>
                <button className="text-red-600 hover:underline" onClick={() => handleDelete(c.code)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer le pays"
        message="Voulez-vous vraiment supprimer ce pays ?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      <EditModal open={editOpen} title="Éditer le pays" onClose={() => setEditOpen(false)}>
        {editForm && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input name="name" value={editForm.name} onChange={handleEditChange} placeholder="Nom" required />
            <Input name="capital" value={editForm.capital} onChange={handleEditChange} placeholder="Capitale" required />
            <Input name="currency" value={editForm.currency} onChange={handleEditChange} placeholder="Devise" required />
            <Input name="currency_code" value={editForm.currency_code} onChange={handleEditChange} placeholder="Code devise" required />
            <Input name="language" value={editForm.language} onChange={handleEditChange} placeholder="Langue" required />
            <Input name="population" type="number" value={editForm.population} onChange={handleEditChange} placeholder="Population" required />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Annuler</Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        )}
      </EditModal>
    </div>
  )
} 