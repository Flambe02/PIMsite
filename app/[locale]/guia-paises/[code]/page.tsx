import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Heart, Calculator, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getEmojiFlag } from "@/lib/utils"

interface TaxBracket {
  id: string
  country_id: string
  tax_type: string
  min_amount: number
  max_amount: number | null
  rate: number
  description?: string
}

interface BenefitType {
  id: string
  country_id: string
  name: string
  description: string
  category: string
  is_mandatory: boolean
}

export default async function CountryDetailPage({ 
  params 
}: { 
  params: Promise<{ code: string }> 
}) {
  const { code } = await params
  const supabase = await createClient()
  
  // Fetch all countries for the top bar
  const { data: allCountries } = await supabase
    .from('countries')
    .select('code, name')
    .order('name', { ascending: true })

  // Fetch country data
  const { data: country, error: countryError } = await supabase
    .from('countries')
    .select('*')
    .eq('code', code.toUpperCase())
    .single()

  if (countryError || !country) {
    notFound()
  }

  // Fetch tax brackets for this country
  const { data: taxBrackets } = await supabase
    .from('tax_brackets')
    .select('*')
    .eq('country_id', country.id)
    .order('tax_type', { ascending: true })
    .order('min_amount', { ascending: true })

  // Fetch benefits for this country
  const { data: benefits } = await supabase
    .from('benefit_types')
    .select('*')
    .eq('country_id', country.id)
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  // Group tax brackets by type
  const groupedTaxBrackets = (taxBrackets ?? []).reduce((acc, bracket) => {
    if (!acc[bracket.tax_type]) acc[bracket.tax_type] = []
    acc[bracket.tax_type].push(bracket)
    return acc
  }, {} as Record<string, typeof taxBrackets>)

  // Group benefits by category
  const groupedBenefits = (benefits ?? []).reduce((acc, benefit) => {
    if (!acc[benefit.category]) acc[benefit.category] = []
    acc[benefit.category].push(benefit)
    return acc
  }, {} as Record<string, typeof benefits>)

  return (
    <main className="flex-1 flex flex-col">
      {/* Country selector bar */}
      <div className="w-full bg-white border-b py-4 px-2 overflow-x-auto">
        <div className="flex gap-3 max-w-6xl mx-auto">
          {allCountries?.map((c) => (
            <Link
              key={c.code}
              href={`/guia-paises/${c.code.toLowerCase()}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm bg-white hover:bg-emerald-50 transition min-w-[140px] ${c.code.toUpperCase() === country.code.toUpperCase() ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-gray-200'}`}
            >
              <span className="text-2xl">{getEmojiFlag(c.code)}</span>
              <span className="font-medium text-gray-800">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main country detail content (background, tabs, etc.) */}
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/brazil-background.jpg"
            alt={`${country.name} landscape`}
            fill
            className="object-cover brightness-75"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex">
          <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 text-white">
              <div className="max-w-4xl">
                <div className="uppercase text-sm font-light tracking-wider mb-4">
                  EASILY MANAGE EMPLOYMENT AND PAYROLL IN
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-white/20 backdrop-blur-sm">
                    {country.flag_url ? (
                      <Image src={country.flag_url} alt={`${country.name} flag`} width={40} height={40} />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-bold">{country.code}</span>
                      </div>
                    )}
                  </div>
                  <h1 className="text-6xl font-bold">{country.name}</h1>
                </div>

                <p className="text-xl mb-10 leading-relaxed">
                  Make employment in {country.name} easy. Let us handle payroll, benefits, taxes, compliance, and even stock
                  options for your team in {country.name}, all in one easy-to-use platform.
                </p>

                <div className="mb-16">
                  <Link href="/contato">
                    <Button className="bg-black hover:bg-gray-900 text-white rounded-full px-8 py-6 text-lg flex items-center gap-2 group">
                      Book a demo
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  <p className="text-sm opacity-80">Services available in this country:</p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      className="rounded-full bg-black/30 backdrop-blur-sm border-white/30 hover:bg-black/50 text-white flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      Employer of Record Product
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full bg-black/30 backdrop-blur-sm border-white/30 hover:bg-black/50 text-white flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      Contractor Management
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full bg-black/30 backdrop-blur-sm border-white/30 hover:bg-black/50 text-white flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      Payroll
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80">
              <Card className="bg-white p-8 rounded-xl">
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 12H22"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="text-gray-500 text-sm">Capital City</div>
                    <div className="text-xl font-medium">{country.capital}</div>
                  </div>

                  <div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 12H22"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="text-gray-500 text-sm">Currency</div>
                    <div className="text-xl font-medium">{country.currency}</div>
                    <div className="text-gray-500">({country.currency_code})</div>
                  </div>

                  <div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 12H22"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="text-gray-500 text-sm">Languages</div>
                    <div className="text-xl font-medium">{country.language}</div>
                  </div>

                  <div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="text-gray-500 text-sm">Population size</div>
                    <div className="text-xl font-medium">{country.population?.toLocaleString() || 'N/A'}</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="relative z-10 bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Tabs defaultValue="payroll" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="payroll" className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Payroll & Taxes
                  </TabsTrigger>
                  <TabsTrigger value="benefits" className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Benefits
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="payroll" className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4">Payroll & Tax Information</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Comprehensive tax brackets and payroll information for {country.name}. 
                      All rates are current and regularly updated.
                    </p>
                  </div>
                  {Object.keys(groupedTaxBrackets).length > 0 ? (
                    <div className="space-y-8">
                      {Object.entries(groupedTaxBrackets).map(([taxType, brackets]) => (
                        <Card key={taxType}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Calculator className="h-5 w-5" />
                              {taxType} Tax Brackets
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Minimum Amount</TableHead>
                                  <TableHead>Maximum Amount</TableHead>
                                  <TableHead>Rate (%)</TableHead>
                                  <TableHead>Description</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {(brackets as TaxBracket[]).map((bracket: TaxBracket) => (
                                  <TableRow key={bracket.id}>
                                    <TableCell className="font-medium">
                                      {bracket.min_amount.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: country.currency_code
                                      })}
                                    </TableCell>
                                    <TableCell>
                                      {bracket.max_amount
                                        ? bracket.max_amount.toLocaleString('en-US', {
                                            style: 'currency',
                                            currency: country.currency_code
                                          })
                                        : 'No limit'}
                                    </TableCell>
                                    <TableCell className="font-semibold text-emerald-600">
                                      {bracket.rate}%
                                    </TableCell>
                                    <TableCell className="text-gray-600">
                                      {bracket.description || '-'}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Tax Information Available</h3>
                        <p className="text-gray-600">
                          Tax brackets and payroll information for {country.name} will be available soon.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="benefits" className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4">Employee Benefits</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Comprehensive benefits information for {country.name}. 
                      Both mandatory and optional benefits are included.
                    </p>
                  </div>
                  {Object.keys(groupedBenefits).length > 0 ? (
                    <div className="space-y-8">
                      {Object.entries(groupedBenefits).map(([category, categoryBenefits]) => (
                        <Card key={category}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Gift className="h-5 w-5" />
                              {category}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                              {(categoryBenefits as BenefitType[]).map((benefit: BenefitType) => (
                                <div
                                  key={benefit.id}
                                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-semibold text-lg">{benefit.name}</h4>
                                    {benefit.is_mandatory && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Mandatory
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Benefits Information Available</h3>
                        <p className="text-gray-600">
                          Benefits information for {country.name} will be available soon.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 