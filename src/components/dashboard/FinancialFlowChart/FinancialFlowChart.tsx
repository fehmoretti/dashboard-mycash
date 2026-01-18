import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/utils/format'
import { useFinance } from '@/contexts/FinanceContext'

// Nomes dos meses em português
const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

/**
 * Calcula dados de fluxo financeiro dos últimos 7 meses baseado nas transações do Supabase
 */
const calculateFinancialFlowData = (transactions: any[]) => {
  // Obter data atual e calcular os últimos 7 meses
  const now = new Date()
  const months: { month: string; monthIndex: number; year: number; income: number; expense: number }[] = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      month: monthNames[date.getMonth()],
      monthIndex: date.getMonth(),
      year: date.getFullYear(),
      income: 0,
      expense: 0,
    })
  }

  // Agrupar transações por mês e calcular totais
  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date)
    const monthIndex = transactionDate.getMonth()
    const year = transactionDate.getFullYear()

    const monthData = months.find((m) => m.monthIndex === monthIndex && m.year === year)
    if (monthData) {
      if (transaction.type === 'income') {
        monthData.income += transaction.value
      } else if (transaction.type === 'expense') {
        monthData.expense += transaction.value
      }
    }
  })

  // Retornar apenas os dados necessários para o gráfico
  return months.map(({ month, income, expense }) => ({ month, income, expense }))
}

// Formatador para eixo Y (valores compactos: R$ 2k, R$ 4k, etc)
const formatYAxisValue = (value: number): string => {
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}k`
  }
  return `R$ ${value}`
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const income = payload.find((p: any) => p.dataKey === 'income')
    const expense = payload.find((p: any) => p.dataKey === 'expense')

    return (
      <div
        style={{
          backgroundColor: 'var(--color-background-primary)',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          borderRadius: 'var(--border-radius-card)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--color-border)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <p
          style={{
            fontSize: 'var(--font-size-body-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--gray-900)',
            marginBottom: 'var(--spacing-xs)',
          }}
        >
          {label}
        </p>
        {income && (
          <p
            style={{
              fontSize: 'var(--font-size-body-sm)',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--color-success)',
              marginBottom: 'var(--spacing-xs)',
            }}
          >
            Receitas: {formatCurrency(income.value)}
          </p>
        )}
        {expense && (
          <p
            style={{
              fontSize: 'var(--font-size-body-sm)',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--gray-900)',
            }}
          >
            Despesas: {formatCurrency(expense.value)}
          </p>
        )}
      </div>
    )
  }
  return null
}

const FinancialFlowChart = () => {
  const { transactions } = useFinance()

  // Calcular dados do gráfico baseado nas transações do Supabase
  const chartData = useMemo(() => {
    return calculateFinancialFlowData(transactions)
  }, [transactions])

  return (
    <div
      className="rounded-card w-full"
      style={{
        backgroundColor: 'var(--color-background-primary)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-border)',
        padding: 'var(--spacing-container-padding)',
        width: '100%',
      }}
    >
      {/* Header com título e legenda */}
      <div
        className="flex items-center justify-between mb-4 flex-wrap"
        style={{
          marginBottom: 'var(--spacing-md)',
          gap: 'var(--spacing-md)',
        }}
      >
        {/* Título com ícone */}
        <div className="flex items-center gap-2">
          {/* Ícone de gráfico crescente */}
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
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <h3
            style={{
              fontSize: 'var(--font-size-heading-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
            }}
          >
            Fluxo Financeiro
          </h3>
        </div>

        {/* Legenda horizontal */}
        <div className="flex items-center gap-4" style={{ gap: 'var(--spacing-md)' }}>
          {/* Receitas */}
          <div className="flex items-center gap-2" style={{ gap: 'var(--spacing-sm)' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: 'var(--border-radius-full)',
                backgroundColor: 'var(--color-primary)',
              }}
            />
            <span
              style={{
                fontSize: 'var(--font-size-body-sm)',
                fontWeight: 'var(--font-weight-regular)',
                color: 'var(--gray-900)',
              }}
            >
              Receitas
            </span>
          </div>

          {/* Despesas */}
          <div className="flex items-center gap-2" style={{ gap: 'var(--spacing-sm)' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: 'var(--border-radius-full)',
                backgroundColor: 'var(--gray-900)',
              }}
            />
            <span
              style={{
                fontSize: 'var(--font-size-body-sm)',
                fontWeight: 'var(--font-weight-regular)',
                color: 'var(--gray-900)',
              }}
            >
              Despesas
            </span>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {/* Gradiente para receitas (verde-limão 30% opaco -> transparente) */}
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>

            {/* Gradiente para despesas (preto 10% opaco -> transparente) */}
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--gray-900)" stopOpacity={0.1} />
              <stop offset="100%" stopColor="var(--gray-900)" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Grid horizontal tracejado */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--gray-200)"
            vertical={false}
          />

          {/* Eixo X - Meses */}
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-body-sm)',
            }}
          />

          {/* Eixo Y - Valores monetários */}
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-body-sm)',
            }}
            tickFormatter={formatYAxisValue}
          />

          {/* Tooltip customizado */}
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--gray-200)', strokeWidth: 1 }} />

          {/* Área de Receitas */}
          <Area
            type="monotone"
            dataKey="income"
            stroke="var(--color-primary)"
            strokeWidth={3}
            fill="url(#colorIncome)"
          />

          {/* Área de Despesas */}
          <Area
            type="monotone"
            dataKey="expense"
            stroke="var(--gray-900)"
            strokeWidth={3}
            fill="url(#colorExpense)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default FinancialFlowChart
