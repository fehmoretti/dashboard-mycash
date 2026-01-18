import { useState } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { CreditCard } from '@/types'
import { formatCurrency } from '@/utils/format'
import AddAccountModal from '../AddAccountModal'
import CardDetailsModal from '../CardDetailsModal'

const CARDS_PER_PAGE = 3

interface CreditCardItemProps {
  card: CreditCard
  onClick: () => void
}

const CreditCardItem = ({ card, onClick }: CreditCardItemProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="rounded-card cursor-pointer relative"
      style={{
        backgroundColor: 'var(--color-background-primary)',
        padding: 'var(--spacing-container-padding)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-border)',
        borderRadius: 'var(--border-radius-card)',
        boxShadow: isHovered
          ? '0 8px 16px rgba(0, 0, 0, 0.1)'
          : '0 2px 4px rgba(0, 0, 0, 0.05)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transitionProperty: 'transform, box-shadow',
        transitionDuration: '250ms',
        transitionTimingFunction: 'ease-in-out',
        cursor: 'pointer',
      }}
    >
      {/* Número do cartão no canto superior direito */}
      <div
        style={{
          position: 'absolute',
          top: 'var(--spacing-md)',
          right: 'var(--spacing-md)',
          fontSize: 'var(--font-size-body-sm)',
          fontWeight: 'var(--font-weight-regular)',
          color: 'var(--color-text-secondary)',
        }}
      >
        •••• {card.lastDigits || '0000'}
      </div>
      {/* Zona 1: Ícone à esquerda */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--border-radius-card)',
          backgroundColor: 'var(--color-primary)',
          borderWidth: 'none',
          borderStyle: 'none',
          borderColor: 'transparent',
        }}
      >
        <svg
          className="w-6 h-6"
          style={{ color: 'var(--gray-900)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      </div>

      {/* Zona 2: Informações ao centro */}
      <div className="flex-1 flex flex-col" style={{ gap: 'var(--spacing-xs)' }}>
        {/* Nome do cartão/banco */}
        <p
          style={{
            fontSize: 'var(--font-size-body-sm)',
            fontWeight: 'var(--font-weight-regular)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {card.name}
        </p>

        {/* Valor da fatura atual */}
        <p
          style={{
            fontSize: 'var(--font-size-body-lg)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--gray-900)',
          }}
        >
          {formatCurrency(card.currentBill)}
        </p>

      </div>
    </div>
  )
}

const CreditCardsWidget = () => {
  const { creditCards } = useFinance()
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Calcular paginação
  const totalPages = Math.ceil(creditCards.length / CARDS_PER_PAGE)
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE
  const endIndex = startIndex + CARDS_PER_PAGE
  const currentCards = creditCards.slice(startIndex, endIndex)

  const handleAddCard = () => {
    setIsModalOpen(true)
  }

  const handleCardClick = (card: CreditCard) => {
    setSelectedCard(card)
    setIsDetailsModalOpen(true)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div
      className="rounded-card h-full flex flex-col w-full"
      style={{
        backgroundColor: '#FFFFFF',
        padding: 'var(--spacing-container-padding)',
        borderRadius: 'var(--border-radius-card)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-border)',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between mb-4"
        style={{
          marginBottom: 'var(--spacing-md)',
        }}
      >
        {/* Título com ícone */}
        <div className="flex items-center gap-2" style={{ gap: 'var(--spacing-sm)' }}>
          {/* Ícone de cartão de crédito */}
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
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <h3
            style={{
              fontSize: 'var(--font-size-body-lg)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
            }}
          >
            Cartões
          </h3>
        </div>

        {/* Botão de adicionar cartão */}
        <button
          onClick={handleAddCard}
          className="flex items-center justify-center rounded-full"
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--color-background-primary)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--color-border)',
            borderRadius: 'var(--border-radius-full)',
            cursor: 'pointer',
            transitionProperty: 'background-color',
            transitionDuration: '200ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--gray-200)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-background-primary)'
          }}
          aria-label="Adicionar cartão"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Lista de cartões */}
      <div className="flex-1 flex flex-col" style={{ gap: 'var(--spacing-md)' }}>
        {currentCards.map((card) => (
          <CreditCardItem
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>

      {/* Paginação (só aparece se houver mais de 3 cartões) */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between mt-4"
          style={{
            marginTop: 'var(--spacing-md)',
            paddingTop: 'var(--spacing-md)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          {/* Botão anterior */}
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="flex items-center justify-center rounded-full"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: currentPage === 1 ? 'var(--gray-200)' : 'var(--color-background-primary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--border-radius-full)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transitionProperty: 'background-color',
              transitionDuration: '200ms',
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (currentPage > 1) {
                e.currentTarget.style.backgroundColor = 'var(--gray-200)'
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage > 1) {
                e.currentTarget.style.backgroundColor = 'var(--color-background-primary)'
              }
            }}
            aria-label="Página anterior"
          >
            <svg
              className="w-4 h-4"
              style={{ color: 'var(--gray-900)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Indicador de página */}
          <span
            style={{
              fontSize: 'var(--font-size-body-sm)',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {currentPage} / {totalPages}
          </span>

          {/* Botão próximo */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center rounded-full"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: currentPage === totalPages ? 'var(--gray-200)' : 'var(--color-background-primary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--border-radius-full)',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transitionProperty: 'background-color',
              transitionDuration: '200ms',
              opacity: currentPage === totalPages ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (currentPage < totalPages) {
                e.currentTarget.style.backgroundColor = 'var(--gray-200)'
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage < totalPages) {
                e.currentTarget.style.backgroundColor = 'var(--color-background-primary)'
              }
            }}
            aria-label="Próxima página"
          >
            <svg
              className="w-4 h-4"
              style={{ color: 'var(--gray-900)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}

      <AddAccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <CardDetailsModal
        isOpen={isDetailsModalOpen}
        card={selectedCard}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedCard(null)
        }}
      />
    </div>
  )
}

export default CreditCardsWidget
