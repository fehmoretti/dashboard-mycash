import { useState } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { CreditCard } from '@/types'
import { formatCurrency } from '@/utils/format'
import AddAccountModal from '@/components/dashboard/AddAccountModal'
import CardDetailsModal from '@/components/dashboard/CardDetailsModal'
import NewTransactionModal from '@/components/dashboard/NewTransactionModal'

const CardsView = () => {
  const { creditCards } = useFinance()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false)

  // Ordenar cartões por fatura decrescente (mais gasto primeiro)
  const sortedCards = [...creditCards].sort((a, b) => b.currentBill - a.currentBill)

  const handleCardClick = (card: CreditCard) => {
    setSelectedCard(card)
    setIsDetailsModalOpen(true)
  }

  const handleViewDetails = (card: CreditCard, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedCard(card)
    setIsDetailsModalOpen(true)
  }

  const handleAddExpense = (_card: CreditCard, e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Passar _card.id para NewTransactionModal quando implementado
    setIsNewTransactionModalOpen(true)
  }

  const formatDay = (day: number): string => {
    return `Dia ${day.toString().padStart(2, '0')}`
  }

  return (
    <div
      className="px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8 w-full"
      style={{
        backgroundColor: '#F5F6F8',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between mb-6"
        style={{
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        <h1
          style={{
            fontSize: 'var(--font-size-heading-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--gray-900)',
          }}
        >
          Cartões de Crédito
        </h1>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
          style={{
            padding: '12px 16px',
            fontSize: 'var(--font-size-body-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: '#FFFFFF',
            backgroundColor: 'var(--gray-900)',
            border: 'none',
            borderRadius: '100px',
            cursor: 'pointer',
            gap: '8px',
            transitionProperty: 'background-color',
            transitionDuration: '200ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1a1a1a'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--gray-900)'
          }}
        >
          <svg
            className="w-5 h-5"
            style={{ color: '#FFFFFF' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Novo Cartão
        </button>
      </div>

      {/* Grid de Cartões */}
      {sortedCards.length === 0 ? (
        /* Estado Vazio */
        <div
          className="flex flex-col items-center justify-center"
          style={{
            padding: 'var(--spacing-xxl)',
            minHeight: '400px',
            textAlign: 'center',
          }}
        >
          <div
            className="flex items-center justify-center rounded-full mb-4"
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'var(--gray-200)',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            <svg
              className="w-10 h-10"
              style={{ color: 'var(--color-text-secondary)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h2
            style={{
              fontSize: 'var(--font-size-heading-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
              marginBottom: 'var(--spacing-sm)',
            }}
          >
            Nenhum cartão cadastrado
          </h2>
          <p
            style={{
              fontSize: 'var(--font-size-body-md)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-lg)',
            }}
          >
            Comece adicionando seu primeiro cartão de crédito
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
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
            Cadastrar Primeiro Cartão
          </button>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          style={{
            gap: '16px',
          }}
        >
          {sortedCards.map((card) => {
            const availableLimit = card.limit - card.currentBill
            const usagePercentage = card.limit > 0 ? (card.currentBill / card.limit) * 100 : 0
            const isNearLimit = usagePercentage >= 80

            // Cores do tema
            const getThemeBorderColor = () => {
              switch (card.theme) {
                case 'black':
                  return 'var(--gray-900)'
                case 'lime':
                  return 'var(--color-primary)'
                case 'white':
                default:
                  return 'var(--color-border)'
              }
            }

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className="rounded-card cursor-pointer"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: 'var(--spacing-lg)',
                  borderWidth: '3px',
                  borderStyle: 'solid',
                  borderColor: getThemeBorderColor(),
                  borderRadius: 'var(--border-radius-card)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  transitionProperty: 'transform, box-shadow',
                  transitionDuration: '250ms',
                  transitionTimingFunction: 'ease-in-out',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-md)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
              >
                {/* Topo: Nome do Cartão */}
                <div className="flex items-center justify-between">
                  <h3
                    style={{
                      fontSize: 'var(--font-size-heading-md)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--gray-900)',
                    }}
                  >
                    {card.name}
                  </h3>
                  {/* TODO: Adicionar logo do banco se disponível */}
                </div>

                {/* Seção de Valores */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-sm)',
                  }}
                >
                  {/* Limite Total */}
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontSize: 'var(--font-size-body-sm)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      Limite Total
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-size-body-md)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--gray-900)',
                      }}
                    >
                      {formatCurrency(card.limit)}
                    </span>
                  </div>

                  {/* Fatura Atual */}
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontSize: 'var(--font-size-body-sm)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      Fatura Atual
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-size-body-lg)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: isNearLimit ? '#DC2626' : 'var(--gray-900)',
                      }}
                    >
                      {formatCurrency(card.currentBill)}
                    </span>
                  </div>

                  {/* Limite Disponível */}
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontSize: 'var(--font-size-body-sm)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      Limite Disponível
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-size-body-md)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--gray-900)',
                      }}
                    >
                      {formatCurrency(availableLimit)}
                    </span>
                  </div>

                  {/* Percentual de Uso */}
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontSize: 'var(--font-size-body-sm)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      Percentual de Uso
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-size-body-md)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--gray-900)',
                      }}
                    >
                      {usagePercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div>
                  <div
                    style={{
                      width: '100%',
                      height: '12px',
                      backgroundColor: 'var(--gray-200)',
                      borderRadius: '100px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(usagePercentage, 100)}%`,
                        height: '100%',
                        backgroundColor: isNearLimit ? '#DC2626' : 'var(--color-primary)',
                        borderRadius: '100px',
                        transition: 'width 0.3s ease-out',
                      }}
                    />
                  </div>
                </div>

                {/* Datas */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-xs)',
                    paddingTop: 'var(--spacing-sm)',
                    borderTop: '1px solid var(--color-border)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: 'var(--color-text-secondary)' }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span
                      style={{
                        fontSize: 'var(--font-size-body-sm)',
                        color: 'var(--gray-900)',
                      }}
                    >
                      Fechamento: {formatDay(card.closingDay)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: 'var(--color-text-secondary)' }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span
                      style={{
                        fontSize: 'var(--font-size-body-sm)',
                        color: 'var(--gray-900)',
                      }}
                    >
                      Vencimento: {formatDay(card.dueDay)}
                    </span>
                  </div>
                </div>

                {/* Últimos Dígitos */}
                {card.lastDigits && (
                  <div>
                    <span
                      style={{
                        fontSize: 'var(--font-size-body-sm)',
                        fontFamily: 'monospace',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      •••• {card.lastDigits}
                    </span>
                  </div>
                )}

                {/* Ações */}
                <div
                  className="flex gap-2"
                  style={{
                    paddingTop: 'var(--spacing-sm)',
                    borderTop: '1px solid var(--color-border)',
                    gap: '8px',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => handleViewDetails(card, e)}
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      fontSize: 'var(--font-size-body-sm)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--gray-900)',
                      backgroundColor: 'transparent',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: 'var(--color-border)',
                      borderRadius: 'var(--border-radius-button)',
                      cursor: 'pointer',
                    }}
                  >
                    Ver Detalhes
                  </button>
                  <button
                    onClick={(e) => handleAddExpense(card, e)}
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      fontSize: 'var(--font-size-body-sm)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: '#FFFFFF',
                      backgroundColor: 'var(--gray-900)',
                      border: 'none',
                      borderRadius: 'var(--border-radius-button)',
                      cursor: 'pointer',
                    }}
                  >
                    Adicionar Despesa
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modais */}
      <AddAccountModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <CardDetailsModal
        isOpen={isDetailsModalOpen}
        card={selectedCard}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedCard(null)
        }}
      />
      {/* TODO: Passar card.id pré-selecionado para NewTransactionModal quando implementado */}
      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={() => {
          setIsNewTransactionModalOpen(false)
        }}
      />
    </div>
  )
}

export default CardsView
