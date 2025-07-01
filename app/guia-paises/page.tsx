import { CountryExplorer } from "@/components/country-explorer"
import { createClient } from '@/lib/supabase/server'

export default async function CountryGuidePage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('countries')
    .select('code, name')
    .order('name', { ascending: true })

  let countries = data ?? []
  if (error || !data) {
    console.error('Error fetching countries:', error)
    countries = []
  }

  console.log('Countries fetched:', countries)

  return (
    <main className="flex-1 py-12 px-4 md:px-6">
      <div className="container mx-auto">
        <CountryExplorer countries={countries} />
      </div>
    </main>
  )
}
