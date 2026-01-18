/**
 * Utilitários para formatação e manipulação de datas
 */

/**
 * Formata uma data como string no formato DD/MM/AAAA
 * @param date - Objeto Date a ser formatado
 * @returns String formatada como "15/01/2024"
 * @example
 * formatDate(new Date(2024, 0, 15)) // "15/01/2024"
 */
export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Formata uma data em formato extenso em português
 * @param date - Objeto Date a ser formatado
 * @returns String formatada como "15 de Janeiro de 2024"
 * @example
 * formatDateLong(new Date(2024, 0, 15)) // "15 de janeiro de 2024"
 */
export const formatDateLong = (date: Date): string => {
  const months = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ]

  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return `${day} de ${month} de ${year}`
}

/**
 * Formata um intervalo de datas
 * @param startDate - Data inicial
 * @param endDate - Data final
 * @returns String formatada como "01 jan - 31 jan, 2024" ou "01 jan 2023 - 31 jan 2024" se cruzar anos
 * @example
 * formatDateRange(new Date(2024, 0, 1), new Date(2024, 0, 31)) // "01 jan - 31 jan, 2024"
 * formatDateRange(new Date(2023, 11, 1), new Date(2024, 0, 31)) // "01 dez 2023 - 31 jan 2024"
 */
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

  const formatDayMonth = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = months[date.getMonth()]
    return `${day} ${month}`
  }

  const startYear = startDate.getFullYear()
  const endYear = endDate.getFullYear()

  // Se mesmo ano, mostrar ano apenas no final
  if (startYear === endYear) {
    return `${formatDayMonth(startDate)} - ${formatDayMonth(endDate)}, ${startYear}`
  }

  // Anos diferentes, incluir ano em ambas
  return `${formatDayMonth(startDate)} ${startYear} - ${formatDayMonth(endDate)} ${endYear}`
}

/**
 * Formata data relativa em português
 * @param date - Objeto Date a ser formatado
 * @returns String formatada como "Hoje", "Ontem", "Há 3 dias", "Há 2 semanas"
 * @example
 * formatRelativeDate(new Date()) // "Hoje"
 * formatRelativeDate(new Date(Date.now() - 86400000)) // "Ontem"
 * formatRelativeDate(new Date(Date.now() - 259200000)) // "Há 3 dias"
 */
export const formatRelativeDate = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  // Normalizar datas para comparar apenas dia/mês/ano
  const normalizeDate = (d: Date) => {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }

  const normalizedDate = normalizeDate(date)
  const normalizedNow = normalizeDate(now)

  // Hoje
  if (normalizedDate.getTime() === normalizedNow.getTime()) {
    return 'Hoje'
  }

  // Ontem
  const yesterday = new Date(normalizedNow)
  yesterday.setDate(yesterday.getDate() - 1)
  if (normalizedDate.getTime() === yesterday.getTime()) {
    return 'Ontem'
  }

  // Dias
  if (diffDays < 7) {
    return `Há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`
  }

  // Semanas
  if (diffWeeks < 4) {
    return `Há ${diffWeeks} ${diffWeeks === 1 ? 'semana' : 'semanas'}`
  }

  // Meses
  if (diffMonths < 12) {
    return `Há ${diffMonths} ${diffMonths === 1 ? 'mês' : 'meses'}`
  }

  // Anos ou mais antigo
  return formatDate(date)
}
