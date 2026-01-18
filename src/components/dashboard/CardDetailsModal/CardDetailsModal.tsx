import { useState, useEffect, useMemo } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { CreditCard } from '@/types'
import { formatCurrency, formatDate } from '@/utils/format'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants'
import NewTransactionModal from '../NewTransactionModal'

interface CardDetailsModalProps {
  isOpen: boolean
  card: CreditCard | null
  onClose: () => void
}

const ITEMS_PER_PAGE = 10

const CardDetailsModal = ({ isOpen, card, onClose }: CardDetailsModalProps) => {
  const { transactions } = useFinance()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false)

  // Reset página quando modal abre
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1)
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

  if (!isOpen || !card) return null

  // Calcular informações do cartão
  const availableLimit = card.limit - card.currentBill
  const usagePercentage = card.limit > 0 ? (card.currentBill / card.limit) * 100 : 0

  // Filtrar transações de despesa deste cartão
  const cardExpenses = useMemo(() => {
    return transactions.filter(
      (txn) => txn.type === 'expense' && txn.accountId === card.id
    )
  }, [transactions, card.id])

  // Ordenar por data (mais recente primeiro)
  const sortedExpenses = useMemo(() => {
    return [...cardExpenses].sort((a, b) => {
      return b.date.getTime() - a.date.getTime()
    })
  }, [cardExpenses])

  // Paginação
  const totalPages = Math.ceil(sortedExpenses.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentExpenses = sortedExpenses.slice(startIndex, endIndex)

  // Formatar dia de fechamento e vencimento
  const formatDay = (day: number): string => {
    return `Dia ${day.toString().padStart(2, '0')}`
  }

  // Navegar para extrato completo com filtro
  const handleViewFullStatement = () => {
    // TODO: Implementar filtro automático no contexto
    navigate(ROUTES.TRANSACTIONS)
    onClose()
  }

  // Abrir modal de nova transação
  const handleAddExpense = () => {
    setShowNewTransactionModal(true)
  }

  // Fechar modal de nova transação e recarregar se necessário
  const handleCloseNewTransaction = () => {
    setShowNewTransactionModal(false)
    // A página será atualizada automaticamente pelo contexto
  }

  return (
    <>
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
            maxWidth: '900px',
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
              {card.name}
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
              maxHeight: 'calc(90vh - 250px)',
            }}
          >
            {/* Área de Informações */}
            <div
              style={{
                marginBottom: 'var(--spacing-lg)',
              }}
            >
              <h3
                style={{
                  fontSize: 'var(--font-size-body-lg)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                  marginBottom: 'var(--spacing-md)',
                }}
              >
                Informações do Cartão
              </h3>

              {/* Grid de informações */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                style={{ gap: 'var(--spacing-md)' }}
              >
                {/* Limite Total */}
                <div
                  style={{
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'var(--gray-50)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border)',
                    borderRadius: 'var(--border-radius-card)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-sm)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '4px',
                    }}
                  >
                    Limite Total
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-lg)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--gray-900)',
                    }}
                  >
                    {formatCurrency(card.limit)}
                  </p>
                </div>

                {/* Fatura Atual */}
                <div
                  style={{
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'var(--gray-50)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border)',
                    borderRadius: 'var(--border-radius-card)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-sm)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '4px',
                    }}
                  >
                    Fatura Atual
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-lg)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--gray-900)',
                    }}
                  >
                    {formatCurrency(card.currentBill)}
                  </p>
                </div>

                {/* Limite Disponível */}
                <div
                  style={{
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'var(--gray-50)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border)',
                    borderRadius: 'var(--border-radius-card)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-sm)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '4px',
                    }}
                  >
                    Limite Disponível
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-lg)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--gray-900)',
                    }}
                  >
                    {formatCurrency(availableLimit)}
                  </p>
                </div>

                {/* Percentual de Uso */}
                <div
                  style={{
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'var(--gray-50)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border)',
                    borderRadius: 'var(--border-radius-card)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-sm)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '4px',
                    }}
                  >
                    Percentual de Uso
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-lg)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--gray-900)',
                    }}
                  >
                    {usagePercentage.toFixed(1)}%
                  </p>
                </div>

                {/* Data de Fechamento */}
                <div
                  style={{
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'var(--gray-50)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border)',
                    borderRadius: 'var(--border-radius-card)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-sm)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '4px',
                    }}
                  >
                    Data de Fechamento
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-lg)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--gray-900)',
                    }}
                  >
                    {formatDay(card.closingDay)}
                  </p>
                </div>

                {/* Data de Vencimento */}
                <div
                  style={{
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'var(--gray-50)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border)',
                    borderRadius: 'var(--border-radius-card)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-sm)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '4px',
                    }}
                  >
                    Data de Vencimento
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-lg)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--gray-900)',
                    }}
                  >
                    {formatDay(card.dueDay)}
                  </p>
                </div>

                {/* Últimos 4 dígitos (se disponível) */}
                {card.lastDigits && (
                  <div
                    style={{
                      padding: 'var(--spacing-md)',
                      backgroundColor: 'var(--gray-50)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: 'var(--color-border)',
                      borderRadius: 'var(--border-radius-card)',
                    }}
                  >
                    <p
                      style={{
                        fontSize: 'var(--font-size-body-sm)',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '4px',
                      }}
                    >
                      Número do Cartão
                    </p>
                    <p
                      style={{
                        fontSize: 'var(--font-size-body-lg)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--gray-900)',
                      }}
                    >
                      •••• {card.lastDigits}
                    </p>
                  </div>
                )}
              </div>

              {/* Representação visual do uso do limite - Barra de progresso */}
              <div style={{ marginTop: 'var(--spacing-lg)' }}>
                <div
                  className="flex items-center justify-between"
                  style={{ marginBottom: 'var(--spacing-sm)' }}
                >
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-sm)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--gray-900)',
                    }}
                  >
                    Uso do Limite
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-sm)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {usagePercentage.toFixed(1)}%
                  </p>
                </div>
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
                      width: `${usagePercentage}%`,
                      height: '100%',
                      backgroundColor: 'var(--color-primary)',
                      borderRadius: '100px',
                      transition: 'width 0.3s ease-out',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Área de Despesas */}
            <div>
              <h3
                style={{
                  fontSize: 'var(--font-size-body-lg)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                  marginBottom: 'var(--spacing-md)',
                }}
              >
                Despesas do Cartão
              </h3>

              {sortedExpenses.length === 0 ? (
                <div
                  style={{
                    padding: 'var(--spacing-xl)',
                    textAlign: 'center',
                    backgroundColor: 'var(--gray-50)',
                    borderWidth: '1px',
                    borderStyle: 'dashed',
                    borderColor: 'var(--color-border)',
                    borderRadius: 'var(--border-radius-card)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-md)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    Nenhuma despesa registrada neste cartão ainda.
                  </p>
                </div>
              ) : (
                <>
                  {/* Tabela de despesas */}
                  <div
                    style={{
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: 'var(--color-border)',
                      borderRadius: 'var(--border-radius-card)',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Header da tabela */}
                    <div
                      className="hidden md:grid grid-cols-5 gap-4 px-4 py-3"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderBottom: '1px solid var(--color-border)',
                        fontSize: 'var(--font-size-body-sm)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--gray-900)',
                      }}
                    >
                      <div>Data</div>
                      <div>Descrição</div>
                      <div>Categoria</div>
                      <div>Parcelas</div>
                      <div className="text-right">Valor</div>
                    </div>

                    {/* Linhas da tabela */}
                    <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                      {currentExpenses.map((expense, index) => {
                        const isEven = index % 2 === 0

                        return (
                          <div
                            key={expense.id}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-3"
                            style={{
                              backgroundColor: isEven ? '#FFFFFF' : 'var(--gray-50)',
                            }}
                          >
                            <div>
                              <span className="md:hidden font-bold" style={{ fontSize: 'var(--font-size-body-sm)' }}>
                                Data:{' '}
                              </span>
                              <span style={{ fontSize: 'var(--font-size-body-sm)', color: 'var(--gray-900)' }}>
                                {formatDate(expense.date)}
                              </span>
                            </div>
                            <div>
                              <span className="md:hidden font-bold" style={{ fontSize: 'var(--font-size-body-sm)' }}>
                                Descrição:{' '}
                              </span>
                              <span
                                style={{
                                  fontSize: 'var(--font-size-body-sm)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  color: 'var(--gray-900)',
                                }}
                              >
                                {expense.description}
                              </span>
                            </div>
                            <div>
                              <span className="md:hidden font-bold" style={{ fontSize: 'var(--font-size-body-sm)' }}>
                                Categoria:{' '}
                              </span>
                              <span
                                style={{
                                  fontSize: 'var(--font-size-body-sm)',
                                  padding: '2px 8px',
                                  backgroundColor: 'var(--gray-100)',
                                  borderRadius: 'var(--border-radius-button)',
                                  color: 'var(--color-text-secondary)',
                                }}
                              >
                                {expense.category}
                              </span>
                            </div>
                            <div>
                              <span className="md:hidden font-bold" style={{ fontSize: 'var(--font-size-body-sm)' }}>
                                Parcelas:{' '}
                              </span>
                              <span style={{ fontSize: 'var(--font-size-body-sm)', color: 'var(--gray-900)' }}>
                                {expense.installments > 1 ? `${expense.installments}x` : '-'}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="md:hidden font-bold" style={{ fontSize: 'var(--font-size-body-sm)' }}>
                                Valor:{' '}
                              </span>
                              <span
                                style={{
                                  fontSize: 'var(--font-size-body-sm)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  color: 'var(--gray-900)',
                                }}
                              >
                                - {formatCurrency(expense.value)}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Paginação (se houver mais de 10 despesas) */}
                  {totalPages > 1 && (
                    <div
                      className="flex items-center justify-between mt-4"
                      style={{
                        marginTop: 'var(--spacing-md)',
                      }}
                    >
                      <p
                        style={{
                          fontSize: 'var(--font-size-body-sm)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Mostrando {startIndex + 1} a {Math.min(endIndex, sortedExpenses.length)} de{' '}
                        {sortedExpenses.length}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          style={{
                            padding: '8px 16px',
                            fontSize: 'var(--font-size-body-sm)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: currentPage === 1 ? 'var(--color-text-secondary)' : 'var(--gray-900)',
                            backgroundColor: 'transparent',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: 'var(--color-border)',
                            borderRadius: 'var(--border-radius-button)',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            opacity: currentPage === 1 ? 0.5 : 1,
                          }}
                        >
                          Anterior
                        </button>
                        <span
                          style={{
                            fontSize: 'var(--font-size-body-sm)',
                            color: 'var(--gray-900)',
                            padding: '0 8px',
                          }}
                        >
                          {currentPage} / {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          style={{
                            padding: '8px 16px',
                            fontSize: 'var(--font-size-body-sm)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: currentPage === totalPages ? 'var(--color-text-secondary)' : 'var(--gray-900)',
                            backgroundColor: 'transparent',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: 'var(--color-border)',
                            borderRadius: 'var(--border-radius-button)',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            opacity: currentPage === totalPages ? 0.5 : 1,
                          }}
                        >
                          Próxima
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Footer com botões de ação */}
          <footer
            className="flex items-center justify-between flex-shrink-0"
            style={{
              padding: 'var(--spacing-lg)',
              borderTop: '1px solid var(--color-border)',
              backgroundColor: '#FFFFFF',
              gap: 'var(--spacing-sm)',
              flexWrap: 'wrap',
            }}
          >
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleViewFullStatement}
                style={{
                  padding: '12px 16px',
                  fontSize: 'var(--font-size-body-sm)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                  backgroundColor: 'transparent',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--color-border)',
                  borderRadius: '100px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Ver Extrato Completo
              </button>
              <button
                onClick={handleAddExpense}
                style={{
                  padding: '12px 16px',
                  fontSize: 'var(--font-size-body-sm)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                  backgroundColor: 'transparent',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--color-border)',
                  borderRadius: '100px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Adicionar Despesa
              </button>
              <button
                onClick={() => {
                  // TODO: Implementar edição de cartão
                  console.log('Editar cartão:', card.id)
                }}
                style={{
                  padding: '12px 16px',
                  fontSize: 'var(--font-size-body-sm)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                  backgroundColor: 'transparent',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--color-border)',
                  borderRadius: '100px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Editar Cartão
              </button>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: '12px 16px',
                fontSize: 'var(--font-size-body-md)',
                fontWeight: 'var(--font-weight-bold)',
                color: '#FFFFFF',
                backgroundColor: 'var(--gray-900)',
                border: 'none',
                borderRadius: '100px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Fechar
            </button>
          </footer>
        </div>
      </div>

      {/* Modal de nova transação (quando abrir Adicionar Despesa) */}
      {showNewTransactionModal && (
        <NewTransactionModal
          isOpen={showNewTransactionModal}
          onClose={handleCloseNewTransaction}
          // TODO: Passar accountId pré-preenchido quando implementado
        />
      )}
    </>
  )
}

export default CardDetailsModal
