import { supabase } from '@/lib/supabase'
import { FamilyMember } from '@/types'

/**
 * Serviço para gerenciar membros da família no Supabase
 */

// Converter FamilyMember para formato Supabase
const toSupabaseMember = (member: Omit<FamilyMember, 'id' | 'createdAt'>): any => {
  return {
    name: member.name,
    role: member.role,
    avatar_url: member.avatarUrl || null,
    monthly_income: member.monthlyIncome || 0,
    color: '#3247FF', // Cor padrão
    is_active: true,
  }
}

// Converter membro do Supabase para formato local
const fromSupabaseMember = (row: any): FamilyMember => {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    avatarUrl: row.avatar_url || undefined,
    monthlyIncome: parseFloat(row.monthly_income || 0) || undefined,
    createdAt: new Date(row.created_at),
  }
}

/**
 * Buscar todos os membros da família do usuário
 */
export const getFamilyMembers = async (userId: string): Promise<{ data: FamilyMember[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const members = data?.map(fromSupabaseMember) || []
    return { data: members, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao buscar membros') }
  }
}

/**
 * Buscar membro específico por ID
 */
export const getFamilyMember = async (
  userId: string,
  memberId: string
): Promise<{ data: FamilyMember | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('id', memberId)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const member = fromSupabaseMember(data)
    return { data: member, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao buscar membro') }
  }
}

/**
 * Criar novo membro da família
 */
export const createFamilyMember = async (
  userId: string,
  member: Omit<FamilyMember, 'id' | 'createdAt'>
): Promise<{ data: FamilyMember | null; error: Error | null }> => {
  try {
    const supabaseData = toSupabaseMember(member)
    supabaseData.user_id = userId

    const { data, error } = await supabase.from('family_members').insert(supabaseData).select().single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const newMember = fromSupabaseMember(data)
    return { data: newMember, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao criar membro') }
  }
}

/**
 * Atualizar membro da família
 */
export const updateFamilyMember = async (
  id: string,
  updates: Partial<FamilyMember>
): Promise<{ data: FamilyMember | null; error: Error | null }> => {
  try {
    const supabaseUpdates: any = {}

    if (updates.name !== undefined) supabaseUpdates.name = updates.name
    if (updates.role !== undefined) supabaseUpdates.role = updates.role
    if (updates.avatarUrl !== undefined) supabaseUpdates.avatar_url = updates.avatarUrl || null
    if (updates.monthlyIncome !== undefined) {
      supabaseUpdates.monthly_income = updates.monthlyIncome || 0
    }

    const { data, error } = await supabase
      .from('family_members')
      .update(supabaseUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const updatedMember = fromSupabaseMember(data)
    return { data: updatedMember, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao atualizar membro') }
  }
}

/**
 * Deletar membro da família (soft delete via is_active)
 */
export const deleteFamilyMember = async (id: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.from('family_members').update({ is_active: false }).eq('id', id)

    if (error) {
      return { error: new Error(error.message) }
    }

    return { error: null }
  } catch (error) {
    return { error: error instanceof Error ? error : new Error('Erro desconhecido ao deletar membro') }
  }
}
