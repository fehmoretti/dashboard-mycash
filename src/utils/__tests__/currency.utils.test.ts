/**
 * Testes básicos para funções de formatação de moeda
 * Nota: Estes são testes simples sem framework de teste
 * Em produção, usar Jest, Vitest ou similar
 */

import { formatCurrency, formatCompactCurrency, parseCurrencyInput } from '../currency.utils'

// Testes formatCurrency
console.log('Testes formatCurrency:')
console.log('formatCurrency(1234.56)', formatCurrency(1234.56)) // Esperado: "R$ 1.234,56"
console.log('formatCurrency(0)', formatCurrency(0)) // Esperado: "R$ 0,00"
console.log('formatCurrency(999999.99)', formatCurrency(999999.99)) // Esperado: "R$ 999.999,99"

// Testes formatCompactCurrency
console.log('\nTestes formatCompactCurrency:')
console.log('formatCompactCurrency(2500)', formatCompactCurrency(2500)) // Esperado: "R$ 2,5k"
console.log('formatCompactCurrency(1200000)', formatCompactCurrency(1200000)) // Esperado: "R$ 1,2M"
console.log('formatCompactCurrency(999)', formatCompactCurrency(999)) // Esperado: "R$ 999,00"

// Testes parseCurrencyInput
console.log('\nTestes parseCurrencyInput:')
console.log('parseCurrencyInput("R$ 1.234,56")', parseCurrencyInput('R$ 1.234,56')) // Esperado: 1234.56
console.log('parseCurrencyInput("1.234,56")', parseCurrencyInput('1.234,56')) // Esperado: 1234.56
console.log('parseCurrencyInput("1234,56")', parseCurrencyInput('1234,56')) // Esperado: 1234.56
