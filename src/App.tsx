import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout'
import { ROUTES } from './constants'
import { FinanceProvider } from './contexts/FinanceContext'

// Placeholder pages - serão implementadas nos próximos prompts
import { BalanceCard, IncomeCard, ExpenseCard, ExpenseCategoriesSection } from './components/dashboard'

const Dashboard = () => {
  return (
    <div
      className="p-8"
      style={{
        padding: 'var(--spacing-container-padding)',
      }}
    >
      {/* Linha 1: Cards de Categorias de Despesas */}
      <ExpenseCategoriesSection />

      {/* Linha 2: Cards de Resumo Financeiro */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        style={{
          gap: 'var(--spacing-card-gap)',
          marginTop: 'var(--spacing-card-gap)',
        }}
      >
        {/* Todos os cards têm o mesmo tamanho (fill) */}
        <div>
          <BalanceCard />
        </div>
        <div>
          <IncomeCard />
        </div>
        <div>
          <ExpenseCard />
        </div>
      </div>
    </div>
  )
}
const Cards = () => (
  <div className="p-8">
    <h1 className="text-heading-lg font-bold text-text-primary mb-4">
      Cartões
    </h1>
    <p className="text-text-secondary">Cartões em construção</p>
  </div>
)
const Transactions = () => (
  <div className="p-8">
    <h1 className="text-heading-lg font-bold text-text-primary mb-4">
      Transações
    </h1>
    <p className="text-text-secondary">Transações em construção</p>
  </div>
)
const Goals = () => (
  <div className="p-8">
    <h1 className="text-heading-lg font-bold text-text-primary mb-4">
      Objetivos
    </h1>
    <p className="text-text-secondary">Objetivos em construção</p>
  </div>
)
const Profile = () => (
  <div className="p-8">
    <h1 className="text-heading-lg font-bold text-text-primary mb-4">
      Perfil
    </h1>
    <p className="text-text-secondary">Perfil em construção</p>
  </div>
)

function App() {
  return (
    <FinanceProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.CARDS} element={<Cards />} />
          <Route path={ROUTES.TRANSACTIONS} element={<Transactions />} />
          <Route path={ROUTES.GOALS} element={<Goals />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
        </Route>
      </Routes>
    </FinanceProvider>
  )
}

export default App
