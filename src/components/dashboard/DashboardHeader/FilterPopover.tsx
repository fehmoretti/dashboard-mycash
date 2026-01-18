import { useFinance } from '@/contexts/FinanceContext'

interface FilterPopoverProps {
  onClose?: () => void
}

const FilterPopover = ({ }: FilterPopoverProps) => {
  const { transactionType, setTransactionType } = useFinance()

  const handleTypeChange = (type: 'all' | 'income' | 'expense') => {
    setTransactionType(type)
  }

  return (
    <div
      className="absolute top-full mt-2 right-0 rounded-lg shadow-lg z-50"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: 'var(--spacing-container-padding)',
        minWidth: '280px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-border)',
        borderRadius: 'var(--border-radius-card)',
      }}
    >
      {/* Seção Tipo de Transação */}
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <p
          className="mb-2 font-medium"
          style={{
            fontSize: 'var(--font-size-body-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--gray-900)',
            marginBottom: 'var(--spacing-sm)',
          }}
        >
          Tipo de Transação
        </p>
        <div
          className="flex flex-col gap-2"
          style={{
            gap: 'var(--spacing-xs)',
          }}
        >
          {(['all', 'income', 'expense'] as const).map((type) => {
            const labels = {
              all: 'Todos',
              income: 'Receitas',
              expense: 'Despesas',
            }

            const isSelected = transactionType === type

            return (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className="text-left rounded-button"
                style={{
                  padding: 'var(--spacing-input-padding)',
                  borderRadius: 'var(--border-radius-button)',
                  backgroundColor: isSelected ? 'var(--gray-900)' : 'transparent',
                  color: isSelected ? 'var(--gray-0)' : 'var(--gray-900)',
                  fontSize: 'var(--font-size-body-md)',
                  fontWeight: 'var(--font-weight-regular)',
                  cursor: 'pointer',
                  transitionProperty: 'background-color, color',
                  transitionDuration: '200ms',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'var(--gray-100)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                {labels[type]}
              </button>
            )
          })}
        </div>
      </div>

      {/* TODO: Implementar seletor de período com calendário */}
    </div>
  )
}

export default FilterPopover
