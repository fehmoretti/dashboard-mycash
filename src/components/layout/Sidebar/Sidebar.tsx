import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { useSidebar } from '@/hooks/useSidebar'
import { 
  HomeIcon, 
  CreditCardIcon, 
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from './Icons'

interface SidebarProps {
  currentPath: string
}

// Itens de navegação conforme design do Figma
const navigationItems = [
  { path: ROUTES.DASHBOARD, label: 'Home', icon: HomeIcon },
  { path: ROUTES.CARDS, label: 'Cartões', icon: CreditCardIcon },
]

const Sidebar = ({ currentPath }: SidebarProps) => {
  const { isExpanded, toggle } = useSidebar()
  const [tooltipItem, setTooltipItem] = useState<string | null>(null)
  const [tooltipTimeout, setTooltipTimeout] = useState<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = (path: string) => {
    if (!isExpanded) {
      const timeout = setTimeout(() => {
        setTooltipItem(path)
      }, 300) // Delay de 300ms
      setTooltipTimeout(timeout)
    }
  }

  const handleMouseLeave = () => {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout)
      setTooltipTimeout(null)
    }
    setTooltipItem(null)
  }

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen z-40
        bg-background-secondary
        border-r border-border
        transition-all duration-300 ease-in-out
        flex flex-col
        ${isExpanded ? 'w-64' : 'w-20'}
      `}
    >
      {/* Header com Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3 overflow-hidden">
          {isExpanded ? (
            <h1 className="text-heading-lg font-bold text-text-primary whitespace-nowrap">
              mycash+
            </h1>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">m+</span>
            </div>
          )}
        </div>
      </div>

      {/* Botão Toggle */}
      <button
        onClick={toggle}
        className={`
          absolute -right-3 top-16
          w-6 h-6 rounded-full
          bg-background-primary border-2 border-border
          flex items-center justify-center
          hover:bg-gray-50 transition-colors duration-200
          shadow-sm z-50
        `}
        aria-label={isExpanded ? 'Colapsar sidebar' : 'Expandir sidebar'}
      >
        {isExpanded ? (
          <ChevronLeftIcon className="w-4 h-4 text-text-secondary" />
        ) : (
          <ChevronRightIcon className="w-4 h-4 text-text-secondary" />
        )}
      </button>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.path

          return (
            <div key={item.path} className="relative">
              <NavLink
                to={item.path}
                onMouseEnter={() => handleMouseEnter(item.path)}
                onMouseLeave={handleMouseLeave}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-button
                  transition-all duration-200 ease-in-out
                  group relative
                  ${isExpanded ? 'w-full' : 'w-12 justify-center'}
                  ${
                    isActive
                      ? 'bg-text-primary text-white'
                      : 'text-text-secondary hover:bg-gray-100'
                  }
                `}
              >
                <Icon
                  className={`
                    flex-shrink-0 transition-colors duration-200
                    ${isActive ? 'text-primary' : 'text-current'}
                    ${!isExpanded && !isActive ? 'text-text-secondary' : ''}
                  `}
                />
                {isExpanded && (
                  <span className="text-body-md font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </NavLink>

              {/* Tooltip */}
              {!isExpanded && tooltipItem === item.path && (
                <div
                  className="
                    absolute left-full ml-2 top-1/2 -translate-y-1/2
                    bg-gray-900 text-white text-body-sm px-2 py-1.5 rounded-md
                    whitespace-nowrap z-50 pointer-events-none
                    animate-in fade-in slide-in-from-left-2 duration-200
                  "
                >
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Perfil do Usuário */}
      <div
        className={`
          p-4 border-t border-border
          ${isExpanded ? 'flex items-center gap-3' : 'flex flex-col items-center'}
        `}
      >
        <div className="w-10 h-10 rounded-avatar bg-primary flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
        {isExpanded && (
          <div className="flex-1 min-w-0">
            <p className="text-body-md font-medium text-text-primary truncate">
              Lucas Marte
            </p>
            <p className="text-body-sm text-text-secondary truncate">
              lucasmarte@gmail.com
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
