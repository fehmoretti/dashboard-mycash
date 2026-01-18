import { useState, useMemo } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { Transaction, BankAccount, CreditCard } from '@/types'
import { formatCurrency } from '@/utils/format'

// Função para formatar data de vencimento
const formatDueDate = (date: Date | undefined): string => {
  if (!date) return 'Sem data de vencimento'
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  return `Vence dia ${day}/${month}`
}

// Função para identificar origem do pagamento
const getPaymentOrigin = (
  accountId: string,
  bankAccounts: BankAccount[],
  creditCards: CreditCard[]
): string => {
  // Verificar se é conta bancária
  const bankAccount = bankAccounts.find((acc) => acc.id === accountId)
  if (bankAccount) {
    return bankAccount.name
  }

  // Verificar se é cartão de crédito
  const creditCard = creditCards.find((card) => card.id === accountId)
  if (creditCard) {
    return `Crédito ${creditCard.name.replace(/\s+(Mastercard|Visa|Elo)/i, '')} **** ${creditCard.lastDigits || '0000'}`
  }

  return 'Origem desconhecida'
}

interface ExpenseItemProps {
  transaction: Transaction
  paymentOrigin: string
  onMarkAsPaid: (transaction: Transaction) => void
}

const ExpenseItem = ({ transaction, paymentOrigin, onMarkAsPaid }: ExpenseItemProps) => {
  const [isHovering, setIsHovering] = useState(false)
  const [isMarking, setIsMarking] = useState(false)

  const handleMarkAsPaid = async () => {
    setIsMarking(true)
    // Pequeno delay para mostrar animação
    setTimeout(() => {
      onMarkAsPaid(transaction)
      setIsMarking(false)
    }, 300)
  }

  return (
    <div
      className="flex items-center justify-between py-4"
      style={{
        paddingTop: 'var(--spacing-md)',
        paddingBottom: 'var(--spacing-md)',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'var(--color-border)',
        opacity: isMarking ? 0 : 1,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      {/* Coluna esquerda - Informações */}
      <div className="flex flex-col flex-1" style={{ gap: 'var(--spacing-xs)' }}>
        {/* Descrição */}
        <p
          style={{
            fontSize: 'var(--font-size-body-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--gray-900)',
          }}
        >
          {transaction.description}
        </p>

        {/* Data de vencimento */}
        <p
          style={{
            fontSize: 'var(--font-size-body-sm)',
            fontWeight: 'var(--font-weight-regular)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {formatDueDate(transaction.dueDate)}
        </p>

        {/* Origem do pagamento */}
        <p
          style={{
            fontSize: 'var(--font-size-body-sm)',
            fontWeight: 'var(--font-weight-regular)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {paymentOrigin}
        </p>
      </div>

      {/* Coluna direita - Valor e botão */}
      <div
        className="flex flex-col items-end"
        style={{
          gap: 'var(--spacing-sm)',
          marginLeft: 'var(--spacing-md)',
        }}
      >
        {/* Valor */}
        <p
          style={{
            fontSize: 'var(--font-size-body-lg)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--gray-900)',
          }}
        >
          {formatCurrency(transaction.value)}
        </p>

        {/* Botão de check */}
        <button
          onClick={handleMarkAsPaid}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="flex items-center justify-center rounded-full"
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: isHovering ? 'var(--color-success)' : 'transparent',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: isHovering ? 'var(--color-success)' : 'var(--color-border)',
            borderRadius: 'var(--border-radius-full)',
            cursor: 'pointer',
            transitionProperty: 'background-color, border-color',
            transitionDuration: '200ms',
          }}
          aria-label="Marcar como paga"
        >
          <svg
            className="w-4 h-4"
            style={{ color: isHovering ? 'var(--gray-0)' : 'var(--gray-900)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

const UpcomingExpensesWidget = () => {
  const {
    transactions,
    bankAccounts,
    creditCards,
    updateTransaction,
    addTransaction,
  } = useFinance()

  // Filtrar e ordenar despesas pendentes (mostrar apenas 3 primeiras)
  const pendingExpenses = useMemo(() => {
    return transactions
      .filter(
        (txn) =>
          txn.type === 'expense' &&
          !txn.isPaid &&
          txn.dueDate !== undefined
      )
      .sort((a, b) => {
        // Ordenar por data de vencimento (crescente)
        if (!a.dueDate || !b.dueDate) return 0
        return a.dueDate.getTime() - b.dueDate.getTime()
      })
      .slice(0, 3) // Mostrar apenas os 3 primeiros itens
  }, [transactions])

  const handleAddExpense = () => {
    // TODO: Abrir modal de adicionar nova transação
    console.log('Abrir modal de adicionar nova transação')
  }

  const handleMarkAsPaid = (transaction: Transaction) => {
    // 1. Marcar despesa como paga
    updateTransaction(transaction.id, {
      isPaid: true,
      status: 'completed',
    })

    // 2. Se for recorrente, criar nova ocorrência para o próximo mês
    if (transaction.isRecurring && transaction.dueDate) {
      const nextDueDate = new Date(transaction.dueDate)
      nextDueDate.setMonth(nextDueDate.getMonth() + 1)

      // Criar nova transação sem 'id' e 'date' (serão gerados automaticamente)
      const { id, date, ...transactionWithoutIdAndDate } = transaction
      addTransaction({
        ...transactionWithoutIdAndDate,
        isPaid: false,
        status: 'pending',
        dueDate: nextDueDate,
      })
    }

    // 3. TODO: Verificar se há próxima parcela (para transações parceladas)
    // Por enquanto, transações parceladas não criam automaticamente próximas parcelas

    // 4. Exibir mensagem de confirmação (por enquanto console.log)
    console.log('Despesa marcada como paga!')
    // TODO: Implementar toast/notificação visual
  }

  return (
    <div
      className="rounded-card"
      style={{
        backgroundColor: 'var(--color-background-primary)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-border)',
        padding: 'var(--spacing-container-padding)',
        borderRadius: 'var(--border-radius-card)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between mb-4"
        style={{
          marginBottom: 'var(--spacing-md)',
        }}
      >
        {/* Título com ícone */}
        <div className="flex items-center gap-2" style={{ gap: 'var(--spacing-sm)' }}>
          {/* Ícone de carteira (20px) */}
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
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <h3
            style={{
              fontSize: 'var(--font-size-heading-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
            }}
          >
            Próximas despesas
          </h3>
        </div>

        {/* Botão de adicionar */}
        <button
          onClick={handleAddExpense}
          className="flex items-center justify-center rounded-full"
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'transparent',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--color-border)',
            borderRadius: 'var(--border-radius-full)',
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
          aria-label="Adicionar despesa"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Lista de despesas ou estado vazio */}
      {pendingExpenses.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-12"
          style={{
            paddingTop: 'var(--spacing-xl)',
            paddingBottom: 'var(--spacing-xl)',
            borderWidth: '1px',
            borderStyle: 'dashed',
            borderColor: 'var(--gray-200)',
            borderRadius: 'var(--border-radius-card)',
          }}
        >
          {/* Ícone de check circular verde */}
          <div
            className="flex items-center justify-center rounded-full mb-3"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--color-success)',
              marginBottom: 'var(--spacing-sm)',
            }}
          >
            <svg
              className="w-6 h-6"
              style={{ color: 'var(--gray-0)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Mensagem */}
          <p
            style={{
              fontSize: 'var(--font-size-body-md)',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Nenhuma despesa pendente
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {pendingExpenses.map((transaction) => (
            <ExpenseItem
              key={transaction.id}
              transaction={transaction}
              paymentOrigin={getPaymentOrigin(transaction.accountId, bankAccounts, creditCards)}
              onMarkAsPaid={handleMarkAsPaid}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default UpcomingExpensesWidget
