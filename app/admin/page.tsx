import { Flag, PenLine, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AddCountryForm } from "@/components/admin/add-country-form"
import { EditCountryForm } from "@/components/admin/edit-country-form"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { deleteCountry, deleteBenefitProvider } from "@/app/admin/actions"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { AddBenefitProviderForm } from "@/components/admin/add-benefit-provider-form"
import { EditProviderForm } from "@/components/admin/edit-provider-form"

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: countries, error } = await supabase
    .from('countries')
    .select('id, name, code, currency_code, currency_symbol, tax_year, is_active')
    .order('name', { ascending: true })

  const { data: providers, error: providersError } = await supabase
    .from('benefit_providers')
    .select('id, name, description, website_url')
    .order('name', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Administração de Países</h1>
            <p className="text-gray-500">Gerencie informações fiscais e configurações por país</p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar País
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo País</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do novo país que será adicionado ao sistema.
                  </DialogDescription>
                </DialogHeader>
                <AddCountryForm />
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <PenLine className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Label htmlFor="country-select">País</Label>
          <Select>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Selecione um país" />
            </SelectTrigger>
            <SelectContent>
              {countries && countries.length > 0 && countries.map((country) => (
                <SelectItem key={country.id} value={country.code}>
                  <div className="flex items-center">
                    <Flag className="mr-2 h-4 w-4" />
                    {country.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="fiscal">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="fiscal">Parâmetros Fiscais</TabsTrigger>
            <TabsTrigger value="deductions">Deduções</TabsTrigger>
            <TabsTrigger value="practices">Melhores Práticas</TabsTrigger>
            <TabsTrigger value="products">Produtos Disponíveis</TabsTrigger>
            <TabsTrigger value="display">Exibição</TabsTrigger>
            <TabsTrigger value="providers">Fournisseurs de Bénéfices</TabsTrigger>
          </TabsList>

          <TabsContent value="fiscal" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Países Cadastrados</CardTitle>
                <CardDescription>
                  Lista dinâmica dos países cadastrados no banco de dados Supabase.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tabela de Países</h3>
                  <div className="rounded-md border overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="p-2 text-left font-medium">Nome</th>
                          <th className="p-2 text-left font-medium">Código</th>
                          <th className="p-2 text-left font-medium">Moeda</th>
                          <th className="p-2 text-left font-medium">Ativo?</th>
                          <th className="p-2 text-left font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {error && (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-red-500">
                              Erro ao buscar países: {error.message}
                            </td>
                          </tr>
                        )}
                        {(!countries || countries.length === 0) && !error && (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-gray-500">
                              Nenhum país cadastrado.
                            </td>
                          </tr>
                        )}
                        {countries && countries.length > 0 && countries.map((country) => (
                          <tr key={country.id} className="border-b">
                            <td className="p-2">
                              <Input value={country.name} disabled className="h-8" />
                            </td>
                            <td className="p-2">
                              <Input value={country.code} disabled className="h-8" />
                            </td>
                            <td className="p-2">
                              <Input value={country.currency_code} disabled className="h-8" />
                            </td>
                            <td className="p-2">
                              <Input value={country.is_active ? 'Sim' : 'Não'} disabled className="h-8" />
                            </td>
                            <td className="p-2 flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">Editar</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Editar País</DialogTitle>
                                    <DialogDescription>Altere os dados do país e salve as alterações.</DialogDescription>
                                  </DialogHeader>
                                  <EditCountryForm country={country} />
                                </DialogContent>
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive">Excluir</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir País</AlertDialogTitle>
                                    <AlertDialogDescription>Tem certeza que deseja excluir este país? Esta ação não pode ser desfeita.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <form action={async () => { await deleteCountry(country.id) }}>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
                                      <AlertDialogAction type="submit" className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </form>
                                </AlertDialogContent>
                              </AlertDialog>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="providers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Fournisseurs de Bénéfices</CardTitle>
                <CardDescription>Gérez les fournisseurs de bénéfices proposés aux entreprises.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-end mb-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter Fournisseur
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Ajouter un Fournisseur</DialogTitle>
                        <DialogDescription>Remplissez les informations du fournisseur de bénéfices.</DialogDescription>
                      </DialogHeader>
                      <AddBenefitProviderForm />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Site Web</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {providersError && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-red-500">
                            Erreur lors du chargement : {providersError.message}
                          </TableCell>
                        </TableRow>
                      )}
                      {(!providers || providers.length === 0) && !providersError && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-gray-500">
                            Aucun fournisseur enregistré.
                          </TableCell>
                        </TableRow>
                      )}
                      {providers && providers.length > 0 && providers.map((provider) => (
                        <TableRow key={provider.id}>
                          <TableCell>{provider.name}</TableCell>
                          <TableCell>
                            <a href={provider.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                              {provider.website_url}
                            </a>
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">Editer</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Editer Fournisseur</DialogTitle>
                                  <DialogDescription>Modifiez les informations du fournisseur de bénéfices.</DialogDescription>
                                </DialogHeader>
                                <EditProviderForm provider={provider} />
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">Supprimer</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer Fournisseur</AlertDialogTitle>
                                  <AlertDialogDescription>Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action ne peut pas être annulée.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <form action={async () => { await deleteBenefitProvider(provider.id) }}>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel type="button">Annuler</AlertDialogCancel>
                                    <AlertDialogAction type="submit" className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
                                  </AlertDialogFooter>
                                </form>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
