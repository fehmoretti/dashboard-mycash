import { supabase } from '@/lib/supabase'
import { Transaction, TransactionType, TransactionStatus } from '@/types'

/**
 * Serviço para gerenciar transações no Supabase
 */

// Converter Transaction do formato local para formato Supabase
const toSupabaseTransaction = (transaction: Omit<Transaction, 'id' | 'date'>): any => {
  return {
    type: transaction.type.toUpperCase() as 'INCOME' | 'EXPENSE',
    amount: transaction.value,
    description: transaction.description,
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    category_id: null, // TODO: Mapear category string para category_id
    account_id: transaction.accountId,
    member_id: transaction.memberId,
    installment_number: transaction.installments > 1 ? 1 : null,
    total_installments: transaction.installments || 1,
    parent_transaction_id: null,
    is_recurring: transaction.isRecurring || false,
    recurring_transaction_id: null,
    status: (transaction.status || 'COMPLETED').toUpperCase() as 'PENDING' | 'COMPLETED',
    notes: transaction.dueDate ? `Vencimento: ${transaction.dueDate.toISOString().split('T')[0]}` : null,
  }
}

// Converter transação do Supabase para formato local
const fromSupabaseTransaction = (row: any): Transaction => {
  return {
    id: row.id,
    type: row.type.toLowerCase() as TransactionType,
    value: parseFloat(row.amount),
    description: row.description,
    category: '', // TODO: Buscar nome da categoria via category_id
    date: new Date(row.date),
    accountId: row.account_id,
    memberId: row.member_id,
    installments: row.total_installments || 1,
    status: (row.status?.toLowerCase() || 'completed') as TransactionStatus,
    isRecurring: row.is_recurring || false,
    isPaid: row.status === 'COMPLETED',
    dueDate: row.notes ? new Date(row.notes.split('Vencimento: ')[1]) : undefined,
  }
}

/**
 * Buscar todas as transações do usuário atual
 */
export const getTransactions = async (userId: string): Promise<{ data: Transaction[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const transactions = data?.map(fromSupabaseTransaction) || []
    return { data: transactions, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao buscar transações') }
  }
}

/**
 * Buscar transações com filtros
 */
export const getFilteredTransactions = async (
  userId: string,
  filters?: {
    memberId?: string | null
    type?: 'all' | 'income' | 'expense'
    startDate?: Date
    endDate?: Date
    searchText?: string
  }
): Promise<{ data: Transaction[] | null; error: Error | null }> => {
  try {
    let query = supabase.from('transactions').select('*').eq('user_id', userId)

    // Aplicar filtros
    if (filters?.memberId) {
      query = query.eq('member_id', filters.memberId)
    }

    if (filters?.type && filters.type !== 'all') {
      query = query.eq('type', filters.type.toUpperCase())
    }

    if (filters?.startDate) {
      query = query.gte('date', filters.startDate.toISOString().split('T')[0])
    }

    if (filters?.endDate) {
      query = query.lte('date', filters.endDate.toISOString().split('T')[0])
    }

    const { data, error } = await query.order('date', { ascending: false })

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    let transactions = data?.map(fromSupabaseTransaction) || []

    // Filtro de busca textual (local, pois não está no banco)
    if (filters?.searchText && filters.searchText.trim()) {
      const searchLower = filters.searchText.toLowerCase()
      transactions = transactions.filter(
        (txn) =>
          txn.description.toLowerCase().includes(searchLower) ||
          txn.category.toLowerCase().includes(searchLower)
      )
    }

    return { data: transactions, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao buscar transações') }
  }
}

/**
 * Criar nova transação
 */
export const createTransaction = async (
  userId: string,
  transaction: Omit<Transaction, 'id' | 'date'>
): Promise<{ data: Transaction | null; error: Error | null }> => {
  try {
    const supabaseData = toSupabaseTransaction(transaction)
    supabaseData.user_id = userId

    const { data, error } = await supabase.from('transactions').insert(supabaseData).select().single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const newTransaction = fromSupabaseTransaction(data)
    return { data: newTransaction, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao criar transação') }
  }
}

/**
 * Atualizar transação existente
 */
export const updateTransaction = async (
  id: string,
  updates: Partial<Transaction>
): Promise<{ data: Transaction | null; error: Error | null }> => {
  try {
    const supabaseUpdates: any = {}

    if (updates.type !== undefined) {
      supabaseUpdates.type = updates.type.toUpperCase()
    }
    if (updates.value !== undefined) {
      supabaseUpdates.amount = updates.value
    }
    if (updates.description !== undefined) {
      supabaseUpdates.description = updates.description
    }
    if (updates.accountId !== undefined) {
      supabaseUpdates.account_id = updates.accountId
    }
    if (updates.memberId !== undefined) {
      supabaseUpdates.member_id = updates.memberId
    }
    if (updates.status !== undefined) {
      supabaseUpdates.status = updates.status.toUpperCase()
    }
    if (updates.isRecurring !== undefined) {
      supabaseUpdates.is_recurring = updates.isRecurring
    }

    const { data, error } = await supabase
      .from('transactions')
      .update(supabaseUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const updatedTransaction = fromSupabaseTransaction(data)
    return { data: updatedTransaction, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao atualizar transação') }
  }
}

/**
 * Deletar transação
 */
export const deleteTransaction = async (id: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.from('transactions').delete().eq('id', id)

    if (error) {
      return { error: new Error(error.message) }
    }

    return { error: null }
  } catch (error) {
    return { error: error instanceof Error ? error : new Error('Erro desconhecido ao deletar transação') }
  }
}
