import { supabase } from '@/lib/supabase'
import { TransactionType } from '@/types'

/**
 * Serviço para gerenciar categorias no Supabase
 */

export interface Category {
  id: string
  name: string
  icon: string
  type: TransactionType
  color: string
  isActive: boolean
  createdAt: Date
}

// Converter Category para formato Supabase
const toSupabaseCategory = (category: Omit<Category, 'id' | 'createdAt'>): any => {
  return {
    name: category.name,
    icon: category.icon || '📌',
    type: category.type.toUpperCase() as 'INCOME' | 'EXPENSE',
    color: category.color || '#3247FF',
    is_active: category.isActive !== false,
  }
}

// Converter categoria do Supabase para formato local
const fromSupabaseCategory = (row: any): Category => {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon || '📌',
    type: row.type.toLowerCase() as TransactionType,
    color: row.color || '#3247FF',
    isActive: row.is_active !== false,
    createdAt: new Date(row.created_at),
  }
}

/**
 * Buscar todas as categorias do usuário
 */
export const getCategories = async (
  userId: string,
  type?: TransactionType
): Promise<{ data: Category[] | null; error: Error | null }> => {
  try {
    let query = supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (type) {
      query = query.eq('type', type.toUpperCase())
    }

    const { data, error } = await query

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const categories = data?.map(fromSupabaseCategory) || []
    return { data: categories, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao buscar categorias') }
  }
}

/**
 * Buscar categoria específica por ID
 */
export const getCategory = async (
  userId: string,
  categoryId: string
): Promise<{ data: Category | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const category = fromSupabaseCategory(data)
    return { data: category, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao buscar categoria') }
  }
}

/**
 * Criar nova categoria
 */
export const createCategory = async (
  userId: string,
  category: Omit<Category, 'id' | 'createdAt'>
): Promise<{ data: Category | null; error: Error | null }> => {
  try {
    const supabaseData = toSupabaseCategory(category)
    supabaseData.user_id = userId

    const { data, error } = await supabase.from('categories').insert(supabaseData).select().single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const newCategory = fromSupabaseCategory(data)
    return { data: newCategory, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao criar categoria') }
  }
}

/**
 * Atualizar categoria
 */
export const updateCategory = async (
  id: string,
  updates: Partial<Category>
): Promise<{ data: Category | null; error: Error | null }> => {
  try {
    const supabaseUpdates: any = {}

    if (updates.name !== undefined) supabaseUpdates.name = updates.name
    if (updates.icon !== undefined) supabaseUpdates.icon = updates.icon
    if (updates.type !== undefined) supabaseUpdates.type = updates.type.toUpperCase()
    if (updates.color !== undefined) supabaseUpdates.color = updates.color
    if (updates.isActive !== undefined) supabaseUpdates.is_active = updates.isActive

    const { data, error } = await supabase
      .from('categories')
      .update(supabaseUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const updatedCategory = fromSupabaseCategory(data)
    return { data: updatedCategory, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao atualizar categoria') }
  }
}

/**
 * Deletar categoria (soft delete via is_active)
 */
export const deleteCategory = async (id: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.from('categories').update({ is_active: false }).eq('id', id)

    if (error) {
      return { error: new Error(error.message) }
    }

    return { error: null }
  } catch (error) {
    return { error: error instanceof Error ? error : new Error('Erro desconhecido ao deletar categoria') }
  }
}
