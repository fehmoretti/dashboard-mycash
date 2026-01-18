import { Transaction } from '@/types'

/**
 * Utilitários para manipulação de arrays e objetos
 */

/**
 * Agrupa transações por categoria e soma os valores
 * @param transactions - Array de transações
 * @returns Objeto com categorias como chaves e valores somados
 * @example
 * groupByCategory([{category: "Alimentação", value: 100}, {category: "Alimentação", value: 50}])
 * // { "Alimentação": 150 }
 */
export const groupByCategory = (transactions: Transaction[]): Record<string, number> => {
  return transactions.reduce((acc, transaction) => {
    const category = transaction.category
    acc[category] = (acc[category] || 0) + transaction.value
    return acc
  }, {} as Record<string, number>)
}

/**
 * Filtra transações por intervalo de datas
 * @param transactions - Array de transações
 * @param dateRange - Objeto com startDate e endDate
 * @returns Array de transações dentro do intervalo
 * @example
 * filterByDateRange(transactions, {startDate: new Date(2024, 0, 1), endDate: new Date(2024, 0, 31)})
 */
export const filterByDateRange = (
  transactions: Transaction[],
  dateRange: { startDate: Date; endDate: Date }
): Transaction[] => {
  const { startDate, endDate } = dateRange

  // Normalizar datas para comparar apenas dia/mês/ano (sem hora)
  const normalizeDate = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  const normalizedStart = normalizeDate(startDate).getTime()
  const normalizedEnd = normalizeDate(endDate).getTime()

  return transactions.filter((transaction) => {
    const transactionTime = normalizeDate(transaction.date).getTime()
    return transactionTime >= normalizedStart && transactionTime <= normalizedEnd
  })
}

/**
 * Ordena array de transações por data
 * @param transactions - Array de transações
 * @param order - Ordem de classificação: 'asc' (mais antigas primeiro) ou 'desc' (mais recentes primeiro)
 * @returns Array ordenado de transações
 * @example
 * sortByDate(transactions, 'desc') // Mais recentes primeiro
 * sortByDate(transactions, 'asc') // Mais antigas primeiro
 */
export const sortByDate = (transactions: Transaction[], order: 'asc' | 'desc' = 'desc'): Transaction[] => {
  const sorted = [...transactions].sort((a, b) => {
    const dateA = a.date.getTime()
    const dateB = b.date.getTime()
    return order === 'asc' ? dateA - dateB : dateB - dateA
  })

  return sorted
}
