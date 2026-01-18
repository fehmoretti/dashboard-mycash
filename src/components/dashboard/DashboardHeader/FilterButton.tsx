import { useState, useRef, useEffect } from 'react'
import FilterPopover from './FilterPopover'

const FilterButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        buttonRef.current &&
        popoverRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const togglePopover = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative">
      {/* Botão circular com ícone de controles deslizantes */}
      <button
        ref={buttonRef}
        onClick={togglePopover}
        className="flex items-center justify-center rounded-full"
        style={{
          width: '2.5rem',
          height: '2.5rem',
          backgroundColor: 'var(--color-background-primary)',
          border: 'none',
          borderRadius: 'var(--border-radius-full)',
          cursor: 'pointer',
          transitionProperty: 'background-color',
          transitionDuration: '200ms',
        }}
        aria-label="Abrir filtros"
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
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>

      {/* FilterPopover (desktop) - aparece abaixo do botão */}
      {isOpen && (
        <div ref={popoverRef} className="hidden lg:block">
          <FilterPopover onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Modal (mobile) - TODO: implementar modal fullscreen que desliza de baixo */}
    </div>
  )
}

export default FilterButton
