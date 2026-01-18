import { useState, useMemo, useEffect, useRef } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { BankAccount, CreditCard } from '@/types'
import { formatCurrency } from '@/utils/format'

const ITEMS_PER_PAGE = 5

// Função para formatar data como DD/MM/AAAA
const formatTransactionDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// Função para obter nome da conta/cartão
const getAccountName = (
  accountId: string,
  bankAccounts: BankAccount[],
  creditCards: CreditCard[]
): string => {
  const bankAccount = bankAccounts.find((acc) => acc.id === accountId)
  if (bankAccount) return bankAccount.name

  const creditCard = creditCards.find((card) => card.id === accountId)
  if (creditCard) return creditCard.name

  return 'Desconhecido'
}

// Função para obter avatar do membro
const getMemberAvatar = (memberId: string | null, familyMembers: any[]): string | null => {
  if (!memberId) return null
  const member = familyMembers.find((m) => m.id === memberId)
  return member?.avatarUrl || null
}

const TransactionsTable = () => {
  const {
    getFilteredTransactions,
    bankAccounts,
    creditCards,
    familyMembers,
  } = useFinance()

  // Estados locais da tabela
  const [localSearchText, setLocalSearchText] = useState('')
  const [localTransactionType, setLocalTransactionType] = useState<'all' | 'income' | 'expense'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const tableRef = useRef<HTMLDivElement>(null)

  // Buscar transações filtradas (aplicam filtros globais)
  const globalFilteredTransactions = getFilteredTransactions()

  // Aplicar filtros locais
  const localFilteredTransactions = useMemo(() => {
    return globalFilteredTransactions.filter((txn) => {
      // Filtro de tipo local
      if (localTransactionType !== 'all' && txn.type !== localTransactionType) {
        return false
      }

      // Filtro de busca textual local (descrição OU categoria)
      if (localSearchText.trim() !== '') {
        const searchLower = localSearchText.toLowerCase()
        const matchesDescription = txn.description.toLowerCase().includes(searchLower)
        const matchesCategory = txn.category.toLowerCase().includes(searchLower)
        if (!matchesDescription && !matchesCategory) {
          return false
        }
      }

      return true
    })
  }, [globalFilteredTransactions, localSearchText, localTransactionType])

  // Ordenar por data (decrescente - mais recente primeiro)
  const sortedTransactions = useMemo(() => {
    return [...localFilteredTransactions].sort((a, b) => {
      return b.date.getTime() - a.date.getTime()
    })
  }, [localFilteredTransactions])

  // Calcular paginação
  const totalPages = Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTransactions = sortedTransactions.slice(startIndex, endIndex)

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1)
  }, [localSearchText, localTransactionType, globalFilteredTransactions.length])

  // Scroll para topo ao mudar página
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Gerar números de página para exibição
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | string)[] = []

    if (currentPage <= 3) {
      // Mostrar primeiras 3, ..., últimas 2
      for (let i = 1; i <= 3; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages - 1)
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 2) {
      // Mostrar primeiras 2, ..., últimas 3
      pages.push(1)
      pages.push(2)
      pages.push('...')
      for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i)
    } else {
      // Mostrar primeira, ..., adjacentes, ..., última
      pages.push(1)
      pages.push('...')
      pages.push(currentPage - 1)
      pages.push(currentPage)
      pages.push(currentPage + 1)
      pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div ref={tableRef} style={{ marginTop: '16px' }}>
      {/* Header com título e controles */}
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4"
        style={{
          marginBottom: 'var(--spacing-md)',
          gap: 'var(--spacing-md)',
        }}
      >
        {/* Título */}
        <h3
          style={{
            fontSize: 'var(--font-size-heading-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--gray-900)',
          }}
        >
          Extrato Detalhado
        </h3>

        {/* Controles de busca e filtro */}
        <div className="flex flex-col sm:flex-row gap-2" style={{ gap: 'var(--spacing-sm)' }}>
          {/* Campo de busca local */}
          <div
            className="relative flex items-center"
            style={{
              width: '320px',
              maxWidth: '320px',
            }}
          >
            <div
              className="absolute left-0 flex items-center justify-center"
              style={{
                paddingLeft: '24px', // Padding horizontal do input
                pointerEvents: 'none',
              }}
            >
              <svg
                className="w-5 h-5"
                style={{ color: 'var(--color-text-secondary)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={localSearchText}
              onChange={(e) => setLocalSearchText(e.target.value)}
              placeholder="Buscar lançamentos..."
              className="w-full"
              style={{
                paddingTop: '12px',
                paddingBottom: '12px',
                paddingLeft: 'calc(24px + 20px + 8px)',
                paddingRight: '24px',
                borderRadius: '100px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-background-primary)',
                fontSize: 'var(--font-size-body-md)',
                color: 'var(--gray-900)',
              }}
            />
          </div>

          {/* Select de tipo */}
          <select
            value={localTransactionType}
            onChange={(e) => setLocalTransactionType(e.target.value as 'all' | 'income' | 'expense')}
            style={{
              width: 'fit-content',
              padding: 'var(--spacing-input-padding)', // 12px 24px
              borderRadius: 'var(--border-radius-input)', // 100px
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-background-primary)',
              fontSize: 'var(--font-size-body-md)',
              color: 'var(--gray-900)',
              cursor: 'pointer',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-primary)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-border)'
            }}
          >
            <option value="all">Todos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
        </div>
      </div>

      {/* Tabela */}
      <div
        className="rounded-card overflow-hidden w-full"
        style={{
          backgroundColor: '#FFFFFF',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--color-border)',
          borderRadius: 'var(--border-radius-card)',
          width: '100%',
        }}
      >
        {/* Header da tabela */}
        <div
          className="hidden md:grid md:grid-cols-7 gap-4 px-4 py-3"
          style={{
            gridTemplateColumns: '50px 100px 1fr 120px 150px 80px 120px',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-md)',
            paddingTop: 'var(--spacing-sm)',
            paddingBottom: 'var(--spacing-sm)',
            backgroundColor: '#FFFFFF',
            fontSize: 'var(--font-size-body-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--gray-900)',
          }}
        >
          <div>Avatar</div>
          <div>Data</div>
          <div>Descrição</div>
          <div>Categoria</div>
          <div>Conta/Cartão</div>
          <div>Parcelas</div>
          <div className="text-right">Valor</div>
        </div>

        {/* Linhas da tabela */}
        {currentTransactions.length === 0 ? (
          <div
            className="flex items-center justify-center py-12"
            style={{
              paddingTop: '96px',
              paddingBottom: '96px',
              height: '96px',
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-size-body-md)',
                fontWeight: 'var(--font-weight-regular)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Nenhum lançamento encontrado.
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {currentTransactions.map((transaction, index) => {
              const isEven = index % 2 === 0
              const accountName = getAccountName(transaction.accountId, bankAccounts, creditCards)
              const memberAvatar = getMemberAvatar(transaction.memberId, familyMembers)

              return (
                <div
                  key={transaction.id}
                  className="hidden md:grid md:grid-cols-7 gap-4 px-4 py-3 transition-colors duration-200"
                  style={{
                    gridTemplateColumns: '50px 100px 1fr 120px 150px 80px 120px',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    paddingTop: 'var(--spacing-sm)',
                    paddingBottom: 'var(--spacing-sm)',
                    backgroundColor: isEven ? 'var(--color-background-primary)' : 'var(--gray-50)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--gray-100)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isEven
                      ? 'var(--color-background-primary)'
                      : 'var(--gray-50)'
                  }}
                >
                  {/* Avatar */}
                  <div className="flex items-center">
                    {memberAvatar ? (
                      <img
                        src={memberAvatar}
                        alt=""
                        className="w-full h-full object-cover rounded-full"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: 'var(--border-radius-avatar)',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        className="flex items-center justify-center rounded-full"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: 'var(--border-radius-avatar)',
                          backgroundColor: 'var(--gray-200)',
                        }}
                      >
                        <svg
                          className="w-4 h-4"
                          style={{ color: 'var(--color-text-secondary)' }}
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
                      </div>
                    )}
                  </div>

                  {/* Data */}
                  <div className="flex items-center">
                    <span
                      style={{
                        fontSize: 'var(--font-size-body-sm)',
                        fontWeight: 'var(--font-weight-regular)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {formatTransactionDate(transaction.date)}
                    </span>
                  </div>

                  {/* Descrição */}
                  <div className="flex items-center gap-2" style={{ gap: 'var(--spacing-sm)' }}>
                    {/* Ícone indicativo do tipo */}
                    <div
                      className="flex items-center justify-center rounded-full flex-shrink-0"
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: 'var(--border-radius-full)',
                        backgroundColor:
                          transaction.type === 'income'
                            ? 'var(--color-chart-income)'
                            : 'var(--color-chart-expense)',
                      }}
                    >
                      {transaction.type === 'income' ? (
                        <svg
                          className="w-3 h-3"
                          style={{ color: 'var(--gray-900)' }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-3 h-3"
                          style={{ color: 'var(--gray-900)' }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 'var(--font-size-body-md)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--gray-900)',
                      }}
                    >
                      {transaction.description}
                    </span>
                  </div>

                  {/* Categoria */}
                  <div className="flex items-center">
                    <span
                      className="px-2 py-1 rounded-button"
                      style={{
                        paddingLeft: 'var(--spacing-sm)',
                        paddingRight: 'var(--spacing-sm)',
                        paddingTop: 'var(--spacing-xs)',
                        paddingBottom: 'var(--spacing-xs)',
                        borderRadius: 'var(--border-radius-button)',
                        backgroundColor: 'var(--gray-100)',
                        fontSize: 'var(--font-size-body-sm)',
                        fontWeight: 'var(--font-weight-regular)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {transaction.category}
                    </span>
                  </div>

                  {/* Conta/Cartão */}
                  <div className="flex items-center">
                    <span
                      style={{
                        fontSize: 'var(--font-size-body-sm)',
                        fontWeight: 'var(--font-weight-regular)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {accountName}
                    </span>
                  </div>

                  {/* Parcelas */}
                  <div className="flex items-center">
                    <span
                      style={{
                        fontSize: 'var(--font-size-body-sm)',
                        fontWeight: 'var(--font-weight-regular)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {transaction.installments > 1 ? `${transaction.installments}x` : '-'}
                    </span>
                  </div>

                  {/* Valor */}
                  <div className="flex items-center justify-end">
                    <span
                      style={{
                        fontSize: 'var(--font-size-body-md)',
                        fontWeight: 'var(--font-weight-bold)',
                        color:
                          transaction.type === 'income'
                            ? 'var(--color-success)'
                            : 'var(--gray-900)',
                      }}
                    >
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.value)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Paginação */}
      {sortedTransactions.length > 0 && (
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-4"
          style={{
            marginTop: 'var(--spacing-md)',
            gap: 'var(--spacing-md)',
          }}
        >
          {/* Contador */}
          <div>
            <span
              style={{
                fontSize: 'var(--font-size-body-sm)',
                fontWeight: 'var(--font-weight-regular)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Mostrando {startIndex + 1} a {Math.min(endIndex, sortedTransactions.length)} de{' '}
              {sortedTransactions.length}
            </span>
          </div>

          {/* Controles de navegação */}
          <div className="flex items-center gap-2" style={{ gap: 'var(--spacing-sm)' }}>
            {/* Botão Anterior */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center rounded-button"
              style={{
                padding: 'var(--spacing-xs)',
                borderRadius: 'var(--border-radius-button)',
                backgroundColor: 'transparent',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--color-border)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1,
                transitionProperty: 'opacity, background-color',
                transitionDuration: '200ms',
              }}
              onMouseEnter={(e) => {
                if (currentPage > 1) {
                  e.currentTarget.style.backgroundColor = 'var(--gray-100)'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage > 1) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
              aria-label="Página anterior"
            >
              <svg
                className="w-4 h-4"
                style={{ color: 'var(--gray-900)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Números de página */}
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    style={{
                      fontSize: 'var(--font-size-body-sm)',
                      fontWeight: 'var(--font-weight-regular)',
                      color: 'var(--color-text-secondary)',
                      padding: '0 var(--spacing-xs)',
                    }}
                  >
                    ...
                  </span>
                )
              }

              const pageNum = page as number
              const isCurrentPage = pageNum === currentPage

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className="flex items-center justify-center rounded-button"
                  style={{
                    minWidth: '32px',
                    height: '32px',
                    paddingLeft: 'var(--spacing-sm)',
                    paddingRight: 'var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-button)',
                    backgroundColor: isCurrentPage ? 'var(--gray-900)' : 'transparent',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: isCurrentPage ? 'var(--gray-900)' : 'var(--color-border)',
                    fontSize: 'var(--font-size-body-sm)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: isCurrentPage ? 'var(--gray-0)' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    transitionProperty: 'background-color, border-color, color',
                    transitionDuration: '200ms',
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrentPage) {
                      e.currentTarget.style.backgroundColor = 'var(--gray-100)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrentPage) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                  aria-label={`Ir para página ${pageNum}`}
                >
                  {pageNum}
                </button>
              )
            })}

            {/* Botão Próxima */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center rounded-button"
              style={{
                padding: 'var(--spacing-xs)',
                borderRadius: 'var(--border-radius-button)',
                backgroundColor: 'transparent',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--color-border)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1,
                transitionProperty: 'opacity, background-color',
                transitionDuration: '200ms',
              }}
              onMouseEnter={(e) => {
                if (currentPage < totalPages) {
                  e.currentTarget.style.backgroundColor = 'var(--gray-100)'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage < totalPages) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
              aria-label="Próxima página"
            >
              <svg
                className="w-4 h-4"
                style={{ color: 'var(--gray-900)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionsTable
