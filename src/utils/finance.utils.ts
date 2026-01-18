/**
 * Utilitários para cálculos financeiros
 */

/**
 * Calcula percentual de um valor parcial em relação ao total
 * @param partial - Valor parcial
 * @param total - Valor total
 * @param decimals - Número de casas decimais (padrão: 1)
 * @returns Percentual com uma casa decimal, ou 0 se divisão por zero
 * @example
 * calculatePercentage(25, 100) // 25.0
 * calculatePercentage(0, 0) // 0
 * calculatePercentage(33.333, 100, 2) // 33.33
 */
export const calculatePercentage = (partial: number, total: number, decimals: number = 1): number => {
  if (total === 0 || isNaN(total) || isNaN(partial)) {
    return 0
  }

  const percentage = (partial / total) * 100
  const multiplier = Math.pow(10, decimals)
  return Math.round(percentage * multiplier) / multiplier
}

/**
 * Calcula diferença absoluta e percentual entre dois valores
 * @param oldValue - Valor antigo
 * @param newValue - Valor novo
 * @returns Objeto com diferença absoluta e percentual de variação
 * @example
 * calculateDifference(100, 120) // { absolute: 20, percentage: 20.0 }
 * calculateDifference(100, 80) // { absolute: -20, percentage: -20.0 }
 */
export const calculateDifference = (
  oldValue: number,
  newValue: number
): { absolute: number; percentage: number } => {
  const absolute = newValue - oldValue

  if (oldValue === 0) {
    return { absolute, percentage: newValue > 0 ? 100 : 0 }
  }

  const percentage = calculatePercentage(absolute, Math.abs(oldValue), 1)

  return { absolute, percentage }
}

/**
 * Calcula valor de cada parcela de um pagamento parcelado
 * @param totalValue - Valor total a ser parcelado
 * @param installments - Número de parcelas
 * @returns Valor de cada parcela arredondado para duas casas decimais
 * @example
 * calculateInstallmentValue(1000, 5) // 200.00
 * calculateInstallmentValue(1000, 3) // 333.33
 */
export const calculateInstallmentValue = (totalValue: number, installments: number): number => {
  if (installments <= 0 || isNaN(installments)) {
    return totalValue
  }

  const installmentValue = totalValue / installments
  return Math.round(installmentValue * 100) / 100
}
