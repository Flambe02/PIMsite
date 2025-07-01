'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCountry(formData: FormData) {
  try {
    const supabase = await createClient()
    
    const name = formData.get('name') as string
    const code = formData.get('code') as string
    const currency_code = formData.get('currency_code') as string
    const currency_symbol = formData.get('currency_symbol') as string
    const tax_year = parseInt(formData.get('tax_year') as string) || 2025

    if (!name || !code || !currency_code || !currency_symbol) {
      throw new Error('All fields are required')
    }

    const { error } = await supabase
      .from('countries')
      .insert([
        {
          name,
          code,
          currency_code,
          currency_symbol,
          tax_year,
          is_active: true,
          display_order: 0
        }
      ])

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error creating country:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export async function deleteCountry(countryId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('countries')
      .delete()
      .eq('id', countryId)
    if (error) {
      throw new Error(error.message)
    }
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error deleting country:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export async function updateCountry(formData: FormData, countryId: string) {
  try {
    const supabase = await createClient()
    const name = formData.get('name') as string
    const code = formData.get('code') as string
    const currency_code = formData.get('currency_code') as string
    const currency_symbol = formData.get('currency_symbol') as string
    const tax_year = parseInt(formData.get('tax_year') as string) || 2025
    const is_active = formData.get('is_active') === 'true'
    if (!name || !code || !currency_code || !currency_symbol) {
      throw new Error('All fields are required')
    }
    const { error } = await supabase
      .from('countries')
      .update({
        name,
        code,
        currency_code,
        currency_symbol,
        tax_year,
        is_active
      })
      .eq('id', countryId)
    if (error) {
      throw new Error(error.message)
    }
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error updating country:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export async function createBenefitProvider(formData: FormData) {
  try {
    const supabase = await createClient()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const website_url = formData.get('website_url') as string
    if (!name || !website_url) {
      throw new Error('Name and website URL are required')
    }
    const { error } = await supabase
      .from('benefit_providers')
      .insert([
        { name, description, website_url }
      ])
    if (error) {
      throw new Error(error.message)
    }
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error creating benefit provider:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export async function deleteBenefitProvider(providerId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('benefit_providers')
      .delete()
      .eq('id', providerId)
    if (error) {
      throw new Error(error.message)
    }
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error deleting benefit provider:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export async function updateBenefitProvider(formData: FormData, providerId: string) {
  try {
    const supabase = await createClient()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const website_url = formData.get('website_url') as string
    if (!name || !website_url) {
      throw new Error('Name and website URL are required')
    }
    const { error } = await supabase
      .from('benefit_providers')
      .update({ name, description, website_url })
      .eq('id', providerId)
    if (error) {
      throw new Error(error.message)
    }
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error updating benefit provider:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
  }
} 