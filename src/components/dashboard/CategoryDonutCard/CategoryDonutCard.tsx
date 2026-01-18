import { useState } from 'react'
import { formatCurrency } from '@/utils/format'
import { CategoryExpense } from '@/types'

interface CategoryDonutCardProps {
  categoryExpense: CategoryExpense
  color: string
}

const CategoryDonutCard = ({ categoryExpense, color }: CategoryDonutCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const { category, total, percentage } = categoryExpense

  // Calcular ângulo do medidor circular
  const radius = 32 // Raio do círculo (diâmetro 64px)
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div
      className="rounded-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%', // Ocupa 100% do container flex
        backgroundColor: 'var(--color-background-primary)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: isHovered ? 'var(--color-primary)' : 'var(--color-border)',
        padding: '24px', // Padding no container geral
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'auto',
        overflow: 'visible',
        cursor: 'pointer',
        transitionProperty: 'border-color',
        transitionDuration: '200ms',
      }}
    >
      {/* Medidor circular (donut) */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: '64px',
          height: '64px',
          overflow: 'visible',
          marginBottom: '12px', // 12px entre gráfico e valores abaixo
        }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          style={{
            transform: 'rotate(-90deg)',
            overflow: 'visible',
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
          {/* Círculo de progresso (colorido) - anel externo */}
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
          {/* Anel interno branco (círculo menor) */}
          <circle
            cx="32"
            cy="32"
            r={radius - 8}
            fill="var(--color-background-primary)"
          />
        </svg>
        {/* Percentual no centro - uma casa decimal */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontSize: 'var(--font-size-body-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--gray-900)',
          }}
        >
          {percentage.toFixed(1)}%
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

export default CategoryDonutCard
