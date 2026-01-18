/**
 * Helper para obter user_id para usar com Supabase
 * Tenta usar o user_id do AuthContext, ou retorna null se não houver
 */

import { supabase } from '@/lib/supabase'

// User ID temporário para usar quando RLS está desabilitado (desenvolvimento)
const TEMP_USER_ID = '00000000-0000-0000-0000-000000000000'

/**
 * Obtém o user_id atual para usar com Supabase
 * @returns user_id se houver autenticação, userId temporário se RLS desabilitado, null caso contrário
 */
export const getUserId = async (): Promise<string | null> => {
  // Verificar se as credenciais do Supabase estão configuradas
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return null
  }

  try {
    // Tentar obter sessão atual
    const { data: { session } } = await supabase.auth.getSession()
    
    // Se houver sessão, usar o user_id real
    if (session?.user?.id) {
      return session.user.id
    }

    // Se não houver sessão, usar userId temporário (funciona com RLS desabilitado)
    // ⚠️ ATENÇÃO: Isso só funciona se RLS estiver desabilitado!
    return TEMP_USER_ID
  } catch (error) {
    console.warn('Erro ao obter user_id:', error)
    // Em caso de erro, retornar userId temporário (funciona com RLS desabilitado)
    return TEMP_USER_ID
  }
}

/**
 * Verifica se o Supabase está disponível e configurado
 * @returns true se Supabase está disponível, false caso contrário
 */
export const isSupabaseAvailable = (): boolean => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  return !!(supabaseUrl && supabaseKey)
}
