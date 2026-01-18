import { useState, useMemo } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { TransactionStatus, DateRange } from '@/types'
import { formatCurrency } from '@/utils/format'
import NewTransactionModal from '@/components/dashboard/NewTransactionModal'
import TransactionsTable from '@/components/dashboard/TransactionsTable/TransactionsTable'
import SimpleDateRangePicker from '@/components/dashboard/FiltersMobileModal/SimpleDateRangePicker'

const TransactionsView = () => {
  const {
    getFilteredTransactions,
    bankAccounts,
    creditCards,
    familyMembers,
  } = useFinance()

  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false)

  // Estados de filtros locais adicionais
  const [localSearchText, setLocalSearchText] = useState('')
  const [localTransactionType, setLocalTransactionType] = useState<'all' | 'income' | 'expense'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedAccount, setSelectedAccount] = useState<string>('all')
  const [selectedMember, setSelectedMember] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | TransactionStatus>('all')
  const [dateRange, setDateRange] = useState<DateRange | null>(null)

  // Buscar transações filtradas (aplicam filtros globais)
  const globalFilteredTransactions = getFilteredTransactions()

  // Aplicar todos os filtros locais (AND lógico)
  const fullyFilteredTransactions = useMemo(() => {
    return globalFilteredTransactions.filter((txn) => {
      // Filtro de tipo local
      if (localTransactionType !== 'all' && txn.type !== localTransactionType) {
        return false
      }

      // Filtro de categoria
      if (selectedCategory !== 'all' && txn.category !== selectedCategory) {
        return false
      }

      // Filtro de conta/cartão
      if (selectedAccount !== 'all' && txn.accountId !== selectedAccount) {
        return false
      }

      // Filtro de membro
      if (selectedMember !== 'all' && txn.memberId !== selectedMember) {
        return false
      }

      // Filtro de status
      if (selectedStatus !== 'all' && txn.status !== selectedStatus) {
        return false
      }

      // Filtro de período local
      if (dateRange) {
        const txnTime = txn.date.getTime()
        const startTime = dateRange.startDate.getTime()
        const endTime = dateRange.endDate.getTime()
        if (txnTime < startTime || txnTime > endTime) {
          return false
        }
      }

      // Filtro de busca textual local
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
  }, [
    globalFilteredTransactions,
    localTransactionType,
    selectedCategory,
    selectedAccount,
    selectedMember,
    selectedStatus,
    dateRange,
    localSearchText,
  ])

  // Calcular estatísticas
  const stats = useMemo(() => {
    const incomes = fullyFilteredTransactions
      .filter((txn) => txn.type === 'income')
      .reduce((sum, txn) => sum + txn.value, 0)

    const expenses = fullyFilteredTransactions
      .filter((txn) => txn.type === 'expense')
      .reduce((sum, txn) => sum + txn.value, 0)

    const difference = incomes - expenses

    return {
      totalIncomes: incomes,
      totalExpenses: expenses,
      difference,
      count: fullyFilteredTransactions.length,
    }
  }, [fullyFilteredTransactions])

  // Obter todas as categorias usadas
  const allCategories = useMemo(() => {
    const categorySet = new Set<string>()
    globalFilteredTransactions.forEach((txn) => {
      categorySet.add(txn.category)
    })
    return Array.from(categorySet).sort()
  }, [globalFilteredTransactions])

  // Obter todas as contas/cartões
  const allAccounts = useMemo(() => {
    const accounts = [
      ...bankAccounts.map((acc) => ({ id: acc.id, name: acc.name })),
      ...creditCards.map((card) => ({ id: card.id, name: card.name })),
    ]
    return accounts
  }, [bankAccounts, creditCards])

  // Função de exportação CSV
  const handleExportCSV = () => {
    const headers = ['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor', 'Conta/Cartão', 'Membro', 'Status']
    const rows = fullyFilteredTransactions.map((txn) => {
      const date = new Intl.DateTimeFormat('pt-BR').format(txn.date)
      const accountName =
        bankAccounts.find((a) => a.id === txn.accountId)?.name ||
        creditCards.find((c) => c.id === txn.accountId)?.name ||
        'Desconhecido'
      const memberName =
        familyMembers.find((m) => m.id === txn.memberId)?.name || 'Família (Geral)'

      return [
        date,
        txn.type === 'income' ? 'Receita' : 'Despesa',
        txn.description,
        txn.category,
        txn.value.toFixed(2).replace('.', ','),
        accountName,
        memberName,
        txn.status === 'completed' ? 'Concluído' : txn.status === 'pending' ? 'Pendente' : 'Cancelado',
      ]
    })

    const csvContent = [
      headers.join(';'),
      ...rows.map((row) => row.join(';')),
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `transacoes_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        style={{
          marginBottom: 'var(--spacing-xl)',
          gap: 'var(--spacing-md)',
        }}
      >
        <h1
          style={{
            fontSize: 'var(--font-size-heading-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--gray-900)',
          }}
        >
          Transações
        </h1>

        <div className="flex gap-2" style={{ gap: '8px' }}>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2"
            style={{
              padding: '12px 16px',
              fontSize: 'var(--font-size-body-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
              backgroundColor: '#FFFFFF',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border)',
              borderRadius: '100px',
              cursor: 'pointer',
              gap: '8px',
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Exportar
          </button>

          <button
            onClick={() => setIsNewTransactionModalOpen(true)}
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
            Nova Transação
          </button>
        </div>
      </div>

      {/* Barra de Filtros Avançados */}
      <div
        className="rounded-card mb-6 p-4"
        style={{
          backgroundColor: '#FFFFFF',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--border-radius-card)',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          style={{ gap: '16px' }}
        >
          {/* Campo de Busca */}
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 flex-shrink-0"
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
            <input
              type="text"
              placeholder="Buscar..."
              value={localSearchText}
              onChange={(e) => setLocalSearchText(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: 'var(--font-size-body-sm)',
                color: 'var(--gray-900)',
                backgroundColor: 'var(--color-background-primary)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--color-border)',
                borderRadius: '100px',
                outline: 'none',
              }}
            />
          </div>

          {/* Select de Tipo */}
          <select
            value={localTransactionType}
            onChange={(e) => setLocalTransactionType(e.target.value as 'all' | 'income' | 'expense')}
            style={{
              padding: 'var(--spacing-input-padding)',
              fontSize: 'var(--font-size-body-md)',
              color: 'var(--gray-900)',
              backgroundColor: 'var(--color-background-primary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--border-radius-input)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">Todos os Tipos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>

          {/* Select de Categoria */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: 'var(--spacing-input-padding)',
              fontSize: 'var(--font-size-body-md)',
              color: 'var(--gray-900)',
              backgroundColor: 'var(--color-background-primary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--border-radius-input)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">Todas as Categorias</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Select de Conta/Cartão */}
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            style={{
              padding: 'var(--spacing-input-padding)',
              fontSize: 'var(--font-size-body-md)',
              color: 'var(--gray-900)',
              backgroundColor: 'var(--color-background-primary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--border-radius-input)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">Todas as Contas</option>
            {allAccounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>

          {/* Select de Membro */}
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            style={{
              padding: 'var(--spacing-input-padding)',
              fontSize: 'var(--font-size-body-md)',
              color: 'var(--gray-900)',
              backgroundColor: 'var(--color-background-primary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--border-radius-input)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">Todos os Membros</option>
            <option value="null">Família (Geral)</option>
            {familyMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>

          {/* Select de Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as 'all' | TransactionStatus)}
            style={{
              padding: 'var(--spacing-input-padding)',
              fontSize: 'var(--font-size-body-md)',
              color: 'var(--gray-900)',
              backgroundColor: 'var(--color-background-primary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--border-radius-input)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">Todos os Status</option>
            <option value="completed">Concluído</option>
            <option value="pending">Pendente</option>
            <option value="cancelled">Cancelado</option>
          </select>

          {/* Date Range Picker (ocupa 2 colunas no mobile/tablet) */}
          <div className="md:col-span-2 lg:col-span-1 xl:col-span-2">
            <SimpleDateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
          </div>
        </div>
      </div>

      {/* Linha de Resumo */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        style={{
          gap: '16px',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        <div
          className="rounded-card p-4"
          style={{
            backgroundColor: '#FFFFFF',
            padding: 'var(--spacing-lg)',
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
            Total de Receitas
          </p>
          <p
            style={{
              fontSize: 'var(--font-size-heading-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
            }}
          >
            {formatCurrency(stats.totalIncomes)}
          </p>
        </div>

        <div
          className="rounded-card p-4"
          style={{
            backgroundColor: '#FFFFFF',
            padding: 'var(--spacing-lg)',
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
            Total de Despesas
          </p>
          <p
            style={{
              fontSize: 'var(--font-size-heading-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
            }}
          >
            {formatCurrency(stats.totalExpenses)}
          </p>
        </div>

        <div
          className="rounded-card p-4"
          style={{
            backgroundColor: '#FFFFFF',
            padding: 'var(--spacing-lg)',
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
            Diferença
          </p>
          <p
            style={{
              fontSize: 'var(--font-size-heading-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: stats.difference >= 0 ? '#10B981' : '#DC2626',
            }}
          >
            {formatCurrency(stats.difference)}
          </p>
        </div>

        <div
          className="rounded-card p-4"
          style={{
            backgroundColor: '#FFFFFF',
            padding: 'var(--spacing-lg)',
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
            Transações Encontradas
          </p>
          <p
            style={{
              fontSize: 'var(--font-size-heading-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
            }}
          >
            {stats.count}
          </p>
        </div>
      </div>

      {/* Tabela de Transações (usando componente existente com props modificadas) */}
      {fullyFilteredTransactions.length === 0 ? (
        /* Estado Vazio */
        <div
          className="flex flex-col items-center justify-center rounded-card p-8"
          style={{
            padding: 'var(--spacing-xxl)',
            minHeight: '400px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--border-radius-card)',
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
            Nenhuma transação registrada ainda
          </h2>
          <p
            style={{
              fontSize: 'var(--font-size-body-md)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-lg)',
            }}
          >
            Comece adicionando sua primeira transação
          </p>
          <button
            onClick={() => setIsNewTransactionModalOpen(true)}
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
            Adicionar Primeira Transação
          </button>
        </div>
      ) : (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--border-radius-card)', padding: 'var(--spacing-lg)' }}>
          {/* TODO: Implementar tabela expandida com ordenação clicável e 10 itens por página */}
          {/* Por enquanto, usando componente existente que já tem boa estrutura */}
          <TransactionsTable />
        </div>
      )}

      {/* Modal de Nova Transação */}
      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={() => setIsNewTransactionModalOpen(false)}
      />
    </div>
  )
}

export default TransactionsView
