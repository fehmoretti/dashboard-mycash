/**
 * Testes básicos para funções de validação
 * Nota: Estes são testes simples sem framework de teste
 * Em produção, usar Jest, Vitest ou similar
 */

import { isValidEmail, isValidCPF, isValidDate, isPositiveNumber } from '../validation.utils'

// Testes isValidEmail
console.log('Testes isValidEmail:')
console.log('isValidEmail("usuario@exemplo.com")', isValidEmail('usuario@exemplo.com')) // Esperado: true
console.log('isValidEmail("email.invalido")', isValidEmail('email.invalido')) // Esperado: false

// Testes isValidCPF
console.log('\nTestes isValidCPF:')
// CPF válido: 111.444.777-35 (exemplo)
console.log('isValidCPF("111.444.777-35")', isValidCPF('111.444.777-35')) // Esperado: true (se dígitos corretos)
console.log('isValidCPF("000.000.000-00")', isValidCPF('000.000.000-00')) // Esperado: false

// Testes isValidDate
console.log('\nTestes isValidDate:')
console.log('isValidDate(new Date())', isValidDate(new Date())) // Esperado: true
console.log('isValidDate(new Date(2025, 11, 31))', isValidDate(new Date(2025, 11, 31))) // Esperado: false
console.log('isValidDate(new Date(2025, 11, 31), true)', isValidDate(new Date(2025, 11, 31), true)) // Esperado: true

// Testes isPositiveNumber
console.log('\nTestes isPositiveNumber:')
console.log('isPositiveNumber(100)', isPositiveNumber(100)) // Esperado: true
console.log('isPositiveNumber(0)', isPositiveNumber(0)) // Esperado: false
console.log('isPositiveNumber(-10)', isPositiveNumber(-10)) // Esperado: false
