import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { UserIcon } from '../Sidebar/Icons'
import MenuDropdown from './MenuDropdown'

const HeaderMobile = () => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          height: '4rem', // 64px
          paddingLeft: 'var(--spacing-container-padding)',
          paddingRight: 'var(--spacing-container-padding)',
          backgroundColor: 'var(--color-background-primary)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--color-border)',
        }}
      >
        {/* Logo */}
        <h1
          className="font-bold whitespace-nowrap"
          style={{
            fontSize: 'var(--font-size-heading-md)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--gray-900)',
          }}
        >
          mycash+
        </h1>

        {/* Avatar clicável */}
        <button
          onClick={toggleMenu}
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 'var(--spacing-xl)',
            height: 'var(--spacing-xl)',
            borderRadius: 'var(--border-radius-avatar)',
            backgroundColor: 'var(--color-primary)',
            cursor: 'pointer',
          }}
          aria-label="Abrir menu"
        >
          <UserIcon
            className="w-6 h-6"
            style={{ color: 'var(--gray-900)' }}
          />
        </button>
      </header>

      {/* Menu Dropdown */}
      {isMenuOpen && (
        <MenuDropdown
          currentPath={location.pathname}
          onClose={closeMenu}
        />
      )}
    </>
  )
}

export default HeaderMobile
