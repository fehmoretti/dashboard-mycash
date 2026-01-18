import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import {
  Transaction,
  Goal,
  CreditCard,
  BankAccount,
  FamilyMember,
  DateRange,
  CategoryExpense,
} from '@/types'
// Imports removidos - dados agora vêm exclusivamente do Supabase
import {
  getTransactions,
  createTransaction,
  updateTransaction as updateTransactionService,
  deleteTransaction as deleteTransactionService,
} from '@/services/transactionService'
import {
  getCreditCards,
  getBankAccounts,
  createCreditCard,
  createBankAccount,
  updateCreditCard as updateCreditCardService,
  updateBankAccount as updateBankAccountService,
  deleteAccount,
} from '@/services/accountService'
import {
  getFamilyMembers,
  createFamilyMember,
  updateFamilyMember as updateFamilyMemberService,
  deleteFamilyMember as deleteFamilyMemberService,
} from '@/services/familyMemberService'
import { getUserId, isSupabaseAvailable } from '@/utils/getUserId'

// Interface do contexto
interface FinanceContextType {
  // Arrays principais
  transactions: Transaction[]
  goals: Goal[]
  creditCards: CreditCard[]
  bankAccounts: BankAccount[]
  familyMembers: FamilyMember[]

  // Estados de filtros
  selectedMember: string | null
  dateRange: DateRange | null
  transactionType: 'all' | 'income' | 'expense'
  searchText: string

  // Setters de filtros
  setSelectedMember: (memberId: string | null) => void
  setDateRange: (range: DateRange | null) => void
  setTransactionType: (type: 'all' | 'income' | 'expense') => void
  setSearchText: (text: string) => void

  // Funções CRUD - Transactions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void

  // Funções CRUD - Goals
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void

  // Funções CRUD - CreditCards
  addCreditCard: (card: Omit<CreditCard, 'id' | 'createdAt'>) => void
  updateCreditCard: (id: string, updates: Partial<CreditCard>) => void
  deleteCreditCard: (id: string) => void

  // Funções CRUD - BankAccounts
  addBankAccount: (account: Omit<BankAccount, 'id' | 'createdAt'>) => void
  updateBankAccount: (id: string, updates: Partial<BankAccount>) => void
  deleteBankAccount: (id: string) => void

  // Funções CRUD - FamilyMembers
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'createdAt'>) => void
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void
  deleteFamilyMember: (id: string) => void

  // Funções de cálculo derivadas
  getFilteredTransactions: () => Transaction[]
  calculateTotalBalance: () => number
  calculateIncomeForPeriod: () => number
  calculateExpensesForPeriod: () => number
  calculateExpensesByCategory: () => CategoryExpense[]
  calculateCategoryPercentage: (category: string) => number
  calculateSavingsRate: () => number
}

// Criar contexto
const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

// Provider do contexto
export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estados dos arrays principais (inicializados vazios - dados vêm do Supabase)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [creditCards, setCreditCards] = useState<CreditCard[]>([])
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])

  // Estados de filtros
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | null>(null)
  const [transactionType, setTransactionType] = useState<'all' | 'income' | 'expense'>('all')
  const [searchText, setSearchText] = useState<string>('')

  // Carregar dados do Supabase ao montar o componente
  useEffect(() => {
    const loadData = async () => {
      // Verificar se Supabase está disponível
      if (!isSupabaseAvailable()) {
        console.error('⚠️ Supabase não configurado! Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY')
        return
      }

      const userId = await getUserId()
      if (!userId) {
        console.error('⚠️ Não foi possível obter user_id do Supabase')
        return
      }

      try {
        // Carregar transações
        const { data: transactionsData, error: txnError } = await getTransactions(userId)
        if (!txnError && transactionsData) {
          setTransactions(transactionsData)
        } else if (txnError) {
          console.error('Erro ao carregar transações:', txnError)
        }

        // Carregar cartões de crédito
        const { data: cardsData, error: cardsError } = await getCreditCards(userId)
        if (!cardsError && cardsData) {
          setCreditCards(cardsData)
        } else if (cardsError) {
          console.error('Erro ao carregar cartões:', cardsError)
        }

        // Carregar contas bancárias
        const { data: accountsData, error: accountsError } = await getBankAccounts(userId)
        if (!accountsError && accountsData) {
          setBankAccounts(accountsData)
        } else if (accountsError) {
          console.error('Erro ao carregar contas:', accountsError)
        }

        // Carregar membros da família
        const { data: membersData, error: membersError } = await getFamilyMembers(userId)
        if (!membersError && membersData) {
          setFamilyMembers(membersData)
        } else if (membersError) {
          console.error('Erro ao carregar membros:', membersError)
        }
      } catch (error) {
        console.error('Erro ao carregar dados do Supabase:', error)
      }
    }

    loadData()
  }, [])

  // Funções CRUD - Transactions
  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    if (!isSupabaseAvailable()) {
      console.error('⚠️ Supabase não configurado! Não é possível criar transação.')
      return
    }

    const userId = await getUserId()
    if (!userId) {
      console.error('⚠️ Não foi possível obter user_id! Não é possível criar transação.')
      return
    }

    const { data, error } = await createTransaction(userId, transaction)
    if (error) {
      console.error('Erro ao criar transação no Supabase:', error)
      return
    }

    if (data) {
      setTransactions((prev) => [...prev, data])
    }
  }, [])

  const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    if (!isSupabaseAvailable()) {
      console.error('⚠️ Supabase não configurado! Não é possível atualizar transação.')
      return
    }

    const userId = await getUserId()
    if (!userId) {
      console.error('⚠️ Não foi possível obter user_id! Não é possível atualizar transação.')
      return
    }

    const { data, error } = await updateTransactionService(id, updates)
    if (error) {
      console.error('Erro ao atualizar transação no Supabase:', error)
      return
    }

    if (data) {
      setTransactions((prev) => prev.map((txn) => (txn.id === id ? data : txn)))
    }
  }, [])

  const deleteTransaction = useCallback(async (id: string) => {
    if (!isSupabaseAvailable()) {
      console.error('⚠️ Supabase não configurado! Não é possível deletar transação.')
      return
    }

    const userId = await getUserId()
    if (!userId) {
      console.error('⚠️ Não foi possível obter user_id! Não é possível deletar transação.')
      return
    }

    const { error } = await deleteTransactionService(id)
    if (error) {
      console.error('Erro ao deletar transação no Supabase:', error)
      return
    }

    setTransactions((prev) => prev.filter((txn) => txn.id !== id))
  }, [])

  // Funções CRUD - Goals
  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }
    setGoals((prev) => [...prev, newGoal])
  }, [])

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals((prev) => prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal)))
  }, [])

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id))
  }, [])

  // Funções CRUD - CreditCards
  const addCreditCard = useCallback(async (card: Omit<CreditCard, 'id' | 'createdAt'>) => {
    if (!isSupabaseAvailable()) {
      console.error('⚠️ Supabase não configurado! Não é possível criar cartão.')
      return
    }

    const userId = await getUserId()
    if (!userId) {
      console.error('⚠️ Não foi possível obter user_id! Não é possível criar cartão.')
      return
    }

    const { data, error } = await createCreditCard(userId, card)
    if (error) {
      console.error('Erro ao criar cartão no Supabase:', error)
      return
    }

    if (data) {
      setCreditCards((prev) => [...prev, data])
    }
  }, [])

  const updateCreditCard = useCallback(async (id: string, updates: Partial<CreditCard>) => {
    if (!isSupabaseAvailable()) {
      console.error('⚠️ Supabase não configurado! Não é possível atualizar cartão.')
      return
    }

    const userId = await getUserId()
    if (!userId) {
      console.error('⚠️ Não foi possível obter user_id! Não é possível atualizar cartão.')
      return
    }

    const { data, error } = await updateCreditCardService(id, updates)
    if (error) {
      console.error('Erro ao atualizar cartão no Supabase:', error)
      return
    }

    if (data) {
      setCreditCards((prev) => prev.map((card) => (card.id === id ? data : card)))
    }
  }, [])

  const deleteCreditCard = useCallback(async (id: string) => {
    if (!isSupabaseAvailable()) {
      console.error('⚠️ Supabase não configurado! Não é possível deletar cartão.')
      return
    }

    const userId = await getUserId()
    if (!userId) {
      console.error('⚠️ Não foi possível obter user_id! Não é possível deletar cartão.')
      return
    }

    const { error } = await deleteAccount(id)
    if (error) {
      console.error('Erro ao deletar cartão no Supabase:', error)
      return
    }

    setCreditCards((prev) => prev.filter((card) => card.id !== id))
  }, [])

  // Funções CRUD - BankAccounts
  const addBankAccount = useCallback(async (account: Omit<BankAccount, 'id' | 'createdAt'>) => {
    if (!isSupabaseAvailable()) {
      console.error('⚠️ Supabase não configurado! Não é possível criar conta.')
      return
    }

    const userId = await getUserId()
    if (!userId) {
      console.error('⚠️ Não foi possível obter user_id! Não é possível criar conta.')
      return
    }

    const { data, error } = await createBankAccount(userId, account)
    if (error) {
      console.error('Erro ao criar conta no Supabase:', error)
      return
    }

    if (data) {
      setBankAccounts((prev) => [...prev, data])
    }
  }, [])

  const updateBankAccount = useCallback(async (id: string, updates: Partial<BankAccount>) => {
    if (!isSupabaseAvailable()) {
      console.error('⚠️ Supabase não configurado! Não é possível atualizar conta.')
      return
    }

    const userId = await getUserId()
    if (!userId) {
      console.error('⚠️ Não foi possível obter user_id! Não é possível atualizar conta.')
      return
    }

    const { data, error } = await updateBankAccountService(id, updates)
    if (error) {
      console.error('Erro ao atualizar conta no Supabase:', error)
      return
    }

    if (data) {
      setBankAccounts((prev) => prev.map((account) => (account.id === id ? data : account)))
    }
  }, [])

  const deleteBankAccount = useCallback(async (id: string) => {
    if (!isSupabaseAvailable()) {
      console.error('⚠️ Supabase não configurado! Não é possível deletar conta.')
      return
    }

    const userId = await getUserId()
    if (!userId) {
      console.error('⚠️ Não foi possível obter user_id! Não é possível deletar conta.')
      return
    }

    const { error } = await deleteAccount(id)
    if (error) {
      console.error('Erro ao deletar conta no Supabase:', error)
      return
    }

    setBankAccounts((prev) => prev.filter((account) => account.id !== id))
  }, [])

  // Funções CRUD - FamilyMembers
  const addFamilyMember = useCallback(async (member: Omit<FamilyMember, 'id' | 'createdAt'>) => {
    if (!isSupabaseAvailable()) {
      console.error('⚠️ Supabase não configurado! Não é possível criar membro.')
      return
    }

    const userId = await getUserId()
    if (!userId) {
      console.error('⚠️ Não foi possível obter user_id! Não é possível criar membro.')
      return
    }

    const { data, error } = await createFamilyMember(userId, member)
    if (error) {
      console.error('Erro ao criar membro no Supabase:', error)
      return
    }

    if (data) {
      setFamilyMembers((prev) => [...prev, data])
    }
  }, [])

  const updateFamilyMember = useCallback(async (id: string, updates: Partial<FamilyMember>) => {
    if (!isSupabaseAvailable()) {
      console.error('⚠️ Supabase não configurado! Não é possível atualizar membro.')
      return
    }

    const userId = await getUserId()
    if (!userId) {
      console.error('⚠️ Não foi possível obter user_id! Não é possível atualizar membro.')
      return
    }

    const { data, error } = await updateFamilyMemberService(id, updates)
    if (error) {
      console.error('Erro ao atualizar membro no Supabase:', error)
      return
    }

    if (data) {
      setFamilyMembers((prev) => prev.map((member) => (member.id === id ? data : member)))
    }
  }, [])

  const deleteFamilyMember = useCallback(async (id: string) => {
    if (!isSupabaseAvailable()) {
      console.error('⚠️ Supabase não configurado! Não é possível deletar membro.')
      return
    }

    const userId = await getUserId()
    if (!userId) {
      console.error('⚠️ Não foi possível obter user_id! Não é possível deletar membro.')
      return
    }

    const { error } = await deleteFamilyMemberService(id)
    if (error) {
      console.error('Erro ao deletar membro no Supabase:', error)
      return
    }

    setFamilyMembers((prev) => prev.filter((member) => member.id !== id))
  }, [])

  // Função auxiliar para verificar se uma data está dentro do intervalo
  const isDateInRange = (date: Date, range: DateRange | null): boolean => {
    if (!range) return true
    const dateTime = date.getTime()
    const startTime = range.startDate.getTime()
    const endTime = range.endDate.getTime()
    return dateTime >= startTime && dateTime <= endTime
  }

  // Função auxiliar para busca textual
  const matchesSearch = (transaction: Transaction, search: string): boolean => {
    if (!search.trim()) return true
    const lowerSearch = search.toLowerCase()
    return (
      transaction.description.toLowerCase().includes(lowerSearch) ||
      transaction.category.toLowerCase().includes(lowerSearch)
    )
  }

  // Função de cálculo: getFilteredTransactions
  const getFilteredTransactions = useCallback((): Transaction[] => {
    return transactions.filter((txn) => {
      // Filtro de membro
      if (selectedMember && txn.memberId !== selectedMember) return false

      // Filtro de tipo
      if (transactionType !== 'all' && txn.type !== transactionType) return false

      // Filtro de período
      if (dateRange && !isDateInRange(txn.date, dateRange)) return false

      // Filtro de busca textual
      if (!matchesSearch(txn, searchText)) return false

      return true
    })
  }, [transactions, selectedMember, transactionType, dateRange, searchText])

  // Função de cálculo: calculateTotalBalance
  const calculateTotalBalance = useCallback((): number => {
    const accountsBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0)
    const cardsDebt = creditCards.reduce((sum, card) => sum + card.currentBill, 0)
    return accountsBalance - cardsDebt
  }, [bankAccounts, creditCards])

  // Função de cálculo: calculateIncomeForPeriod
  const calculateIncomeForPeriod = useCallback((): number => {
    const filtered = getFilteredTransactions()
    return filtered
      .filter((txn) => txn.type === 'income')
      .reduce((sum, txn) => sum + txn.value, 0)
  }, [getFilteredTransactions])

  // Função de cálculo: calculateExpensesForPeriod
  const calculateExpensesForPeriod = useCallback((): number => {
    const filtered = getFilteredTransactions()
    return filtered
      .filter((txn) => txn.type === 'expense')
      .reduce((sum, txn) => sum + txn.value, 0)
  }, [getFilteredTransactions])

  // Função de cálculo: calculateExpensesByCategory
  const calculateExpensesByCategory = useCallback((): CategoryExpense[] => {
    const filtered = getFilteredTransactions()
    const expenses = filtered.filter((txn) => txn.type === 'expense')

    const categoryMap = new Map<string, number>()
    expenses.forEach((txn) => {
      const current = categoryMap.get(txn.category) || 0
      categoryMap.set(txn.category, current + txn.value)
    })

    const incomeTotal = calculateIncomeForPeriod()
    const categoryExpenses: CategoryExpense[] = Array.from(categoryMap.entries()).map(
      ([category, total]) => ({
        category,
        total,
        percentage: incomeTotal > 0 ? (total / incomeTotal) * 100 : 0,
      })
    )

    // Ordenar por valor decrescente
    return categoryExpenses.sort((a, b) => b.total - a.total)
  }, [getFilteredTransactions, calculateIncomeForPeriod])

  // Função de cálculo: calculateCategoryPercentage
  const calculateCategoryPercentage = useCallback(
    (category: string): number => {
      const expenses = calculateExpensesByCategory()
      const categoryExpense = expenses.find((exp) => exp.category === category)
      return categoryExpense?.percentage || 0
    },
    [calculateExpensesByCategory]
  )

  // Função de cálculo: calculateSavingsRate
  const calculateSavingsRate = useCallback((): number => {
    const income = calculateIncomeForPeriod()
    const expenses = calculateExpensesForPeriod()
    if (income === 0) return 0
    return ((income - expenses) / income) * 100
  }, [calculateIncomeForPeriod, calculateExpensesForPeriod])

  // Valor do contexto
  const value: FinanceContextType = useMemo(
    () => ({
      transactions,
      goals,
      creditCards,
      bankAccounts,
      familyMembers,
      selectedMember,
      dateRange,
      transactionType,
      searchText,
      setSelectedMember,
      setDateRange,
      setTransactionType,
      setSearchText,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addGoal,
      updateGoal,
      deleteGoal,
      addCreditCard,
      updateCreditCard,
      deleteCreditCard,
      addBankAccount,
      updateBankAccount,
      deleteBankAccount,
      addFamilyMember,
      updateFamilyMember,
      deleteFamilyMember,
      getFilteredTransactions,
      calculateTotalBalance,
      calculateIncomeForPeriod,
      calculateExpensesForPeriod,
      calculateExpensesByCategory,
      calculateCategoryPercentage,
      calculateSavingsRate,
    }),
    [
      transactions,
      goals,
      creditCards,
      bankAccounts,
      familyMembers,
      selectedMember,
      dateRange,
      transactionType,
      searchText,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addGoal,
      updateGoal,
      deleteGoal,
      addCreditCard,
      updateCreditCard,
      deleteCreditCard,
      addBankAccount,
      updateBankAccount,
      deleteBankAccount,
      addFamilyMember,
      updateFamilyMember,
      deleteFamilyMember,
      getFilteredTransactions,
      calculateTotalBalance,
      calculateIncomeForPeriod,
      calculateExpensesForPeriod,
      calculateExpensesByCategory,
      calculateCategoryPercentage,
      calculateSavingsRate,
    ]
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

// Hook personalizado para acessar o contexto
export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}
