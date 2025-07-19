import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic';

export default async function TestCountriesPage() {
  const supabase = await createClient()
  
  // Test fetching countries
  const { data: countries, error: countriesError } = await supabase
    .from('countries')
    .select('*')
    .order('name', { ascending: true })

  // Test fetching tax brackets
  const { data: taxBrackets, error: taxError } = await supabase
    .from('tax_brackets')
    .select('*')
    .limit(5)

  // Test fetching benefits
  const { data: benefits, error: benefitsError } = await supabase
    .from('benefit_types')
    .select('*')
    .limit(5)

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Supabase Connection</h1>
      
      <div className="space-y-8">
        {/* Countries Test */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Countries Table</h2>
          {countriesError ? (
            <div className="text-red-600">
              <p>Error: {countriesError.message}</p>
              <p>Code: {countriesError.code}</p>
            </div>
          ) : (
            <div>
              <p className="text-green-600 mb-4">✅ Successfully connected to countries table</p>
              <p>Found {countries?.length || 0} countries</p>
              {countries && countries.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Sample countries:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {countries.slice(0, 5).map((country: { id: string; name: string; code: string; capital: string }) => (
                      <li key={country.id}>
                        {country.name} ({country.code}) - {country.capital}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tax Brackets Test */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tax Brackets Table</h2>
          {taxError ? (
            <div className="text-red-600">
              <p>Error: {taxError.message}</p>
              <p>Code: {taxError.code}</p>
            </div>
          ) : (
            <div>
              <p className="text-green-600 mb-4">✅ Successfully connected to tax_brackets table</p>
              <p>Found {taxBrackets?.length || 0} tax brackets</p>
              {taxBrackets && taxBrackets.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Sample tax brackets:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {taxBrackets.map((bracket: { id: string; tax_type: string; min_amount: string; max_amount: string; rate: string }) => (
                      <li key={bracket.id}>
                        {bracket.tax_type}: {bracket.min_amount} - {bracket.max_amount || 'No limit'} ({bracket.rate}%)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Benefits Test */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Benefit Types Table</h2>
          {benefitsError ? (
            <div className="text-red-600">
              <p>Error: {benefitsError.message}</p>
              <p>Code: {benefitsError.code}</p>
            </div>
          ) : (
            <div>
              <p className="text-green-600 mb-4">✅ Successfully connected to benefit_types table</p>
              <p>Found {benefits?.length || 0} benefit types</p>
              {benefits && benefits.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Sample benefits:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {benefits.map((benefit: { id: string; name: string; category: string; is_mandatory: boolean }) => (
                      <li key={benefit.id}>
                        {benefit.name} ({benefit.category}) - {benefit.is_mandatory ? 'Mandatory' : 'Optional'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 