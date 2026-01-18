/**
 * Utilitários para validação de dados
 */

/**
 * Valida formato de email usando regex
 * @param email - String de email a ser validada
 * @returns true se formato válido, false caso contrário
 * @example
 * isValidEmail("usuario@exemplo.com") // true
 * isValidEmail("email.invalido") // false
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Valida estrutura de CPF brasileiro (apenas formato, sem consulta online)
 * Verifica formato e dígitos verificadores
 * @param cpf - String de CPF a ser validada
 * @returns true se CPF válido, false caso contrário
 * @example
 * isValidCPF("123.456.789-09") // true (se dígitos verificadores corretos)
 * isValidCPF("000.000.000-00") // false
 */
export const isValidCPF = (cpf: string): boolean => {
  if (!cpf || typeof cpf !== 'string') {
    return false
  }

  // Remove formatação
  const cleaned = cpf.replace(/[^\d]/g, '')

  // Verifica se tem 11 dígitos
  if (cleaned.length !== 11) {
    return false
  }

  // Verifica se todos os dígitos são iguais (CPFs inválidos)
  if (/^(\d)\1{10}$/.test(cleaned)) {
    return false
  }

  // Validação dos dígitos verificadores
  let sum = 0
  let remainder

  // Valida primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false

  // Valida segundo dígito verificador
  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false

  return true
}

/**
 * Verifica se data é válida e não é futura (quando aplicável)
 * @param date - Data a ser validada
 * @param allowFuture - Se true, permite datas futuras (padrão: false)
 * @returns true se data válida e dentro dos critérios, false caso contrário
 * @example
 * isValidDate(new Date()) // true
 * isValidDate(new Date(2025, 11, 31)) // false (futuro não permitido por padrão)
 * isValidDate(new Date(2025, 11, 31), true) // true (futuro permitido)
 */
export const isValidDate = (date: Date, allowFuture: boolean = false): boolean => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return false
  }

  if (!allowFuture) {
    const now = new Date()
    if (date.getTime() > now.getTime()) {
      return false
    }
  }

  return true
}

/**
 * Verifica se valor é número positivo maior que zero
 * @param value - Valor a ser validado
 * @returns true se número positivo > 0, false caso contrário
 * @example
 * isPositiveNumber(100) // true
 * isPositiveNumber(0) // false
 * isPositiveNumber(-10) // false
 * isPositiveNumber(NaN) // false
 */
export const isPositiveNumber = (value: number): boolean => {
  return typeof value === 'number' && !isNaN(value) && value > 0 && isFinite(value)
}
