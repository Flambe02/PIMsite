'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { newUploadId } from '@/lib/utils'

export async function uploadPayslip(formData: FormData) {
  try {
    const supabase = await createClient()
    
    // Get current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'Utilisateur non authentifié' }
    }

    // Get file from form data
    const file = formData.get('payslip') as File
    
    if (!file) {
      return { success: false, error: 'Aucun fichier sélectionné' }
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Type de fichier non supporté. Utilisez PDF, JPG ou PNG.' }
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return { success: false, error: 'Fichier trop volumineux. Taille maximum : 10MB' }
    }

    // Generate unique file path
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileExtension = file.name.split('.').pop()
    const fileName = `${file.name.replace(/\.[^/.]+$/, '')}_${timestamp}.${fileExtension}`
    const filePath = `${user.id}/${fileName}`

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('payslips')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { success: false, error: 'Erreur lors de l\'upload du fichier' }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('payslips')
      .getPublicUrl(filePath)

    const previewUrl = urlData.publicUrl

    // Insert record into holerites table
    const { error: dbError } = await supabase
      .from('holerites')
      .insert([
        {
          user_id: user.id,
          upload_id: newUploadId(),
          nome: 'Upload automatique',
          empresa: 'À définir',
          salario_liquido: '0',
          structured_data: { uploaded_file: file.name },
          preview_url: previewUrl
        }
      ])

    if (dbError) {
      console.error('Database error:', dbError)
      // Try to delete the uploaded file if database insert fails
      await supabase.storage.from('payslips').remove([filePath])
      return { success: false, error: 'Erreur lors de l\'enregistrement en base de données' }
    }

    revalidatePath('/dashboard')
    return { success: true, message: 'Bulletin de paie uploadé avec succès' }
  } catch (error) {
    console.error('Error uploading payslip:', error)
    return { success: false, error: 'Erreur inattendue lors de l\'upload' }
  }
}

export async function getUserPayslips() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'Utilisateur non authentifié', data: [] }
    }

    const { data: payslips, error } = await supabase
      .from('holerites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching payslips:', error)
      return { success: false, error: 'Erreur lors de la récupération des bulletins', data: [] }
    }

    return { success: true, data: payslips || [] }
  } catch (error) {
    console.error('Error getting user payslips:', error)
    return { success: false, error: 'Erreur inattendue', data: [] }
  }
}

export async function getLatestPayrollAnalysis() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'Utilisateur non authentifié', data: null }
    }

    const { data: latestPayslip, error } = await supabase
      .from('holerites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching latest payslip:', error)
      return { success: false, error: 'Erreur lors de la récupération de l\'analyse', data: null }
    }

    return { success: true, data: latestPayslip }
  } catch (error) {
    console.error('Error getting latest payroll analysis:', error)
    return { success: false, error: 'Erreur inattendue', data: null }
  }
} 