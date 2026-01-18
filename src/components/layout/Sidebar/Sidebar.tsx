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
      className="fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out"
      style={{
        width: isExpanded ? '16rem' : '5rem', // w-64 = 256px = 16rem, w-20 = 80px = 5rem
        backgroundColor: '#FFFFFF',
        borderRightWidth: '1px',
        borderRightStyle: 'solid',
        borderRightColor: 'var(--color-border)',
      }}
    >
      {/* Header com Logo */}
      <div 
        className="flex items-center justify-between"
        style={{ 
          padding: isExpanded ? 'var(--spacing-container-padding)' : 'var(--spacing-container-padding)',
          justifyContent: isExpanded ? 'space-between' : 'center',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--color-border)',
        }}
      >
        <div 
          className="flex items-center overflow-hidden"
          style={{ 
            gap: 'var(--spacing-md)',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            width: isExpanded ? 'auto' : '100%',
          }}
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
            <div className="flex flex-col items-start">
              <h1 
                className="font-bold whitespace-nowrap leading-none"
                style={{ 
                  fontSize: 'var(--font-size-heading-lg)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                }}
              >
                My
              </h1>
              {/* Linha horizontal com parte vertical (L-shaped) */}
              <div className="relative" style={{ marginTop: '4px' }}>
                <div 
                  style={{
                    width: '3rem',
                    height: '2px',
                    backgroundColor: 'var(--gray-900)',
                    position: 'relative',
                  }}
                />
                {/* Parte vertical da linha */}
                <div 
                  style={{
                    width: '2px',
                    height: '1rem',
                    backgroundColor: 'var(--gray-900)',
                    position: 'absolute',
                    right: '0',
                    top: '0',
                  }}
                />
              </div>
              {/* cash+ abaixo e indentado */}
              <span
                className="font-bold whitespace-nowrap"
                style={{
                  fontSize: 'var(--font-size-body-md)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                  marginTop: '4px',
                  marginLeft: '0.5rem',
                }}
              >
                cash+
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Botão Toggle - posicionado na borda direita */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-16 flex items-center justify-center shadow-sm z-50"
        style={{
          width: 'var(--spacing-lg)',
          height: 'var(--spacing-lg)',
          borderRadius: 'var(--border-radius-full)',
          backgroundColor: 'var(--color-background-primary)',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: 'var(--color-border)',
          transitionProperty: 'background-color',
          transitionDuration: '200ms',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--gray-50)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-background-primary)'
        }}
        aria-label={isExpanded ? 'Colapsar sidebar' : 'Expandir sidebar'}
      >
        {isExpanded ? (
          <ChevronLeftIcon 
            className="w-2 h-2" 
            style={{ color: 'var(--color-text-secondary)' }}
          />
        ) : (
          <ChevronRightIcon 
            className="w-2 h-2" 
            style={{ color: 'var(--color-text-secondary)' }}
          />
        )}
      </button>

      {/* Navegação */}
      <nav 
        className="flex-1"
        style={{ 
          padding: isExpanded ? 'var(--spacing-container-padding)' : 'var(--spacing-sm)',
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
                  onMouseEnter={(e) => {
                    handleMouseEnter(item.path)
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--gray-100)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    handleMouseLeave()
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                  className="flex items-center group relative transition-all ease-in-out"
                  style={{
                    padding: isExpanded ? 'var(--spacing-input-padding)' : 'var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-button)',
                    transitionProperty: 'all',
                    transitionDuration: '200ms',
                    transitionTimingFunction: 'ease-in-out',
                    gap: isExpanded ? 'var(--spacing-md)' : '0',
                    width: isExpanded ? '100%' : '100%',
                    justifyContent: isExpanded ? 'flex-start' : 'center',
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
        className={`${isExpanded ? 'flex items-center' : 'flex flex-col items-center'}`}
        style={{
          padding: isExpanded ? 'var(--spacing-container-padding)' : 'var(--spacing-sm)',
          gap: isExpanded ? 'var(--spacing-md)' : '0',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'var(--color-border)',
        }}
      >
        <div 
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 'var(--spacing-xl)',
            height: 'var(--spacing-xl)',
            borderRadius: 'var(--border-radius-avatar)',
            backgroundColor: 'var(--color-primary)',
          }}
        >
          <UserIcon 
            className="w-6 h-6" 
            style={{ color: 'var(--gray-900)' }}
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
              className="truncate"
              style={{
                fontSize: 'var(--font-size-body-sm)',
                color: 'var(--color-text-secondary)',
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
