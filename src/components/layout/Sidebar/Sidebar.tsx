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
      }, 300) // Delay de 300ms conforme padrão de tooltip
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
      <div 
        className="flex items-center justify-between border-b border-border"
        style={{ padding: 'var(--spacing-container-padding)' }}
      >
        <div 
          className="flex items-center overflow-hidden"
          style={{ gap: 'var(--spacing-md)' }}
        >
          {isExpanded ? (
            <h1 
              className="font-bold whitespace-nowrap"
              style={{ 
                fontSize: 'var(--font-size-heading-lg)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--gray-900)',
              }}
            >
              mycash+
            </h1>
          ) : (
            <div 
              className="bg-primary rounded-md flex items-center justify-center"
              style={{ 
                width: 'var(--spacing-xl)',
                height: 'var(--spacing-xl)',
                borderRadius: 'var(--border-radius-md)',
              }}
            >
              <span 
                className="font-bold"
                style={{ 
                  fontSize: 'var(--font-size-body-sm)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-0)',
                }}
              >
                m+
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Botão Toggle - posicionado na borda direita */}
      <button
        onClick={toggle}
        className={`
          absolute -right-3 top-16
          rounded-full
          bg-background-primary border-2 border-border
          flex items-center justify-center
          hover:bg-gray-50
          shadow-sm z-50
        `}
        style={{
          width: 'var(--spacing-lg)',
          height: 'var(--spacing-lg)',
          borderRadius: 'var(--border-radius-full)',
          transitionProperty: 'background-color',
          transitionDuration: '200ms',
        }}
        aria-label={isExpanded ? 'Colapsar sidebar' : 'Expandir sidebar'}
      >
        {isExpanded ? (
          <ChevronLeftIcon className="w-2 h-2 text-text-secondary" />
        ) : (
          <ChevronRightIcon className="w-2 h-2 text-text-secondary" />
        )}
      </button>

      {/* Navegação */}
      <nav 
        className="flex-1"
        style={{ 
          padding: 'var(--spacing-container-padding)',
        }}
      >
        <div 
          className="flex flex-col"
          style={{ gap: 'var(--spacing-sm)' }}
        >
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
                    flex items-center rounded-button
                    group relative
                    ${isExpanded ? 'w-full' : 'w-12 justify-center'}
                    ${!isActive ? 'hover:bg-gray-100' : ''}
                  `}
                  style={{
                    padding: 'var(--spacing-input-padding)',
                    borderRadius: 'var(--border-radius-button)',
                    transitionProperty: 'all',
                    transitionDuration: '200ms',
                    transitionTimingFunction: 'ease-in-out',
                    gap: 'var(--spacing-md)',
                    backgroundColor: isActive 
                      ? 'var(--color-primary)' 
                      : 'transparent',
                  }}
                >
                  <Icon
                    className="flex-shrink-0 w-6 h-6 transition-colors duration-200"
                    style={{
                      color: 'var(--gray-900)',
                    }}
                  />
                  {isExpanded && (
                    <span
                      className="font-medium whitespace-nowrap"
                      style={{
                        fontSize: 'var(--font-size-body-md)',
                        fontWeight: 'var(--font-weight-regular)',
                        color: 'var(--gray-900)',
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                </NavLink>

                {/* Tooltip - aparece quando sidebar está colapsada */}
                {!isExpanded && tooltipItem === item.path && (
                  <div
                    className="absolute left-full top-1/2 -translate-y-1/2 rounded-md whitespace-nowrap z-50 pointer-events-none animate-in fade-in slide-in-from-left-2"
                    style={{
                      marginLeft: 'var(--spacing-sm)',
                      backgroundColor: 'var(--gray-900)',
                      color: 'var(--gray-0)',
                      fontSize: 'var(--font-size-body-sm)',
                      paddingTop: 'var(--spacing-xs)',
                      paddingBottom: 'var(--spacing-xs)',
                      paddingLeft: 'var(--spacing-sm)',
                      paddingRight: 'var(--spacing-sm)',
                      borderRadius: 'var(--border-radius-md)',
                    }}
                  >
                    {item.label}
                    <div 
                      className="absolute right-full top-1/2 -translate-y-1/2"
                      style={{
                        borderWidth: 'var(--spacing-xs)',
                        borderStyle: 'solid',
                        borderColor: 'transparent',
                        borderRightColor: 'var(--gray-900)',
                      }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Perfil do Usuário */}
      <div
        className={`border-t border-border ${isExpanded ? 'flex items-center' : 'flex flex-col items-center'}`}
        style={{
          padding: 'var(--spacing-container-padding)',
          gap: 'var(--spacing-md)',
        }}
      >
        <div 
          className="rounded-avatar bg-primary flex items-center justify-center flex-shrink-0"
          style={{
            width: 'var(--spacing-xl)',
            height: 'var(--spacing-xl)',
            borderRadius: 'var(--border-radius-avatar)',
          }}
        >
          <UserIcon 
            className="w-6 h-6" 
            style={{ color: 'var(--gray-0)' }}
          />
        </div>
        {isExpanded && (
          <div className="flex-1 min-w-0">
            <p 
              className="font-medium truncate"
              style={{
                fontSize: 'var(--font-size-body-md)',
                fontWeight: 'var(--font-weight-regular)',
                color: 'var(--gray-900)',
              }}
            >
              Lucas Marte
            </p>
            <p 
              className="text-text-secondary truncate"
              style={{
                fontSize: 'var(--font-size-body-sm)',
              }}
            >
              lucasmarte@gmail.com
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
