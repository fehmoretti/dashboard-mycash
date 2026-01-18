import { useLocation } from 'react-router-dom'
import { useSidebar } from '@/hooks/useSidebar'
import Sidebar from '../Sidebar/Sidebar'
import { HeaderMobile } from '../HeaderMobile'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  const location = useLocation()
  const { isExpanded } = useSidebar()

  return (
    <div 
      className="flex min-h-screen"
      style={{ backgroundColor: '#F5F6F8' }}
    >
      {/* HeaderMobile - apenas no mobile/tablet (<1280px) */}
      <div className="block lg:hidden">
        <HeaderMobile />
      </div>

      {/* Sidebar - apenas no desktop (≥1280px) */}
      <div className="hidden lg:block">
        <Sidebar currentPath={location.pathname} />
      </div>

      {/* Conteúdo Principal */}
      <main
        className="transition-all duration-300 ease-in-out pt-16 lg:pt-0"
        style={{
          flex: 1,
          minWidth: 0, // Permite que flex-1 funcione corretamente
          marginLeft: isExpanded ? '16rem' : '5rem', // 16rem = 256px (expanded), 5rem = 80px (collapsed)
          width: isExpanded ? 'calc(100% - 16rem)' : 'calc(100% - 5rem)', // Largura dinâmica baseada na sidebar
        }}
      >
        <div className="w-full h-full" style={{ width: '100%', minWidth: 0 }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainLayout
