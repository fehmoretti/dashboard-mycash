/**
 * Testes básicos para funções de cálculos financeiros
 * Nota: Estes são testes simples sem framework de teste
 * Em produção, usar Jest, Vitest ou similar
 */

import { calculatePercentage, calculateDifference, calculateInstallmentValue } from '../finance.utils'

// Testes calculatePercentage
console.log('Testes calculatePercentage:')
console.log('calculatePercentage(25, 100)', calculatePercentage(25, 100)) // Esperado: 25.0
console.log('calculatePercentage(0, 0)', calculatePercentage(0, 0)) // Esperado: 0
console.log('calculatePercentage(33.333, 100, 2)', calculatePercentage(33.333, 100, 2)) // Esperado: ~33.33

// Testes calculateDifference
console.log('\nTestes calculateDifference:')
console.log('calculateDifference(100, 120)', calculateDifference(100, 120)) // Esperado: { absolute: 20, percentage: 20.0 }
console.log('calculateDifference(100, 80)', calculateDifference(100, 80)) // Esperado: { absolute: -20, percentage: -20.0 }

// Testes calculateInstallmentValue
console.log('\nTestes calculateInstallmentValue:')
console.log('calculateInstallmentValue(1000, 5)', calculateInstallmentValue(1000, 5)) // Esperado: 200.00
console.log('calculateInstallmentValue(1000, 3)', calculateInstallmentValue(1000, 3)) // Esperado: 333.33
