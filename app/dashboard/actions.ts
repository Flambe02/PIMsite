'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
    const filePath = `user_uploads/${user.id}/${fileName}`

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

    // Insert record into user_payslip_uploads table
    const { error: dbError } = await supabase
      .from('user_payslip_uploads')
      .insert([
        {
          user_id: user.id,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          file_url: urlData.publicUrl,
          upload_date: new Date().toISOString()
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
      .from('user_payslip_uploads')
      .select('*')
      .eq('user_id', user.id)
      .order('upload_date', { ascending: false })

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