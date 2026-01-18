import { useFinance } from '@/contexts/FinanceContext'
import ExpenseCategoryCard from '../ExpenseCategoryCard/ExpenseCategoryCard'

const ExpenseCategoriesSection = () => {
  const { calculateExpensesByCategory } = useFinance()
  const categoryExpenses = calculateExpensesByCategory()

  // Pegar apenas os top 4 categorias
  const topCategories = categoryExpenses.slice(0, 4)

  return (
    <div
      style={{
        marginBottom: 'var(--spacing-card-gap)',
      }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        style={{
          gap: 'var(--spacing-card-gap)',
        }}
      >
        {topCategories.map((categoryExpense) => (
          <ExpenseCategoryCard
            key={categoryExpense.category}
            categoryExpense={categoryExpense}
          />
        ))}
      </div>
    </div>
  )
}

export default ExpenseCategoriesSection
