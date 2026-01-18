import { formatCurrency } from '@/utils/format'
import { CategoryExpense } from '@/types'

interface ExpenseCategoryCardProps {
  categoryExpense: CategoryExpense
}

const ExpenseCategoryCard = ({ categoryExpense }: ExpenseCategoryCardProps) => {
  // Todos os cards usam verde-limão no medidor circular
  const color = 'var(--color-primary)'
  const { category, total, percentage } = categoryExpense

  // Calcular ângulo do medidor circular (0-360 graus, mas apenas até percentage)
  // O SVG usa stroke-dasharray onde o comprimento total do círculo é aproximadamente 2πr
  const radius = 32 // Raio do círculo (diâmetro 64px)
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div
      className="rounded-card"
      style={{
        backgroundColor: 'var(--color-background-primary)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-border)',
        padding: '24px', // 24px de padding no container geral
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0, // Remover gap geral, usar marginBottom específico
        minHeight: '180px',
        overflow: 'visible', // Garantir que o círculo não seja cortado pelo card
      }}
    >
      {/* Medidor circular */}
      <div 
        className="relative flex items-center justify-center" 
        style={{ 
          width: '64px', 
          height: '64px',
          overflow: 'visible', // Garantir que o círculo não seja cortado
          marginBottom: '12px', // 12px entre gráfico e valores abaixo
        }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          style={{ 
            transform: 'rotate(-90deg)',
            overflow: 'visible', // Evitar corte do círculo
          }}
        >
          {/* Círculo de fundo (cinza claro) */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="var(--gray-200)"
            strokeWidth="4"
          />
          {/* Círculo de progresso (colorido) */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        </svg>
        {/* Percentual no centro - sem rotação (sentido normal) */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontSize: 'var(--font-size-body-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--gray-900)',
          }}
        >
          {percentage.toFixed(0)}%
        </div>
      </div>

      {/* Nome da categoria */}
      <p
        className="text-center truncate w-full"
        style={{
          fontSize: 'var(--font-size-body-sm)',
          fontWeight: 'var(--font-weight-regular)',
          color: 'var(--gray-900)',
          marginBottom: '4px', // 4px entre título e valor
        }}
        title={category}
      >
        {category}
      </p>

      {/* Valor formatado */}
      <p
        className="font-bold"
        style={{
          fontSize: 'var(--font-size-body-md)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--gray-900)',
        }}
      >
        {formatCurrency(total)}
      </p>
    </div>
  )
}

export default ExpenseCategoryCard
