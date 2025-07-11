'use client'
import { useState, useEffect } from 'react'
import { createClient } from "../../lib/supabase/client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Globe, 
  Building2, 
  Gift, 
  Calculator, 
  Shield, 
  Settings,
  LogOut,
  Plus,
  Save,
  FileText
} from 'lucide-react'
import { CountryList } from '@/components/admin/country-list'
import { ProviderList } from '@/components/admin/provider-list'
import { BenefitList } from '@/components/admin/benefit-list'
import { OcrResults } from '@/components/admin/ocr-results'
import { AdminGuard } from '@/components/admin/AdminGuard'

interface AdminUser {
  name: string
  email: string
  password: string
}

interface Country {
  code: string
  name: string
  capital: string
  currency: string
  currency_code: string
  language: string
  population: number
  flag_url?: string
}

interface BenefitProvider {
  name: string
  description: string
  category: string
  website?: string
  contact_email?: string
  is_active: boolean
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminUser, setAdminUser] = useState<AdminUser>({ name: '', email: '', password: '' })
  
  // Country form state
  const [country, setCountry] = useState<Country>({
    code: '', name: '', capital: '', currency: '', currency_code: '', language: '', population: 0
  })
  
  // Benefit provider form state
  const [benefitProvider, setBenefitProvider] = useState<BenefitProvider>({
    name: '', description: '', category: '', website: '', contact_email: '', is_active: true
  })
  
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [prompt, setPrompt] = useState('');
  const [promptMessage, setPromptMessage] = useState('');

  // Charger le prompt actuel au montage depuis Supabase
  useEffect(() => {
    const loadPrompt = async () => {
      try {
        const supabase = createClient();
        // Essaye d'abord 'result', puis 'prompt'
        let { data, error } = await supabase
          .from('prompt_results')
          .select('result, prompt')
          .order('created_at', { ascending: false })
          .limit(1);
        if (error) {
          console.error('Erro ao carregar prompt:', error);
          return;
        }
        if (data && data.length > 0) {
          // Prend le champ non vide
          setPrompt(data[0].result || data[0].prompt || '');
        } else {
          // Fallback sur le prompt par défaut du code
          const { payslipAnalysisPrompt } = await import('../../lib/prompts');
          setPrompt(payslipAnalysisPrompt);
        }
      } catch (error) {
        console.error('Erro ao carregar prompt:', error);
      }
    };
    loadPrompt();
  }, []);

  const handlePromptSave = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('prompt_results')
        .insert({ 
          prompt: 'LLM Analysis Prompt', 
          result: prompt 
        });
      
      if (error) {
        setPromptMessage('Erro ao salvar prompt: ' + error.message);
      } else {
        setPromptMessage('Prompt salvo com sucesso!');
      }
    } catch (error) {
      setPromptMessage('Erro ao salvar prompt: ' + (error as Error).message);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple authentication for demo - in production, use proper auth
    if (adminUser.email && adminUser.password) {
      setIsAuthenticated(true)
      setMessage('Connexion réussie !')
    } else {
      setMessage('Veuillez remplir tous les champs')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAdminUser({ name: '', email: '', password: '' })
    setMessage('Déconnexion réussie')
  }

  const handleAddCountry = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    const supabase = await createClient()
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
    else {
      setMessage('Pays ajouté avec succès !')
      setCountry({ code: '', name: '', capital: '', currency: '', currency_code: '', language: '', population: 0 })
    }
  }

  const handleAddBenefitProvider = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    const supabase = await createClient()
    const { error } = await supabase.from('benefit_providers').insert({
      name: benefitProvider.name,
      description: benefitProvider.description,
      category: benefitProvider.category,
      website: benefitProvider.website,
      contact_email: benefitProvider.contact_email,
      is_active: benefitProvider.is_active
    })
    if (error) setMessage('Erreur: ' + error.message)
    else {
      setMessage('Fournisseur de bénéfices ajouté avec succès !')
      setBenefitProvider({ name: '', description: '', category: '', website: '', contact_email: '', is_active: true })
    }
  }

  return (
    <AdminGuard>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Bienvenue dans l'administration</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="countries" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Pays
              </TabsTrigger>
              <TabsTrigger value="benefits" className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Bénéfices
              </TabsTrigger>
              <TabsTrigger value="providers" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Fournisseurs
              </TabsTrigger>
              <TabsTrigger value="ocr" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                OCR
              </TabsTrigger>
              <TabsTrigger value="prompt" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Prompt LLM
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Globe className="h-8 w-8 text-emerald-600" />
                      <div>
                        <p className="text-sm text-gray-600">Pays</p>
                        <p className="text-2xl font-bold">3</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Gift className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Bénéfices</p>
                        <p className="text-2xl font-bold">12</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Fournisseurs</p>
                        <p className="text-2xl font-bold">8</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-8 w-8 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Calculs</p>
                        <p className="text-2xl font-bold">156</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Button 
                      onClick={() => setActiveTab('countries')}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter un pays
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('benefits')}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter un bénéfice
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('providers')}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter un fournisseur
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Countries Tab */}
            <TabsContent value="countries" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Ajouter un nouveau pays
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCountry} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="code">Code du pays</Label>
                        <Input
                          id="code"
                          placeholder="BRA"
                          value={country.code}
                          onChange={e => setCountry({ ...country, code: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="name">Nom du pays</Label>
                        <Input
                          id="name"
                          placeholder="Brazil"
                          value={country.name}
                          onChange={e => setCountry({ ...country, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="capital">Capitale</Label>
                        <Input
                          id="capital"
                          placeholder="Brasília"
                          value={country.capital}
                          onChange={e => setCountry({ ...country, capital: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="currency">Devise</Label>
                        <Input
                          id="currency"
                          placeholder="Real"
                          value={country.currency}
                          onChange={e => setCountry({ ...country, currency: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="currency_code">Code devise</Label>
                        <Input
                          id="currency_code"
                          placeholder="BRL"
                          value={country.currency_code}
                          onChange={e => setCountry({ ...country, currency_code: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="language">Langue</Label>
                        <Input
                          id="language"
                          placeholder="Portuguese"
                          value={country.language}
                          onChange={e => setCountry({ ...country, language: e.target.value })}
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="population">Population</Label>
                        <Input
                          id="population"
                          type="number"
                          placeholder="214300000"
                          value={country.population}
                          onChange={e => setCountry({ ...country, population: Number(e.target.value) })}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                      <Save className="h-4 w-4 mr-2" />
                      Ajouter le pays
                    </Button>
                  </form>
                  <CountryList />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Benefits Tab */}
            <TabsContent value="benefits" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Gestion des bénéfices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Gérer les types de bénéfices disponibles pour chaque pays.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un nouveau bénéfice
                  </Button>
                  <BenefitList />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Providers Tab */}
            <TabsContent value="providers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Ajouter un fournisseur de bénéfices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddBenefitProvider} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="provider_name">Nom du fournisseur</Label>
                        <Input
                          id="provider_name"
                          placeholder="Nom de l'entreprise"
                          value={benefitProvider.name}
                          onChange={e => setBenefitProvider({ ...benefitProvider, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Catégorie</Label>
                        <Select value={benefitProvider.category} onValueChange={(value) => setBenefitProvider({ ...benefitProvider, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="health">Santé</SelectItem>
                            <SelectItem value="retirement">Retraite</SelectItem>
                            <SelectItem value="transport">Transport</SelectItem>
                            <SelectItem value="food">Alimentation</SelectItem>
                            <SelectItem value="education">Éducation</SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="website">Site web</Label>
                        <Input
                          id="website"
                          type="url"
                          placeholder="https://example.com"
                          value={benefitProvider.website}
                          onChange={e => setBenefitProvider({ ...benefitProvider, website: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_email">Email de contact</Label>
                        <Input
                          id="contact_email"
                          type="email"
                          placeholder="contact@example.com"
                          value={benefitProvider.contact_email}
                          onChange={e => setBenefitProvider({ ...benefitProvider, contact_email: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Description des services offerts..."
                          value={benefitProvider.description}
                          onChange={e => setBenefitProvider({ ...benefitProvider, description: e.target.value })}
                          required
                        />
                      </div>
                      <div className="md:col-span-2 flex items-center space-x-2">
                        <Checkbox
                          id="is_active"
                          checked={benefitProvider.is_active}
                          onCheckedChange={(checked) => setBenefitProvider({ ...benefitProvider, is_active: checked as boolean })}
                        />
                        <Label htmlFor="is_active">Fournisseur actif</Label>
                      </div>
                    </div>
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                      <Save className="h-4 w-4 mr-2" />
                      Ajouter le fournisseur
                    </Button>
                  </form>
                  <ProviderList />
                </CardContent>
              </Card>
            </TabsContent>

            {/* OCR Tab */}
            <TabsContent value="ocr" className="space-y-6">
              <OcrResults />
            </TabsContent>

            {/* Prompt LLM Tab */}
            <TabsContent value="prompt" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Editar Prompt LLM</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label htmlFor="prompt-editor">Prompt atual</Label>
                    <Textarea
                      id="prompt-editor"
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      rows={12}
                      className="font-mono"
                    />
                    <Button onClick={handlePromptSave} className="bg-emerald-600 hover:bg-emerald-700">
                      Salvar Prompt
                    </Button>
                    {promptMessage && <div className="text-green-600 mt-2">{promptMessage}</div>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {message && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-emerald-800">{message}</p>
            </div>
          )}
        </div>
      </main>
    </AdminGuard>
  )
}
