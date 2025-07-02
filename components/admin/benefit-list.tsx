"use client"

import { useEffect, useState } from "react"
import { createClient } from "../../lib/supabase/client"
import { ConfirmDialog } from './confirm-dialog'
import { EditModal } from './edit-modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export interface Benefit {
  id?: string
  name: string
  description?: string
  country_id?: string
  is_active: boolean
}

export function BenefitList() {
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [, setEditBenefit] = useState<Benefit | null>(null)
  const [editForm, setEditForm] = useState<Benefit | null>(null)

  useEffect(() => {
    const fetchBenefits = async () => {
      setLoading(true)
      setError(null)
      const supabase = createClient()
      const { data, error } = await supabase.from('benefits').select('*')
      if (error) setError(error.message)
      else if (data) setBenefits(data)
      setLoading(false)
    }
    fetchBenefits()
  }, [])

  const handleDelete = async (id: string) => {
    setToDelete(id)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    const supabase = createClient()
    await supabase.from('benefits').delete().eq('id', toDelete)
    setBenefits(benefits.filter(b => b.id !== toDelete))
    setConfirmOpen(false)
    setToDelete(null)
  }

  const cancelDelete = () => {
    setConfirmOpen(false)
    setToDelete(null)
  }

  const handleEdit = (benefit: Benefit) => {
    setEditBenefit(benefit)
    setEditForm({ ...benefit })
    setEditOpen(true)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editForm) return
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm || !editForm.id) return
    const supabase = createClient()
    await supabase.from('benefits').update({
      name: editForm.name,
      description: editForm.description,
      country_id: editForm.country_id,
      is_active: editForm.is_active
    }).eq('id', editForm.id)
    setBenefits(benefits.map(b => b.id === editForm.id ? { ...b, ...editForm } : b))
    setEditOpen(false)
    setEditBenefit(null)
    setEditForm(null)
  }

  if (loading) return <div>Chargement des bénéfices...</div>
  if (error) return <div className="text-red-600">Erreur: {error}</div>
  if (benefits.length === 0) return <div>Aucun bénéfice enregistré.</div>

  return (
    <div className="overflow-x-auto mt-8">
      <h3 className="text-lg font-semibold mb-2">Bénéfices existants</h3>
      <table className="min-w-full text-sm border">
        <thead>
          <tr>
            <th className="text-left p-2 border">Nom</th>
            <th className="text-left p-2 border">Description</th>
            <th className="text-left p-2 border">Pays</th>
            <th className="text-left p-2 border">Actif</th>
            <th className="text-left p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {benefits.map((b) => (
            <tr key={b.id || b.name}>
              <td className="p-2 border">{b.name}</td>
              <td className="p-2 border">{b.description || '-'}</td>
              <td className="p-2 border">{b.country_id || '-'}</td>
              <td className="p-2 border">{b.is_active ? 'Oui' : 'Non'}</td>
              <td className="p-2 border">
                <button className="text-blue-600 hover:underline mr-2" onClick={() => handleEdit(b)}>Éditer</button>
                <button className="text-red-600 hover:underline" onClick={() => handleDelete(b.id!)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer le bénéfice"
        message="Voulez-vous vraiment supprimer ce bénéfice ?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      <EditModal open={editOpen} title="Éditer le bénéfice" onClose={() => setEditOpen(false)}>
        {editForm && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input name="name" value={editForm.name} onChange={handleEditChange} placeholder="Nom" required />
            <Input name="description" value={editForm.description} onChange={handleEditChange} placeholder="Description" />
            <Input name="country_id" value={editForm.country_id} onChange={handleEditChange} placeholder="Pays" />
            <div className="flex items-center gap-2">
              <input type="checkbox" name="is_active" checked={editForm.is_active} onChange={e => setEditForm({ ...editForm, is_active: e.target.checked })} />
              <span>Actif</span>
            </div>
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