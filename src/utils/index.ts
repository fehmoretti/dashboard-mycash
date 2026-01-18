/**
 * Barrel export para todos os utilitários
 */

// Currency utilities
export {
  formatCurrency,
  formatCompactCurrency,
  parseCurrencyInput,
} from './currency.utils'

// Date utilities
export {
  formatDate,
  formatDateLong,
  formatDateRange,
  formatRelativeDate,
} from './date.utils'

// Array utilities
export {
  groupByCategory,
  filterByDateRange,
  sortByDate,
} from './array.utils'

// Finance utilities
export {
  calculatePercentage,
  calculateDifference,
  calculateInstallmentValue,
} from './finance.utils'

// Validation utilities
export {
  isValidEmail,
  isValidCPF,
  isValidDate,
  isPositiveNumber,
} from './validation.utils'

// ID utilities
export { generateUniqueId } from './id.utils'
