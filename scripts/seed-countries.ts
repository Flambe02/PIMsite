import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const countries = [
  {
    code: 'BR',
    name: 'Brazil',
    capital: 'Brasília',
    currency: 'Real',
    currency_code: 'BRL',
    language: 'Portuguese',
    population: 214300000,
    flag_url: null
  },
  {
    code: 'US',
    name: 'United States',
    capital: 'Washington, D.C.',
    currency: 'US Dollar',
    currency_code: 'USD',
    language: 'English',
    population: 331900000,
    flag_url: null
  },
  {
    code: 'CA',
    name: 'Canada',
    capital: 'Ottawa',
    currency: 'Canadian Dollar',
    currency_code: 'CAD',
    language: 'English, French',
    population: 38000000,
    flag_url: null
  },
  {
    code: 'MX',
    name: 'Mexico',
    capital: 'Mexico City',
    currency: 'Mexican Peso',
    currency_code: 'MXN',
    language: 'Spanish',
    population: 128900000,
    flag_url: null
  },
  {
    code: 'AR',
    name: 'Argentina',
    capital: 'Buenos Aires',
    currency: 'Argentine Peso',
    currency_code: 'ARS',
    language: 'Spanish',
    population: 45190000,
    flag_url: null
  }
]

const taxBrackets = [
  {
    country_id: '1', // Will be replaced with actual country ID
    tax_type: 'Income Tax',
    min_amount: 0,
    max_amount: 2259.20,
    rate: 0,
    description: 'Tax-free bracket'
  },
  {
    country_id: '1',
    tax_type: 'Income Tax',
    min_amount: 2259.21,
    max_amount: 2826.65,
    rate: 7.5,
    description: 'First bracket'
  },
  {
    country_id: '1',
    tax_type: 'Income Tax',
    min_amount: 2826.66,
    max_amount: 3751.05,
    rate: 15,
    description: 'Second bracket'
  },
  {
    country_id: '1',
    tax_type: 'Income Tax',
    min_amount: 3751.06,
    max_amount: 4664.68,
    rate: 22.5,
    description: 'Third bracket'
  },
  {
    country_id: '1',
    tax_type: 'Income Tax',
    min_amount: 4664.69,
    max_amount: null,
    rate: 27.5,
    description: 'Fourth bracket'
  }
]

const benefits = [
  {
    country_id: '1', // Will be replaced with actual country ID
    name: '13th Salary',
    description: 'Mandatory 13th salary payment in December',
    category: 'Mandatory Benefits',
    is_mandatory: true
  },
  {
    country_id: '1',
    name: 'FGTS',
    description: 'Severance pay fund contribution (8% of salary)',
    category: 'Mandatory Benefits',
    is_mandatory: true
  },
  {
    country_id: '1',
    name: 'INSS',
    description: 'Social security contribution',
    category: 'Mandatory Benefits',
    is_mandatory: true
  },
  {
    country_id: '1',
    name: 'Health Insurance',
    description: 'Private health insurance coverage',
    category: 'Optional Benefits',
    is_mandatory: false
  },
  {
    country_id: '1',
    name: 'Meal Allowance',
    description: 'Daily meal allowance or food card',
    category: 'Optional Benefits',
    is_mandatory: false
  }
]

async function seedData() {
  try {
    console.log('🌱 Starting database seeding...')

    // Insert countries
    console.log('📝 Inserting countries...')
    const { data: countriesData, error: countriesError } = await supabase
      .from('countries')
      .insert(countries)
      .select()

    if (countriesError) {
      console.error('❌ Error inserting countries:', countriesError)
      return
    }

    console.log(`✅ Inserted ${countriesData?.length} countries`)

    // Get the first country ID for tax brackets and benefits
    const firstCountryId = countriesData?.[0]?.id
    if (!firstCountryId) {
      console.error('❌ No country ID found')
      return
    }

    // Update tax brackets with correct country ID
    const taxBracketsWithCountryId = taxBrackets.map(bracket => ({
      ...bracket,
      country_id: firstCountryId
    }))

    // Insert tax brackets
    console.log('📝 Inserting tax brackets...')
    const { data: taxData, error: taxError } = await supabase
      .from('tax_brackets')
      .insert(taxBracketsWithCountryId)
      .select()

    if (taxError) {
      console.error('❌ Error inserting tax brackets:', taxError)
    } else {
      console.log(`✅ Inserted ${taxData?.length} tax brackets`)
    }

    // Update benefits with correct country ID
    const benefitsWithCountryId = benefits.map(benefit => ({
      ...benefit,
      country_id: firstCountryId
    }))

    // Insert benefits
    console.log('📝 Inserting benefits...')
    const { data: benefitsData, error: benefitsError } = await supabase
      .from('benefit_types')
      .insert(benefitsWithCountryId)
      .select()

    if (benefitsError) {
      console.error('❌ Error inserting benefits:', benefitsError)
    } else {
      console.log(`✅ Inserted ${benefitsData?.length} benefits`)
    }

    console.log('🎉 Database seeding completed!')
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the seeding function
seedData() 