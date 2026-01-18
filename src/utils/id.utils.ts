/**
 * Utilitários para geração de IDs únicos
 */

/**
 * Gera ID único usando crypto.randomUUID se disponível, senão usa timestamp + random
 * @param prefix - Prefixo opcional para o ID
 * @returns String com ID único
 * @example
 * generateUniqueId() // "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 * generateUniqueId("txn") // "txn_a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 */
export const generateUniqueId = (prefix?: string): string => {
  let id: string

  // Tenta usar crypto.randomUUID se disponível (ambientes modernos)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    id = crypto.randomUUID()
  } else {
    // Fallback: timestamp + random
    const timestamp = Date.now().toString(36)
    const randomPart = Math.random().toString(36).substring(2, 15)
    id = `${timestamp}_${randomPart}`
  }

  return prefix ? `${prefix}_${id}` : id
}
