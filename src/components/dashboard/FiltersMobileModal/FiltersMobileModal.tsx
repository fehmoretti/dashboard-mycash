import { useState, useEffect } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { DateRange } from '@/types'
import SimpleDateRangePicker from './SimpleDateRangePicker'

interface FiltersMobileModalProps {
  isOpen: boolean
  onClose: () => void
}

const FiltersMobileModal = ({ isOpen, onClose }: FiltersMobileModalProps) => {
  const {
    transactionType: globalTransactionType,
    selectedMember: globalSelectedMember,
    dateRange: globalDateRange,
    setTransactionType,
    setSelectedMember,
    setDateRange,
    familyMembers,
  } = useFinance()

  // Estados temporários (não aplicados até clicar em "Aplicar")
  const [tempTransactionType, setTempTransactionType] = useState<'all' | 'income' | 'expense'>(
    globalTransactionType
  )
  const [tempSelectedMember, setTempSelectedMember] = useState<string | null>(globalSelectedMember)
  const [tempDateRange, setTempDateRange] = useState<DateRange | null>(globalDateRange)

  // Sincronizar estados temporários quando modal abre ou filtros globais mudam
  useEffect(() => {
    if (isOpen) {
      setTempTransactionType(globalTransactionType)
      setTempSelectedMember(globalSelectedMember)
      setTempDateRange(globalDateRange)
    }
  }, [isOpen, globalTransactionType, globalSelectedMember, globalDateRange])

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

  // Aplicar filtros ao contexto global
  const handleApplyFilters = () => {
    setTransactionType(tempTransactionType)
    setSelectedMember(tempSelectedMember)
    setDateRange(tempDateRange)
    onClose()
  }

  // Não renderizar se modal estiver fechado
  if (!isOpen) return null

  return (
      <div
        className="fixed inset-0 z-50 flex flex-col"
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
          className="flex flex-col bg-white mt-auto"
          style={{
            backgroundColor: '#FFFFFF',
            width: '100%',
            maxHeight: '85vh',
            height: 'auto',
            borderTopLeftRadius: 'var(--border-radius-card)',
            borderTopRightRadius: 'var(--border-radius-card)',
            animation: 'slideUp 0.3s ease-out',
          }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header fixo */}
        <header
          className="flex items-center justify-between flex-shrink-0"
          style={{
            padding: 'var(--spacing-lg)',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: '#FFFFFF',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--font-size-heading-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
            }}
          >
            Filtros
          </h2>

          {/* Botão fechar (mínimo 44x44px para touch) */}
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              minWidth: '44px',
              minHeight: '44px',
              width: '44px',
              height: '44px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transitionProperty: 'background-color',
              transitionDuration: '200ms',
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--gray-100)'
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--gray-100)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <svg
              className="w-6 h-6"
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
            paddingBottom: 'var(--spacing-md)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-xl)',
            }}
          >
            {/* Seção Tipo de Transação */}
            <div>
              <label
                style={{
                  fontSize: 'var(--font-size-body-md)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                  marginBottom: 'var(--spacing-md)',
                  display: 'block',
                }}
              >
                Tipo de Transação
              </label>
              <div className="grid grid-cols-3" style={{ gap: '8px' }}>
                {(['all', 'income', 'expense'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTempTransactionType(type)}
                    style={{
                      height: '48px',
                      padding: 'var(--spacing-sm)',
                      fontSize: 'var(--font-size-body-sm)',
                      fontWeight: 'var(--font-weight-bold)',
                      backgroundColor:
                        tempTransactionType === type ? 'var(--gray-900)' : '#FFFFFF',
                      color: tempTransactionType === type ? '#FFFFFF' : 'var(--color-text-secondary)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: 'var(--color-border)',
                      borderRadius: 'var(--border-radius-button)',
                      cursor: 'pointer',
                      transitionProperty: 'all',
                      transitionDuration: '200ms',
                    }}
                  >
                    {type === 'all' ? 'Todos' : type === 'income' ? 'Receitas' : 'Despesas'}
                  </button>
                ))}
              </div>
            </div>

            {/* Seção Membro da Família */}
            <div>
              <label
                style={{
                  fontSize: 'var(--font-size-body-md)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                  marginBottom: 'var(--spacing-md)',
                  display: 'block',
                }}
              >
                Membro da Família
              </label>
              <div className="flex flex-wrap" style={{ gap: '8px' }}>
                {/* Botão "Todos" */}
                <button
                  onClick={() => setTempSelectedMember(null)}
                  style={{
                    height: '48px',
                    paddingLeft: 'var(--spacing-md)',
                    paddingRight: 'var(--spacing-md)',
                    paddingTop: 'var(--spacing-sm)',
                    paddingBottom: 'var(--spacing-sm)',
                    fontSize: 'var(--font-size-body-sm)',
                    fontWeight: 'var(--font-weight-bold)',
                    backgroundColor: tempSelectedMember === null ? 'var(--gray-900)' : '#FFFFFF',
                    color: tempSelectedMember === null ? '#FFFFFF' : 'var(--color-text-secondary)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border)',
                    borderRadius: '100px',
                    cursor: 'pointer',
                    transitionProperty: 'all',
                    transitionDuration: '200ms',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Todos
                </button>

                {/* Botões dos membros */}
                {familyMembers.map((member) => {
                  const isSelected = tempSelectedMember === member.id

                  return (
                    <button
                      key={member.id}
                      onClick={() => setTempSelectedMember(member.id)}
                      className="flex items-center"
                      style={{
                        height: '48px',
                        paddingLeft: 'var(--spacing-md)',
                        paddingRight: 'var(--spacing-md)',
                        paddingTop: 'var(--spacing-sm)',
                        paddingBottom: 'var(--spacing-sm)',
                        gap: '8px',
                        fontSize: 'var(--font-size-body-sm)',
                        fontWeight: 'var(--font-weight-bold)',
                        backgroundColor: isSelected ? 'var(--gray-900)' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: isSelected ? 'var(--gray-900)' : 'var(--color-border)',
                        borderRadius: '100px',
                        cursor: 'pointer',
                        transitionProperty: 'all',
                        transitionDuration: '200ms',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {/* Avatar */}
                      <div
                        className="flex items-center justify-center rounded-full flex-shrink-0"
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: 'var(--color-primary)',
                          borderWidth: '2px',
                          borderStyle: 'solid',
                          borderColor: isSelected ? '#FFFFFF' : 'transparent',
                          borderRadius: 'var(--border-radius-avatar)',
                        }}
                      >
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: 'var(--border-radius-avatar)',
                            }}
                          />
                        ) : (
                          <svg
                            className="w-5 h-5"
                            style={{ color: isSelected ? '#FFFFFF' : 'var(--gray-900)' }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        )}
                      </div>
                      <span>{member.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Seção Período */}
            <SimpleDateRangePicker
              dateRange={tempDateRange}
              onDateRangeChange={setTempDateRange}
            />
          </div>
        </div>

        {/* Footer fixo */}
        <footer
          className="flex-shrink-0"
          style={{
            padding: 'var(--spacing-lg)',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: '#FFFFFF',
          }}
        >
          <button
            onClick={handleApplyFilters}
            className="w-full"
            style={{
              height: '56px',
              padding: '12px 24px',
              fontSize: 'var(--font-size-body-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: '#FFFFFF',
              backgroundColor: 'var(--gray-900)',
              border: 'none',
              borderRadius: '100px',
              cursor: 'pointer',
            }}
          >
            Aplicar Filtros
          </button>
        </footer>
      </div>

      {/* Animação slideUp */}
      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  )
}

export default FiltersMobileModal
