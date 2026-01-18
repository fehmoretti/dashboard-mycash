import { NavLink, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants'
import {
  HomeIcon,
  CreditCardIcon,
} from '../Sidebar/Icons'

interface MenuDropdownProps {
  currentPath: string
  onClose: () => void
}

// Itens de navegação (mesmos da sidebar)
const navigationItems = [
  { path: ROUTES.DASHBOARD, label: 'Home', icon: HomeIcon },
  { path: ROUTES.CARDS, label: 'Cartões', icon: CreditCardIcon },
]

const MenuDropdown = ({ currentPath, onClose }: MenuDropdownProps) => {
  const navigate = useNavigate()

  const handleNavigationClick = (path: string) => {
    navigate(path)
    onClose()
  }

  const handleLogout = () => {
    // TODO: Implementar lógica de logout
    console.log('Logout')
    onClose()
  }

  return (
    <>
      {/* Overlay escuro semi-transparente */}
      <div
        className="fixed inset-0 z-40"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Dropdown */}
      <div
        className="fixed left-0 right-0 z-50 rounded-b-lg"
        style={{
          top: '4rem', // 64px - altura do header
          backgroundColor: 'var(--color-background-primary)',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'var(--color-border)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          animation: 'slideDown 0.3s ease-out',
          maxHeight: 'calc(100vh - 4rem)',
          overflowY: 'auto',
        }}
      >
        {/* Header do Menu com botão X */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: 'var(--spacing-container-padding)',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'var(--color-border)',
          }}
        >
          <span
            className="font-medium"
            style={{
              fontSize: 'var(--font-size-body-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
            }}
          >
            Menu
          </span>
          <button
            onClick={onClose}
            className="flex items-center justify-center"
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: 'var(--border-radius-md)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transitionProperty: 'background-color',
              transitionDuration: '200ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--gray-100)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            aria-label="Fechar menu"
          >
            <svg
              className="w-5 h-5"
              style={{ color: 'var(--gray-900)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Lista de navegação */}
        <nav
          style={{
            padding: 'var(--spacing-sm)',
          }}
        >
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.path

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => handleNavigationClick(item.path)}
                className="flex items-center rounded-button"
                style={{
                  padding: 'var(--spacing-input-padding)',
                  borderRadius: 'var(--border-radius-button)',
                  marginBottom: 'var(--spacing-xs)',
                  transitionProperty: 'all',
                  transitionDuration: '200ms',
                  transitionTimingFunction: 'ease-in-out',
                  gap: 'var(--spacing-md)',
                  backgroundColor: isActive
                    ? 'var(--gray-900)'
                    : 'transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--gray-100)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <Icon
                  className="flex-shrink-0 w-6 h-6 transition-colors duration-200"
                  style={{
                    color: isActive
                      ? 'var(--color-primary)'
                      : 'var(--gray-900)',
                  }}
                />
                <span
                  className="font-medium whitespace-nowrap"
                  style={{
                    fontSize: 'var(--font-size-body-md)',
                    fontWeight: 'var(--font-weight-regular)',
                    color: isActive
                      ? 'var(--color-primary)'
                      : 'var(--gray-900)',
                  }}
                >
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </nav>

        {/* Botão Sair */}
        <div
          style={{
            padding: 'var(--spacing-container-padding)',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'var(--color-border)',
          }}
        >
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full rounded-button"
            style={{
              padding: 'var(--spacing-input-padding)',
              borderRadius: 'var(--border-radius-button)',
              backgroundColor: 'var(--color-danger)',
              color: 'var(--gray-0)',
              fontSize: 'var(--font-size-body-md)',
              fontWeight: 'var(--font-weight-bold)',
              cursor: 'pointer',
              transitionProperty: 'background-color',
              transitionDuration: '200ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626' // red-600 (mais escuro que danger)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-danger)'
            }}
          >
            Sair
          </button>
        </div>
      </div>
    </>
  )
}

export default MenuDropdown
