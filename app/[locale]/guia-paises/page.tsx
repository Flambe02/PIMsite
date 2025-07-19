import CountryExplorerClientWrapper from "@/components/country-explorer-client-wrapper";
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

  return (
    <main className="flex-1 py-12 px-4 md:px-6">
      <div className="container mx-auto">
        <div>DEBUG: Main content is rendering</div>
        <CountryExplorerClientWrapper countries={countries} />
      </div>
    </main>
  )
}
