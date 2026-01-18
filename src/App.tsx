import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout'
import { ROUTES } from './constants'
import { FinanceProvider } from './contexts/FinanceContext'

// Placeholder pages - serão implementadas nos próximos prompts
import { 
  BalanceCard, 
  IncomeCard, 
  ExpenseCard, 
  ExpensesByCategoryCarousel,
  FinancialFlowChart,
  CreditCardsWidget,
  UpcomingExpensesWidget,
  TransactionsTable,
  DashboardHeader 
} from './components/dashboard'

const Dashboard = () => {
  return (
    <div
      className="p-8"
      style={{
        padding: 'var(--spacing-container-padding)',
      }}
    >
      {/* Barra de controles no topo */}
      <DashboardHeader />

      {/* Linha principal: Carrossel + Cards de Resumo à esquerda, Cartões à direita */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch"
        style={{
          gap: 'var(--spacing-card-gap)',
          marginTop: '16px',
          alignItems: 'stretch',
        }}
      >
        {/* Coluna esquerda (2/3): Carrossel + Cards de Resumo */}
        <div className="lg:col-span-2 flex flex-col h-full" style={{ gap: 'var(--spacing-card-gap)' }}>
          {/* Carrossel de Gastos por Categoria */}
          <ExpensesByCategoryCarousel />

          {/* Cards de Resumo Financeiro */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch flex-1"
            style={{
              gap: 'var(--spacing-card-gap)',
              alignItems: 'stretch',
              flex: 1,
            }}
          >
            {/* Todos os cards têm o mesmo tamanho (fill) */}
            <div className="flex h-full">
              <BalanceCard />
            </div>
            <div className="flex h-full">
              <IncomeCard />
            </div>
            <div className="flex h-full">
              <ExpenseCard />
            </div>
          </div>
        </div>

        {/* Coluna direita (1/3): Widget de Cartões */}
        <div className="lg:col-span-1 flex h-full">
          <div className="flex-1 w-full h-full">
            <CreditCardsWidget />
          </div>
        </div>
      </div>

      {/* Linha 2: Gráfico de Fluxo Financeiro e Próximas Despesas */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        style={{
          gap: 'var(--spacing-card-gap)',
          marginTop: '16px',
        }}
      >
        <FinancialFlowChart />
        <UpcomingExpensesWidget />
      </div>

      {/* Linha 4: Tabela de Transações */}
      <div style={{ marginTop: '16px' }}>
        <TransactionsTable />
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
