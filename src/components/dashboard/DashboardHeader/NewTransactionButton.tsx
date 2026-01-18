import { useState } from 'react'
import NewTransactionModal from '../NewTransactionModal'

const NewTransactionButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = () => {
    setIsModalOpen(true)
  }

  return (
    <>
    <button
      onClick={handleClick}
      className="flex items-center justify-center rounded-full font-bold lg:w-auto w-full"
      style={{
        paddingTop: '12px', // Padding vertical
        paddingBottom: '12px', // Padding vertical
        paddingLeft: '16px', // Padding horizontal
        paddingRight: '16px', // Padding horizontal
        gap: '8px', // Gap entre ícone e texto
        backgroundColor: 'var(--gray-900)', // Preto normal
        color: 'var(--gray-0)',
        fontSize: 'var(--font-size-body-md)',
        fontWeight: 'var(--font-weight-bold)',
        borderRadius: '100px', // Pill shape
        cursor: 'pointer',
        transitionProperty: 'background-color',
        transitionDuration: '200ms',
        minWidth: 'auto',
      }}
      onMouseEnter={(e) => {
        // Hover: azul-cinza escuro (#4b5563 ou similar)
        e.currentTarget.style.backgroundColor = '#4b5563'
      }}
      onMouseLeave={(e) => {
        // Normal: preto (#1f2937 ou var(--gray-900))
        e.currentTarget.style.backgroundColor = 'var(--gray-900)'
      }}
      aria-label="Nova Transação"
    >
      {/* Ícone "+" */}
      <svg
        className="w-5 h-5"
        style={{ color: 'var(--gray-0)' }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span className="hidden lg:inline">Nova transação</span>
    </button>
      <NewTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default NewTransactionButton
