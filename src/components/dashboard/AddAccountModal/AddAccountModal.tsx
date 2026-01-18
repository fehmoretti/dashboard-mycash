import { useState, useEffect } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { CreditCardTheme } from '@/types'

interface AddAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddAccountModal = ({ isOpen, onClose }: AddAccountModalProps) => {
  const { addBankAccount, addCreditCard, familyMembers } = useFinance()

  // Estados do formulário
  const [accountType, setAccountType] = useState<'account' | 'creditCard'>('account')
  const [name, setName] = useState<string>('')
  const [holderId, setHolderId] = useState<string>('')

  // Campos para conta bancária
  const [balance, setBalance] = useState<string>('')

  // Campos para cartão de crédito
  const [closingDay, setClosingDay] = useState<string>('')
  const [dueDay, setDueDay] = useState<string>('')
  const [limit, setLimit] = useState<string>('')
  const [lastDigits, setLastDigits] = useState<string>('')
  const [theme, setTheme] = useState<CreditCardTheme | ''>('')

  // Estados de validação
  const [errors, setErrors] = useState<{
    name?: string
    holderId?: string
    balance?: string
    closingDay?: string
    dueDay?: string
    limit?: string
    theme?: string
  }>({})

  // Limpar formulário quando modal fecha
  useEffect(() => {
    if (!isOpen) {
      setAccountType('account')
      setName('')
      setHolderId('')
      setBalance('')
      setClosingDay('')
      setDueDay('')
      setLimit('')
      setLastDigits('')
      setTheme('')
      setErrors({})
    }
  }, [isOpen])

  // Fechar modal ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Validar número entre 1-31
  const validateDay = (value: string): boolean => {
    const num = parseInt(value, 10)
    return !isNaN(num) && num >= 1 && num <= 31
  }

  // Validação
  const validate = (): boolean => {
    const newErrors: typeof errors = {}

    // Validar nome
    if (!name || name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres'
    }

    // Validar titular
    if (!holderId) {
      newErrors.holderId = 'Selecione um titular'
    }

    if (accountType === 'account') {
      // Validar saldo inicial
      const balanceValue = parseFloat(balance.replace(/[^\d,.-]/g, '').replace(',', '.'))
      if (!balance || isNaN(balanceValue)) {
        newErrors.balance = 'Saldo inicial é obrigatório'
      }
    } else {
      // Validar fechamento
      if (!closingDay || !validateDay(closingDay)) {
        newErrors.closingDay = 'Dia de fechamento deve ser entre 1 e 31'
      }

      // Validar vencimento
      if (!dueDay || !validateDay(dueDay)) {
        newErrors.dueDay = 'Dia de vencimento deve ser entre 1 e 31'
      }

      // Validar limite
      const limitValue = parseFloat(limit.replace(/[^\d,.-]/g, '').replace(',', '.'))
      if (!limit || isNaN(limitValue) || limitValue <= 0) {
        newErrors.limit = 'Limite deve ser maior que zero'
      }

      // Validar tema
      if (!theme) {
        newErrors.theme = 'Selecione um tema visual'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submeter formulário
  const handleSubmit = () => {
    if (!validate()) {
      return
    }

    if (accountType === 'account') {
      // Criar conta bancária
      const balanceValue = parseFloat(balance.replace(/[^\d,.-]/g, '').replace(',', '.'))
      addBankAccount({
        name: name.trim(),
        type: 'account',
        holderId,
        balance: balanceValue,
      })
      console.log('Conta adicionada com sucesso!')
    } else {
      // Criar cartão de crédito
      const limitValue = parseFloat(limit.replace(/[^\d,.-]/g, '').replace(',', '.'))
      addCreditCard({
        name: name.trim(),
        type: 'creditCard',
        holderId,
        closingDay: parseInt(closingDay, 10),
        dueDay: parseInt(dueDay, 10),
        limit: limitValue,
        currentBill: 0,
        theme: theme as CreditCardTheme,
        lastDigits: lastDigits.trim() || undefined,
      })
      console.log('Cartão adicionado com sucesso!')
    }

    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="flex flex-col"
        style={{
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          borderRadius: 'var(--border-radius-card)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          margin: 'var(--spacing-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header
          className="flex items-center justify-between flex-shrink-0"
          style={{
            padding: 'var(--spacing-lg)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--font-size-heading-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
            }}
          >
            Adicionar Conta/Cartão
          </h2>

          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transitionProperty: 'background-color',
              transitionDuration: '200ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--gray-100)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <svg
              className="w-5 h-5"
              style={{ color: 'var(--gray-900)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        {/* Conteúdo scrollável */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            padding: 'var(--spacing-lg)',
            maxHeight: 'calc(90vh - 180px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-lg)',
            }}
          >
            {/* Toggle de tipo */}
            <div className="flex" style={{ gap: '8px' }}>
              <button
                onClick={() => {
                  setAccountType('account')
                  setErrors({})
                }}
                className="flex-1"
                style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: accountType === 'account' ? 'var(--gray-900)' : '#FFFFFF',
                  color: accountType === 'account' ? '#FFFFFF' : 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-body-md)',
                  fontWeight: 'var(--font-weight-bold)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--color-border)',
                  borderRadius: 'var(--border-radius-button)',
                  cursor: 'pointer',
                  transitionProperty: 'all',
                  transitionDuration: '200ms',
                }}
              >
                Conta Bancária
              </button>
              <button
                onClick={() => {
                  setAccountType('creditCard')
                  setErrors({})
                }}
                className="flex-1"
                style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: accountType === 'creditCard' ? 'var(--gray-900)' : '#FFFFFF',
                  color: accountType === 'creditCard' ? '#FFFFFF' : 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-body-md)',
                  fontWeight: 'var(--font-weight-bold)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--color-border)',
                  borderRadius: 'var(--border-radius-button)',
                  cursor: 'pointer',
                  transitionProperty: 'all',
                  transitionDuration: '200ms',
                }}
              >
                Cartão de Crédito
              </button>
            </div>

            {/* Campo Nome */}
            <div>
              <label
                style={{
                  fontSize: 'var(--font-size-body-sm)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                  marginBottom: 'var(--spacing-sm)',
                  display: 'block',
                }}
              >
                {accountType === 'account' ? 'Nome da Conta' : 'Nome do Cartão'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }))
                  }
                }}
                placeholder={accountType === 'account' ? 'Ex: Nubank Conta' : 'Ex: Nubank Mastercard'}
                className="w-full"
                style={{
                  height: '56px',
                  padding: '12px 24px',
                  fontSize: 'var(--font-size-body-md)',
                  color: 'var(--gray-900)',
                  backgroundColor: '#FFFFFF',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: errors.name ? '#ef4444' : 'var(--color-border)',
                  borderRadius: 'var(--border-radius-input)',
                }}
              />
              {errors.name && (
                <p
                  style={{
                    fontSize: 'var(--font-size-body-sm)',
                    color: '#ef4444',
                    marginTop: '4px',
                  }}
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* Campo Titular */}
            <div>
              <label
                style={{
                  fontSize: 'var(--font-size-body-sm)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                  marginBottom: 'var(--spacing-sm)',
                  display: 'block',
                }}
              >
                Titular
              </label>
              <select
                value={holderId}
                onChange={(e) => {
                  setHolderId(e.target.value)
                  if (errors.holderId) {
                    setErrors((prev) => ({ ...prev, holderId: undefined }))
                  }
                }}
                className="w-full"
                style={{
                  height: '56px',
                  padding: 'var(--spacing-input-padding)',
                  fontSize: 'var(--font-size-body-md)',
                  color: 'var(--gray-900)',
                  backgroundColor: 'var(--color-background-primary)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: errors.holderId ? '#ef4444' : 'var(--color-border)',
                  borderRadius: 'var(--border-radius-input)',
                  cursor: 'pointer',
                }}
              >
                <option value="">Selecione o titular</option>
                {familyMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              {errors.holderId && (
                <p
                  style={{
                    fontSize: 'var(--font-size-body-sm)',
                    color: '#ef4444',
                    marginTop: '4px',
                  }}
                >
                  {errors.holderId}
                </p>
              )}
            </div>

            {/* Campos condicionais para Conta Bancária */}
            {accountType === 'account' && (
              <div>
                <label
                  style={{
                    fontSize: 'var(--font-size-body-sm)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--gray-900)',
                    marginBottom: 'var(--spacing-sm)',
                    display: 'block',
                  }}
                >
                  Saldo Inicial
                </label>
                <div className="relative">
                  <span
                    style={{
                      position: 'absolute',
                      left: '24px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: 'var(--font-size-body-md)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--gray-900)',
                      pointerEvents: 'none',
                    }}
                  >
                    R$
                  </span>
                  <input
                    type="text"
                    value={balance}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d,.-]/g, '')
                      setBalance(val)
                      if (errors.balance) {
                        setErrors((prev) => ({ ...prev, balance: undefined }))
                      }
                    }}
                    placeholder="0,00"
                    className="w-full"
                    style={{
                      height: '56px',
                      paddingLeft: '48px',
                      paddingRight: '24px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      fontSize: 'var(--font-size-body-md)',
                      color: 'var(--gray-900)',
                      backgroundColor: '#FFFFFF',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: errors.balance ? '#ef4444' : 'var(--color-border)',
                      borderRadius: 'var(--border-radius-input)',
                    }}
                  />
                </div>
                {errors.balance && (
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-sm)',
                      color: '#ef4444',
                      marginTop: '4px',
                    }}
                  >
                    {errors.balance}
                  </p>
                )}
              </div>
            )}

            {/* Campos condicionais para Cartão de Crédito */}
            {accountType === 'creditCard' && (
              <>
                {/* Grid: Fechamento e Vencimento */}
                <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-md)' }}>
                  <div>
                    <label
                      style={{
                        fontSize: 'var(--font-size-body-sm)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--gray-900)',
                        marginBottom: 'var(--spacing-sm)',
                        display: 'block',
                      }}
                    >
                      Dia de Fechamento
                    </label>
                    <input
                      type="number"
                      value={closingDay}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^\d]/g, '')
                        if (val === '' || (parseInt(val, 10) >= 1 && parseInt(val, 10) <= 31)) {
                          setClosingDay(val)
                          if (errors.closingDay) {
                            setErrors((prev) => ({ ...prev, closingDay: undefined }))
                          }
                        }
                      }}
                      placeholder="1 a 31"
                      className="w-full"
                      style={{
                        height: '56px',
                        padding: '12px 24px',
                        fontSize: 'var(--font-size-body-md)',
                        color: 'var(--gray-900)',
                        backgroundColor: '#FFFFFF',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: errors.closingDay ? '#ef4444' : 'var(--color-border)',
                        borderRadius: 'var(--border-radius-input)',
                      }}
                    />
                    {errors.closingDay && (
                      <p
                        style={{
                          fontSize: 'var(--font-size-body-sm)',
                          color: '#ef4444',
                          marginTop: '4px',
                        }}
                      >
                        {errors.closingDay}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: 'var(--font-size-body-sm)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--gray-900)',
                        marginBottom: 'var(--spacing-sm)',
                        display: 'block',
                      }}
                    >
                      Dia de Vencimento
                    </label>
                    <input
                      type="number"
                      value={dueDay}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^\d]/g, '')
                        if (val === '' || (parseInt(val, 10) >= 1 && parseInt(val, 10) <= 31)) {
                          setDueDay(val)
                          if (errors.dueDay) {
                            setErrors((prev) => ({ ...prev, dueDay: undefined }))
                          }
                        }
                      }}
                      placeholder="1 a 31"
                      className="w-full"
                      style={{
                        height: '56px',
                        padding: '12px 24px',
                        fontSize: 'var(--font-size-body-md)',
                        color: 'var(--gray-900)',
                        backgroundColor: '#FFFFFF',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: errors.dueDay ? '#ef4444' : 'var(--color-border)',
                        borderRadius: 'var(--border-radius-input)',
                      }}
                    />
                    {errors.dueDay && (
                      <p
                        style={{
                          fontSize: 'var(--font-size-body-sm)',
                          color: '#ef4444',
                          marginTop: '4px',
                        }}
                      >
                        {errors.dueDay}
                      </p>
                    )}
                  </div>
                </div>

                {/* Limite Total */}
                <div>
                  <label
                    style={{
                      fontSize: 'var(--font-size-body-sm)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--gray-900)',
                      marginBottom: 'var(--spacing-sm)',
                      display: 'block',
                    }}
                  >
                    Limite Total
                  </label>
                  <div className="relative">
                    <span
                      style={{
                        position: 'absolute',
                        left: '24px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: 'var(--font-size-body-md)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--gray-900)',
                        pointerEvents: 'none',
                      }}
                    >
                      R$
                    </span>
                    <input
                      type="text"
                      value={limit}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^\d,.-]/g, '')
                        setLimit(val)
                        if (errors.limit) {
                          setErrors((prev) => ({ ...prev, limit: undefined }))
                        }
                      }}
                      placeholder="0,00"
                      className="w-full"
                      style={{
                        height: '56px',
                        paddingLeft: '48px',
                        paddingRight: '24px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        fontSize: 'var(--font-size-body-md)',
                        color: 'var(--gray-900)',
                        backgroundColor: '#FFFFFF',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: errors.limit ? '#ef4444' : 'var(--color-border)',
                        borderRadius: 'var(--border-radius-input)',
                      }}
                    />
                  </div>
                  {errors.limit && (
                    <p
                      style={{
                        fontSize: 'var(--font-size-body-sm)',
                        color: '#ef4444',
                        marginTop: '4px',
                      }}
                    >
                      {errors.limit}
                    </p>
                  )}
                </div>

                {/* Últimos 4 dígitos */}
                <div>
                  <label
                    style={{
                      fontSize: 'var(--font-size-body-sm)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--gray-900)',
                      marginBottom: 'var(--spacing-sm)',
                      display: 'block',
                    }}
                  >
                    Últimos 4 Dígitos (Opcional)
                  </label>
                  <input
                    type="text"
                    value={lastDigits}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d]/g, '').slice(0, 4)
                      setLastDigits(val)
                    }}
                    placeholder="1234"
                    className="w-full"
                    style={{
                      height: '56px',
                      padding: '12px 24px',
                      fontSize: 'var(--font-size-body-md)',
                      color: 'var(--gray-900)',
                      backgroundColor: '#FFFFFF',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: 'var(--color-border)',
                      borderRadius: 'var(--border-radius-input)',
                    }}
                  />
                </div>

                {/* Tema Visual */}
                <div>
                  <label
                    style={{
                      fontSize: 'var(--font-size-body-sm)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--gray-900)',
                      marginBottom: 'var(--spacing-sm)',
                      display: 'block',
                    }}
                  >
                    Tema Visual
                  </label>
                  <div className="grid grid-cols-3" style={{ gap: 'var(--spacing-sm)' }}>
                    {(['black', 'lime', 'white'] as CreditCardTheme[]).map((themeOption) => (
                      <button
                        key={themeOption}
                        type="button"
                        onClick={() => {
                          setTheme(themeOption)
                          if (errors.theme) {
                            setErrors((prev) => ({ ...prev, theme: undefined }))
                          }
                        }}
                        className="flex flex-col items-center justify-center"
                        style={{
                          height: '80px',
                          padding: 'var(--spacing-md)',
                          backgroundColor:
                            themeOption === 'black'
                              ? 'var(--gray-900)'
                              : themeOption === 'lime'
                                ? 'var(--color-primary)'
                                : '#FFFFFF',
                          color:
                            themeOption === 'black' || themeOption === 'lime'
                              ? 'var(--gray-900)'
                              : 'var(--gray-900)',
                          borderWidth: '2px',
                          borderStyle: 'solid',
                          borderColor:
                            theme === themeOption ? '#3247FF' : 'var(--color-border)',
                          borderRadius: 'var(--border-radius-card)',
                          cursor: 'pointer',
                          transitionProperty: 'border-color',
                          transitionDuration: '200ms',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 'var(--font-size-body-sm)',
                            fontWeight: 'var(--font-weight-bold)',
                          }}
                        >
                          {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.theme && (
                    <p
                      style={{
                        fontSize: 'var(--font-size-body-sm)',
                        color: '#ef4444',
                        marginTop: '4px',
                      }}
                    >
                      {errors.theme}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer
          className="flex items-center justify-between flex-shrink-0"
          style={{
            padding: 'var(--spacing-lg)',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: '#FFFFFF',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '12px 16px',
              fontSize: 'var(--font-size-body-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
              backgroundColor: 'transparent',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border)',
              borderRadius: '100px',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '12px 16px',
              fontSize: 'var(--font-size-body-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: '#FFFFFF',
              backgroundColor: 'var(--gray-900)',
              border: 'none',
              borderRadius: '100px',
              cursor: 'pointer',
            }}
          >
            Adicionar
          </button>
        </footer>
      </div>
    </div>
  )
}

export default AddAccountModal
