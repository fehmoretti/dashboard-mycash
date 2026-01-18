import { supabase } from '@/lib/supabase'
import { CreditCard, BankAccount } from '@/types'

/**
 * Serviço para gerenciar contas e cartões no Supabase
 */

// Converter CreditCard para formato Supabase
const creditCardToSupabase = (card: Omit<CreditCard, 'id' | 'createdAt'>): any => {
  return {
    type: 'CREDIT_CARD',
    name: card.name,
    bank: card.name.split(' ')[0] || 'Banco', // Extrair nome do banco do nome do cartão
    last_digits: card.lastDigits || null,
    holder_id: card.holderId,
    credit_limit: card.limit,
    current_bill: card.currentBill || 0,
    due_day: card.dueDay,
    closing_day: card.closingDay,
    theme: card.theme || 'black',
    logo_url: null,
  }
}

// Converter BankAccount para formato Supabase
const bankAccountToSupabase = (account: Omit<BankAccount, 'id' | 'createdAt'>): any => {
  return {
    type: 'CHECKING', // Assumindo conta corrente por padrão
    name: account.name,
    bank: account.name.split(' ')[0] || 'Banco', // Extrair nome do banco
    last_digits: null,
    holder_id: account.holderId,
    balance: account.balance || 0,
    credit_limit: null,
    current_bill: null,
    due_day: null,
    closing_day: null,
    theme: null,
    logo_url: null,
  }
}

// Converter conta do Supabase para CreditCard
const fromSupabaseToCreditCard = (row: any): CreditCard => {
  return {
    id: row.id,
    name: row.name,
    type: 'creditCard',
    holderId: row.holder_id,
    closingDay: row.closing_day || 1,
    dueDay: row.due_day || 1,
    limit: parseFloat(row.credit_limit || 0),
    currentBill: parseFloat(row.current_bill || 0),
    theme: (row.theme || 'black') as 'black' | 'lime' | 'white',
    lastDigits: row.last_digits || undefined,
    createdAt: new Date(row.created_at),
  }
}

// Converter conta do Supabase para BankAccount
const fromSupabaseToBankAccount = (row: any): BankAccount => {
  return {
    id: row.id,
    name: row.name,
    type: 'account',
    holderId: row.holder_id,
    balance: parseFloat(row.balance || 0),
    createdAt: new Date(row.created_at),
  }
}

/**
 * Buscar todos os cartões de crédito do usuário
 */
export const getCreditCards = async (userId: string): Promise<{ data: CreditCard[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'CREDIT_CARD')
      .eq('is_active', true)

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const cards = data?.map(fromSupabaseToCreditCard) || []
    return { data: cards, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao buscar cartões') }
  }
}

/**
 * Buscar todas as contas bancárias do usuário
 */
export const getBankAccounts = async (userId: string): Promise<{ data: BankAccount[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .in('type', ['CHECKING', 'SAVINGS'])
      .eq('is_active', true)

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const accounts = data?.map(fromSupabaseToBankAccount) || []
    return { data: accounts, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao buscar contas') }
  }
}

/**
 * Criar novo cartão de crédito
 */
export const createCreditCard = async (
  userId: string,
  card: Omit<CreditCard, 'id' | 'createdAt'>
): Promise<{ data: CreditCard | null; error: Error | null }> => {
  try {
    const supabaseData = creditCardToSupabase(card)
    supabaseData.user_id = userId

    const { data, error } = await supabase.from('accounts').insert(supabaseData).select().single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const newCard = fromSupabaseToCreditCard(data)
    return { data: newCard, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao criar cartão') }
  }
}

/**
 * Criar nova conta bancária
 */
export const createBankAccount = async (
  userId: string,
  account: Omit<BankAccount, 'id' | 'createdAt'>
): Promise<{ data: BankAccount | null; error: Error | null }> => {
  try {
    const supabaseData = bankAccountToSupabase(account)
    supabaseData.user_id = userId

    const { data, error } = await supabase.from('accounts').insert(supabaseData).select().single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const newAccount = fromSupabaseToBankAccount(data)
    return { data: newAccount, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao criar conta') }
  }
}

/**
 * Atualizar cartão de crédito
 */
export const updateCreditCard = async (
  id: string,
  updates: Partial<CreditCard>
): Promise<{ data: CreditCard | null; error: Error | null }> => {
  try {
    const supabaseUpdates: any = {}

    if (updates.name !== undefined) supabaseUpdates.name = updates.name
    if (updates.limit !== undefined) supabaseUpdates.credit_limit = updates.limit
    if (updates.currentBill !== undefined) supabaseUpdates.current_bill = updates.currentBill
    if (updates.dueDay !== undefined) supabaseUpdates.due_day = updates.dueDay
    if (updates.closingDay !== undefined) supabaseUpdates.closing_day = updates.closingDay
    if (updates.theme !== undefined) supabaseUpdates.theme = updates.theme
    if (updates.lastDigits !== undefined) supabaseUpdates.last_digits = updates.lastDigits

    const { data, error } = await supabase
      .from('accounts')
      .update(supabaseUpdates)
      .eq('id', id)
      .eq('type', 'CREDIT_CARD')
      .select()
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const updatedCard = fromSupabaseToCreditCard(data)
    return { data: updatedCard, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao atualizar cartão') }
  }
}

/**
 * Atualizar conta bancária
 */
export const updateBankAccount = async (
  id: string,
  updates: Partial<BankAccount>
): Promise<{ data: BankAccount | null; error: Error | null }> => {
  try {
    const supabaseUpdates: any = {}

    if (updates.name !== undefined) supabaseUpdates.name = updates.name
    if (updates.balance !== undefined) supabaseUpdates.balance = updates.balance

    const { data, error } = await supabase
      .from('accounts')
      .update(supabaseUpdates)
      .eq('id', id)
      .in('type', ['CHECKING', 'SAVINGS'])
      .select()
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    const updatedAccount = fromSupabaseToBankAccount(data)
    return { data: updatedAccount, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido ao atualizar conta') }
  }
}

/**
 * Deletar cartão/conta (soft delete via is_active)
 */
export const deleteAccount = async (id: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.from('accounts').update({ is_active: false }).eq('id', id)

    if (error) {
      return { error: new Error(error.message) }
    }

    return { error: null }
  } catch (error) {
    return { error: error instanceof Error ? error : new Error('Erro desconhecido ao deletar conta/cartão') }
  }
}
