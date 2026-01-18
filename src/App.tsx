import { Routes, Route } from 'react-router-dom'
import { ROUTES } from './constants'

// Placeholder pages - serão implementadas nos próximos prompts
const Dashboard = () => <div className="p-4">Dashboard - Em construção</div>
const Cards = () => <div className="p-4">Cartões - Em construção</div>
const Transactions = () => <div className="p-4">Transações - Em construção</div>
const Goals = () => <div className="p-4">Objetivos - Em construção</div>
const Profile = () => <div className="p-4">Perfil - Em construção</div>

function App() {
  return (
    <Routes>
      <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
      <Route path={ROUTES.CARDS} element={<Cards />} />
      <Route path={ROUTES.TRANSACTIONS} element={<Transactions />} />
      <Route path={ROUTES.GOALS} element={<Goals />} />
      <Route path={ROUTES.PROFILE} element={<Profile />} />
    </Routes>
  )
}

export default App
