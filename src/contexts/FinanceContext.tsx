import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import {
  Transaction,
  Goal,
  CreditCard,
  BankAccount,
  FamilyMember,
  DateRange,
  CategoryExpense,
} from '@/types'
import {
  mockTransactions,
  mockGoals,
  mockCreditCards,
  mockBankAccounts,
  mockFamilyMembers,
} from './mockData'

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
  // Estados dos arrays principais (inicializados com dados mock)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [goals, setGoals] = useState<Goal[]>(mockGoals)
  const [creditCards, setCreditCards] = useState<CreditCard[]>(mockCreditCards)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(mockFamilyMembers)

  // Estados de filtros
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | null>(null)
  const [transactionType, setTransactionType] = useState<'all' | 'income' | 'expense'>('all')
  const [searchText, setSearchText] = useState<string>('')

  // Funções CRUD - Transactions
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date(),
    }
    setTransactions((prev) => [...prev, newTransaction])
  }, [])

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((txn) => (txn.id === id ? { ...txn, ...updates } : txn))
    )
  }, [])

  const deleteTransaction = useCallback((id: string) => {
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
  const addCreditCard = useCallback((card: Omit<CreditCard, 'id' | 'createdAt'>) => {
    const newCard: CreditCard = {
      ...card,
      id: `cc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }
    setCreditCards((prev) => [...prev, newCard])
  }, [])

  const updateCreditCard = useCallback((id: string, updates: Partial<CreditCard>) => {
    setCreditCards((prev) => prev.map((card) => (card.id === id ? { ...card, ...updates } : card)))
  }, [])

  const deleteCreditCard = useCallback((id: string) => {
    setCreditCards((prev) => prev.filter((card) => card.id !== id))
  }, [])

  // Funções CRUD - BankAccounts
  const addBankAccount = useCallback((account: Omit<BankAccount, 'id' | 'createdAt'>) => {
    const newAccount: BankAccount = {
      ...account,
      id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }
    setBankAccounts((prev) => [...prev, newAccount])
  }, [])

  const updateBankAccount = useCallback((id: string, updates: Partial<BankAccount>) => {
    setBankAccounts((prev) =>
      prev.map((account) => (account.id === id ? { ...account, ...updates } : account))
    )
  }, [])

  const deleteBankAccount = useCallback((id: string) => {
    setBankAccounts((prev) => prev.filter((account) => account.id !== id))
  }, [])

  // Funções CRUD - FamilyMembers
  const addFamilyMember = useCallback((member: Omit<FamilyMember, 'id' | 'createdAt'>) => {
    const newMember: FamilyMember = {
      ...member,
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }
    setFamilyMembers((prev) => [...prev, newMember])
  }, [])

  const updateFamilyMember = useCallback((id: string, updates: Partial<FamilyMember>) => {
    setFamilyMembers((prev) =>
      prev.map((member) => (member.id === id ? { ...member, ...updates } : member))
    )
  }, [])

  const deleteFamilyMember = useCallback((id: string) => {
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
