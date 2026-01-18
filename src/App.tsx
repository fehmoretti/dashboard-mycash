import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout'
import { ROUTES } from './constants'
import { FinanceProvider } from './contexts/FinanceContext'
import CardsView from './pages/CardsView'
import TransactionsView from './pages/TransactionsView'
import ProfileView from './pages/ProfileView'

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
      className="px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8 w-full"
      style={{
        backgroundColor: '#F5F6F8',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      {/* Barra de controles no topo */}
      <DashboardHeader />

      {/* Linha principal: Carrossel + Cards de Resumo à esquerda, Cartões à direita */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch"
        style={{
          gap: '16px',
          marginTop: '16px',
          alignItems: 'stretch',
        }}
      >
        {/* Coluna esquerda (2/3): Carrossel + Cards de Resumo */}
        <div className="lg:col-span-2 flex flex-col h-full" style={{ gap: '16px' }}>
          {/* Carrossel de Gastos por Categoria */}
          <ExpensesByCategoryCarousel />

          {/* Cards de Resumo Financeiro */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch flex-1"
            style={{
              gap: '16px',
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
          gap: '16px',
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
const Goals = () => (
  <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8 w-full">
    <h1 className="text-heading-lg font-bold text-text-primary mb-4">
      Objetivos
    </h1>
    <p className="text-text-secondary">Objetivos em construção</p>
  </div>
)

function App() {
  return (
    <FinanceProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.CARDS} element={<CardsView />} />
          <Route path={ROUTES.TRANSACTIONS} element={<TransactionsView />} />
          <Route path={ROUTES.GOALS} element={<Goals />} />
          <Route path={ROUTES.PROFILE} element={<ProfileView />} />
        </Route>
      </Routes>
    </FinanceProvider>
  )
}

export default App
