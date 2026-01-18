import { useFinance } from '@/contexts/FinanceContext'
import { useCountAnimation } from '@/hooks/useCountAnimation'
import { formatCurrency } from '@/utils/format'

const ExpenseCard = () => {
  const { calculateExpensesForPeriod } = useFinance()
  const expenses = calculateExpensesForPeriod()
  const animatedValue = useCountAnimation(expenses)

  return (
    <div
      className="rounded-card"
      style={{
        backgroundColor: 'var(--color-background-primary)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-border)',
        padding: 'var(--spacing-container-padding)',
        minHeight: '160px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Ícone e label no topo à esquerda (empilhados verticalmente) */}
      <div className="flex flex-col">
        {/* Ícone de seta vermelha para cima (↑) */}
        <div className="mb-2">
          <span
            className="font-bold"
            style={{
              fontSize: 'var(--font-size-heading-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-danger)',
            }}
          >
            ↑
          </span>
        </div>
        {/* Label "Despesas" */}
        <p
          className="mb-4"
          style={{
            fontSize: 'var(--font-size-body-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--gray-900)',
          }}
        >
          Despesas
        </p>
      </div>

      {/* Valor formatado */}
      <p
        className="font-bold"
        style={{
          fontSize: 'var(--font-size-heading-md)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--gray-900)',
        }}
      >
        {formatCurrency(animatedValue)}
      </p>
    </div>
  )
}

export default ExpenseCard
