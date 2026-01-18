import { useState, useEffect } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { TransactionType } from '@/types'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/constants'

interface NewTransactionModalProps {
  isOpen: boolean
  onClose: () => void
}

const NewTransactionModal = ({ isOpen, onClose }: NewTransactionModalProps) => {
  const {
    addTransaction,
    bankAccounts,
    creditCards,
    familyMembers,
  } = useFinance()

  // Estados do formulário
  const [type, setType] = useState<TransactionType>('expense')
  const [value, setValue] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [memberId, setMemberId] = useState<string | null>(null)
  const [accountId, setAccountId] = useState<string>('')
  const [installments, setInstallments] = useState<number>(1)
  const [isRecurring, setIsRecurring] = useState<boolean>(false)

  // Estados para criação de categoria
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState<string>('')

  // Estados de validação
  const [errors, setErrors] = useState<{
    value?: string
    description?: string
    category?: string
    accountId?: string
  }>({})

  // Limpar formulário quando modal fecha
  useEffect(() => {
    if (!isOpen) {
      setType('expense')
      setValue('')
      setDescription('')
      setCategory('')
      setMemberId(null)
      setAccountId('')
      setInstallments(1)
      setIsRecurring(false)
      setShowNewCategoryInput(false)
      setNewCategoryName('')
      setErrors({})
    }
  }, [isOpen])

  // Verificar se conta selecionada é cartão
  const isCreditCard = creditCards.some(card => card.id === accountId)

  // Categorias filtradas por tipo
  const availableCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  // Reset parcelamento quando muda tipo ou conta
  useEffect(() => {
    if (type === 'income' || !isCreditCard) {
      setInstallments(1)
    }
  }, [type, isCreditCard])

  // Reset despesa recorrente quando parcelamento > 1
  useEffect(() => {
    if (installments > 1) {
      setIsRecurring(false)
    }
  }, [installments])

  // Reset parcelamento quando marca recorrente
  useEffect(() => {
    if (isRecurring) {
      setInstallments(1)
    }
  }, [isRecurring])

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

  // Criar nova categoria
  const handleCreateCategory = () => {
    if (newCategoryName.trim().length >= 3) {
      // Aqui você poderia adicionar a categoria ao estado global se necessário
      setCategory(newCategoryName.trim())
      setShowNewCategoryInput(false)
      setNewCategoryName('')
    }
  }

  // Validação
  const validate = (): boolean => {
    const newErrors: typeof errors = {}

    // Validar valor
    const numValue = parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'))
    if (!value || isNaN(numValue) || numValue <= 0) {
      newErrors.value = 'Valor deve ser maior que zero'
    }

    // Validar descrição
    if (!description || description.trim().length < 3) {
      newErrors.description = 'Descrição deve ter pelo menos 3 caracteres'
    }

    // Validar categoria
    if (!category) {
      newErrors.category = 'Selecione uma categoria'
    }

    // Validar conta
    if (!accountId) {
      newErrors.accountId = 'Selecione uma conta ou cartão'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submeter formulário
  const handleSubmit = () => {
    if (!validate()) {
      return
    }

    const numValue = parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'))
    const finalInstallments = isCreditCard && type === 'expense' ? installments : 1

    addTransaction({
      type,
      value: numValue,
      description: description.trim(),
      category: category.trim(),
      accountId,
      memberId,
      installments: finalInstallments,
      status: 'completed',
      isRecurring: type === 'expense' ? isRecurring : false,
      isPaid: type === 'expense' ? false : true,
    })

    // Notificação (você pode usar uma biblioteca de toast ou criar um componente simples)
    console.log('Transação registrada com sucesso!')

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
            Nova Transação
          </h2>

          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              width: '32px',
              height: '32px',
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
            <div>
              <div
                className="flex rounded-lg overflow-hidden"
                style={{
                  backgroundColor: 'var(--gray-100)',
                  padding: '4px',
                  gap: '4px',
                }}
              >
                <button
                  onClick={() => setType('income')}
                  className="flex-1"
                  style={{
                    padding: '12px 16px',
                    backgroundColor: type === 'income' ? '#FFFFFF' : 'transparent',
                    color: type === 'income' ? 'var(--gray-900)' : 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-body-md)',
                    fontWeight: 'var(--font-weight-bold)',
                    borderRadius: '100px',
                    cursor: 'pointer',
                    boxShadow: type === 'income' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transitionProperty: 'all',
                    transitionDuration: '200ms',
                  }}
                >
                  Receita
                </button>
                <button
                  onClick={() => setType('expense')}
                  className="flex-1"
                  style={{
                    padding: '12px 16px',
                    backgroundColor: type === 'expense' ? '#FFFFFF' : 'transparent',
                    color: type === 'expense' ? 'var(--gray-900)' : 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-body-md)',
                    fontWeight: 'var(--font-weight-bold)',
                    borderRadius: '100px',
                    cursor: 'pointer',
                    boxShadow: type === 'expense' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transitionProperty: 'all',
                    transitionDuration: '200ms',
                  }}
                >
                  Despesa
                </button>
              </div>
            </div>

            {/* Campo Valor */}
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
                Valor da Transação
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
                  value={value}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d,.-]/g, '')
                    setValue(val)
                    if (errors.value) {
                      setErrors((prev) => ({ ...prev, value: undefined }))
                    }
                  }}
                  placeholder="0,00"
                  className="w-full"
                  style={{
                    height: '56px',
                    paddingLeft: '56px',
                    paddingRight: '24px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    fontSize: 'var(--font-size-body-lg)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--gray-900)',
                    backgroundColor: '#FFFFFF',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: errors.value ? '#ef4444' : 'var(--color-border)',
                    borderRadius: 'var(--border-radius-input)',
                  }}
                />
              </div>
              {errors.value && (
                <p
                  style={{
                    fontSize: 'var(--font-size-body-sm)',
                    color: '#ef4444',
                    marginTop: '4px',
                  }}
                >
                  {errors.value}
                </p>
              )}
            </div>

            {/* Campo Descrição */}
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
                Descrição
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (errors.description) {
                    setErrors((prev) => ({ ...prev, description: undefined }))
                  }
                }}
                placeholder="Ex: Supermercado Semanal"
                className="w-full"
                style={{
                  height: '56px',
                  padding: '12px 24px',
                  fontSize: 'var(--font-size-body-md)',
                  color: 'var(--gray-900)',
                  backgroundColor: '#FFFFFF',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: errors.description ? '#ef4444' : 'var(--color-border)',
                  borderRadius: 'var(--border-radius-input)',
                }}
              />
              {errors.description && (
                <p
                  style={{
                    fontSize: 'var(--font-size-body-sm)',
                    color: '#ef4444',
                    marginTop: '4px',
                  }}
                >
                  {errors.description}
                </p>
              )}
            </div>

            {/* Campo Categoria */}
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
                Categoria
              </label>
              {!showNewCategoryInput ? (
                <div>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value)
                      if (errors.category) {
                        setErrors((prev) => ({ ...prev, category: undefined }))
                      }
                    }}
                    className="w-full"
                    style={{
                      height: '56px',
                      padding: '12px 24px',
                      fontSize: 'var(--font-size-body-md)',
                      color: 'var(--gray-900)',
                      backgroundColor: '#FFFFFF',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: errors.category ? '#ef4444' : 'var(--color-border)',
                      borderRadius: 'var(--border-radius-input)',
                      cursor: 'pointer',
                      marginBottom: '8px',
                    }}
                  >
                    <option value="">Selecione uma categoria</option>
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowNewCategoryInput(true)}
                    className="w-full"
                    style={{
                      padding: '12px 16px',
                      fontSize: 'var(--font-size-body-sm)',
                      color: 'var(--color-primary)',
                      backgroundColor: 'transparent',
                      borderWidth: '1px',
                      borderStyle: 'dashed',
                      borderColor: 'var(--color-primary)',
                      borderRadius: 'var(--border-radius-input)',
                      cursor: 'pointer',
                    }}
                  >
                    + Nova Categoria
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nome da categoria"
                    className="flex-1"
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
                  <button
                    onClick={handleCreateCategory}
                    style={{
                      padding: '12px 16px',
                      fontSize: 'var(--font-size-body-sm)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: '#FFFFFF',
                      backgroundColor: 'var(--color-primary)',
                      border: 'none',
                      borderRadius: '100px',
                      cursor: 'pointer',
                    }}
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => {
                      setShowNewCategoryInput(false)
                      setNewCategoryName('')
                    }}
                    style={{
                      padding: '12px 16px',
                      fontSize: 'var(--font-size-body-sm)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--gray-900)',
                      backgroundColor: 'var(--gray-100)',
                      border: 'none',
                      borderRadius: '100px',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
              {errors.category && (
                <p
                  style={{
                    fontSize: 'var(--font-size-body-sm)',
                    color: '#ef4444',
                    marginTop: '4px',
                  }}
                >
                  {errors.category}
                </p>
              )}
            </div>

            {/* Grid: Membro e Conta/Cartão */}
            <div
              className="grid grid-cols-1 md:grid-cols-2"
              style={{ gap: 'var(--spacing-md)' }}
            >
              {/* Select Membro */}
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
                  Membro (Opcional)
                </label>
                <select
                  value={memberId || ''}
                  onChange={(e) => setMemberId(e.target.value || null)}
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
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Família (Geral)</option>
                  {familyMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Conta/Cartão */}
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
                  Conta / Cartão
                </label>
                <select
                  value={accountId}
                  onChange={(e) => {
                    setAccountId(e.target.value)
                    if (errors.accountId) {
                      setErrors((prev) => ({ ...prev, accountId: undefined }))
                    }
                  }}
                  className="w-full"
                  style={{
                    height: '56px',
                    padding: '12px 24px',
                    fontSize: 'var(--font-size-body-md)',
                    color: 'var(--gray-900)',
                    backgroundColor: '#FFFFFF',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: errors.accountId ? '#ef4444' : 'var(--color-border)',
                    borderRadius: 'var(--border-radius-input)',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Selecione uma conta ou cartão</option>
                  <optgroup label="Contas Bancárias">
                    {bankAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Cartões de Crédito">
                    {creditCards.map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
                {errors.accountId && (
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-sm)',
                      color: '#ef4444',
                      marginTop: '4px',
                    }}
                  >
                    {errors.accountId}
                  </p>
                )}
              </div>
            </div>

            {/* Campo Parcelamento (condicional) */}
            {isCreditCard && type === 'expense' && (
              <div
                style={{
                  animation: 'fadeInDown 0.3s ease-out',
                }}
              >
                <label
                  style={{
                    fontSize: 'var(--font-size-body-sm)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--gray-900)',
                    marginBottom: 'var(--spacing-sm)',
                    display: 'block',
                  }}
                >
                  Parcelamento
                </label>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(Number(e.target.value))}
                  disabled={isRecurring}
                  className="w-full"
                  style={{
                    height: '56px',
                    padding: '12px 24px',
                    fontSize: 'var(--font-size-body-md)',
                    color: isRecurring ? 'var(--color-text-secondary)' : 'var(--gray-900)',
                    backgroundColor: isRecurring ? 'var(--gray-100)' : '#FFFFFF',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border)',
                    borderRadius: 'var(--border-radius-input)',
                    cursor: isRecurring ? 'not-allowed' : 'pointer',
                    opacity: isRecurring ? 0.6 : 1,
                  }}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num === 1 ? 'À vista (1x)' : `${num}x`}
                    </option>
                  ))}
                </select>
                {isRecurring && (
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-sm)',
                      fontStyle: 'italic',
                      color: 'var(--color-text-secondary)',
                      marginTop: '4px',
                    }}
                  >
                    Parcelamento desabilitado para despesas recorrentes
                  </p>
                )}
              </div>
            )}

            {/* Checkbox Despesa Recorrente (condicional) */}
            {type === 'expense' && (
              <div
                style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: '#F0F4FF',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#3247FF',
                  borderRadius: 'var(--border-radius-card)',
                  opacity: installments > 1 ? 0.6 : 1,
                }}
              >
                <label
                  className="flex items-start"
                  style={{
                    cursor: installments > 1 ? 'not-allowed' : 'pointer',
                    gap: 'var(--spacing-sm)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => {
                      if (installments === 1) {
                        setIsRecurring(e.target.checked)
                      }
                    }}
                    disabled={installments > 1}
                    style={{
                      width: '20px',
                      height: '20px',
                      marginTop: '2px',
                      cursor: installments > 1 ? 'not-allowed' : 'pointer',
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <span
                        style={{
                          fontSize: 'var(--font-size-body-md)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--gray-900)',
                        }}
                      >
                        Despesa Recorrente
                      </span>
                      <svg
                        className="w-5 h-5"
                        style={{ color: '#3247FF' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </div>
                    <p
                      style={{
                        fontSize: 'var(--font-size-body-sm)',
                        color: 'var(--color-text-secondary)',
                        marginTop: '4px',
                      }}
                    >
                      {installments > 1
                        ? 'Não disponível para compras parceladas'
                        : 'Esta despesa será criada automaticamente todos os meses'}
                    </p>
                  </div>
                </label>
              </div>
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
            Salvar Transação
          </button>
        </footer>
      </div>
    </div>
  )
}

export default NewTransactionModal
