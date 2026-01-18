import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout'
import { ROUTES } from './constants'

// Placeholder pages - serão implementadas nos próximos prompts
const Dashboard = () => (
  <div className="p-8">
    <h1 className="text-heading-lg font-bold text-text-primary mb-4">
      Dashboard
    </h1>
    <p className="text-text-secondary">Dashboard em construção</p>
  </div>
)
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
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.CARDS} element={<Cards />} />
        <Route path={ROUTES.TRANSACTIONS} element={<Transactions />} />
        <Route path={ROUTES.GOALS} element={<Goals />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
