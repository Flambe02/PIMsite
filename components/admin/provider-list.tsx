"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client";
import { ConfirmDialog } from './confirm-dialog'
import { EditModal } from './edit-modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export interface BenefitProvider {
  id?: string
  name: string
  description: string
  category: string
  website?: string
  contact_email?: string
  is_active: boolean
}

export function ProviderList() {
  const [providers, setProviders] = useState<BenefitProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState<BenefitProvider | null>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true)
      setError(null)
      const supabase = createClient();
      const { data, error } = await supabase.from('benefit_providers').select('*')
      if (error) setError(error.message)
      else if (data) setProviders(data)
      setLoading(false)
    }
    fetchProviders()
  }, [])

  const handleDelete = async (id: string) => {
    setToDelete(id)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    const supabase = createClient();
    await supabase.from('benefit_providers').delete().eq('id', toDelete)
    setProviders(providers.filter(p => p.id !== toDelete))
    setConfirmOpen(false)
    setToDelete(null)
  }

  const cancelDelete = () => {
    setConfirmOpen(false)
    setToDelete(null)
  }

  const handleEdit = (provider: BenefitProvider) => {
    setEditForm({ ...provider })
    setEditOpen(true)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editForm) return
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm || !editForm.id) return
    const supabase = createClient();
    await supabase.from('benefit_providers').update({
      name: editForm.name,
      description: editForm.description,
      category: editForm.category,
      website: editForm.website,
      contact_email: editForm.contact_email,
      is_active: editForm.is_active
    }).eq('id', editForm.id)
    setProviders(providers.map(p => p.id === editForm.id ? { ...p, ...editForm } : p))
    setEditOpen(false)
    setEditForm(null)
  }

  if (loading) return <div>Chargement des fournisseurs...</div>
  if (error) return <div className="text-red-600">Erreur: {error}</div>
  if (providers.length === 0) return <div>Aucun fournisseur enregistré.</div>

  return (
    <div className="overflow-x-auto mt-8">
      <h3 className="text-lg font-semibold mb-2">Fournisseurs existants</h3>
      <table className="min-w-full text-sm border">
        <thead>
          <tr>
            <th className="text-left p-2 border">Nom</th>
            <th className="text-left p-2 border">Catégorie</th>
            <th className="text-left p-2 border">Site web</th>
            <th className="text-left p-2 border">Actif</th>
            <th className="text-left p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((p) => (
            <tr key={p.id || p.name}>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.category}</td>
              <td className="p-2 border">{p.website ? <a href={p.website} target="_blank" rel="noopener noreferrer">{p.website}</a> : '-'}</td>
              <td className="p-2 border">{p.is_active ? 'Oui' : 'Non'}</td>
              <td className="p-2 border">
                <button className="text-blue-600 hover:underline mr-2" onClick={() => handleEdit(p)}>Éditer</button>
                <button className="text-red-600 hover:underline" onClick={() => handleDelete(p.id!)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer le fournisseur"
        message="Voulez-vous vraiment supprimer ce fournisseur ?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      <EditModal open={editOpen} title="Éditer le fournisseur" onClose={() => setEditOpen(false)}>
        {editForm && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input name="name" value={editForm.name} onChange={handleEditChange} placeholder="Nom" required />
            <Input name="description" value={editForm.description} onChange={handleEditChange} placeholder="Description" />
            <Input name="category" value={editForm.category} onChange={handleEditChange} placeholder="Catégorie" required />
            <Input name="website" value={editForm.website} onChange={handleEditChange} placeholder="Site web" />
            <Input name="contact_email" value={editForm.contact_email} onChange={handleEditChange} placeholder="Email de contact" />
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