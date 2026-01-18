import { useLocation } from 'react-router-dom'
import { useSidebar } from '@/hooks/useSidebar'
import Sidebar from '../Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  const location = useLocation()
  const { isExpanded } = useSidebar()

  return (
    <div className="flex min-h-screen bg-background-primary">
      {/* Sidebar - apenas no desktop (≥1280px) */}
      <div className="hidden lg:block">
        <Sidebar currentPath={location.pathname} />
      </div>

      {/* Conteúdo Principal */}
      <main
        className={`
          flex-1 transition-all duration-300 ease-in-out
          ${isExpanded ? 'lg:ml-64' : 'lg:ml-20'}
        `}
      >
        <div className="w-full h-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainLayout
