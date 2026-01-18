/**
 * Utilitários para formatação e manipulação de valores monetários
 */

/**
 * Formata um valor numérico como moeda brasileira (BRL)
 * @param value - Valor numérico a ser formatado
 * @returns String formatada como "R$ 1.234,56"
 * @example
 * formatCurrency(1234.56) // "R$ 1.234,56"
 * formatCurrency(0) // "R$ 0,00"
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Formata valores grandes em formato compacto para uso em gráficos
 * @param value - Valor numérico a ser formatado
 * @returns String formatada compacta como "R$ 2,5k" ou "R$ 1,2M"
 * @example
 * formatCompactCurrency(2500) // "R$ 2,5k"
 * formatCompactCurrency(1200000) // "R$ 1,2M"
 * formatCompactCurrency(999) // "R$ 999,00"
 */
export const formatCompactCurrency = (value: number): string => {
  if (value >= 1000000) {
    const millions = value / 1000000
    return `R$ ${millions.toFixed(1).replace('.', ',')}M`
  }
  if (value >= 1000) {
    const thousands = value / 1000
    return `R$ ${thousands.toFixed(1).replace('.', ',')}k`
  }
  return formatCurrency(value)
}

/**
 * Converte string de input do usuário em número limpo
 * Remove "R$", pontos de milhar, troca vírgula por ponto
 * @param input - String digitada pelo usuário
 * @returns Número limpo ou NaN se inválido
 * @example
 * parseCurrencyInput("R$ 1.234,56") // 1234.56
 * parseCurrencyInput("1.234,56") // 1234.56
 * parseCurrencyInput("1234,56") // 1234.56
 */
export const parseCurrencyInput = (input: string): number => {
  if (!input || typeof input !== 'string') {
    return NaN
  }

  // Remove "R$", espaços e símbolos de moeda
  let cleaned = input
    .replace(/R\$\s*/g, '')
    .replace(/\s+/g, '')
    .trim()

  // Remove pontos de milhar
  cleaned = cleaned.replace(/\./g, '')

  // Troca vírgula por ponto para conversão
  cleaned = cleaned.replace(',', '.')

  const parsed = parseFloat(cleaned)

  return isNaN(parsed) ? NaN : parsed
}
