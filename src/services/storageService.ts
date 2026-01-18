import { supabase } from '@/lib/supabase'

/**
 * Serviço para gerenciar uploads de arquivos no Supabase Storage
 */

export interface UploadOptions {
  bucket: 'avatars' | 'account-logos' | 'documents'
  userId: string
  file: File
  path?: string // Caminho opcional dentro do bucket (ex: "avatar.jpg")
}

/**
 * Faz upload de um arquivo para o Supabase Storage
 */
export const uploadFile = async ({ bucket, userId, file, path }: UploadOptions): Promise<{ data: { path: string } | null; error: Error | null }> => {
  try {
    // Gerar caminho se não fornecido: {userId}/{filename}
    const filePath = path || `${userId}/${Date.now()}_${file.name}`

    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false, // Não sobrescrever se existir
    })

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    return { data: { path: data.path }, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido no upload') }
  }
}

/**
 * Obtém URL pública de um arquivo
 */
export const getPublicUrl = (bucket: 'avatars' | 'account-logos' | 'documents', path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Deleta um arquivo do Storage
 */
export const deleteFile = async (bucket: 'avatars' | 'account-logos' | 'documents', path: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      return { error: new Error(error.message) }
    }

    return { error: null }
  } catch (error) {
    return { error: error instanceof Error ? error : new Error('Erro desconhecido ao deletar arquivo') }
  }
}

/**
 * Faz upload de avatar (helper específico)
 */
export const uploadAvatar = async (userId: string, file: File): Promise<{ data: { url: string } | null; error: Error | null }> => {
  const { data, error } = await uploadFile({
    bucket: 'avatars',
    userId,
    file,
  })

  if (error || !data) {
    return { data: null, error }
  }

  const url = getPublicUrl('avatars', data.path)
  return { data: { url }, error: null }
}

/**
 * Faz upload de logo de conta/cartão (helper específico)
 */
export const uploadAccountLogo = async (userId: string, file: File): Promise<{ data: { url: string } | null; error: Error | null }> => {
  const { data, error } = await uploadFile({
    bucket: 'account-logos',
    userId,
    file,
  })

  if (error || !data) {
    return { data: null, error }
  }

  const url = getPublicUrl('account-logos', data.path)
  return { data: { url }, error: null }
}
