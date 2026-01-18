import { useState } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { CreditCard } from '@/types'
import { formatCurrency } from '@/utils/format'

const CARDS_PER_PAGE = 3

// Função para obter cores do tema do cartão
const getThemeColors = (theme: 'black' | 'lime' | 'white') => {
  switch (theme) {
    case 'black':
      return {
        background: 'var(--gray-900)',
        iconColor: 'var(--gray-0)',
        badgeBackground: 'var(--gray-900)',
        badgeColor: 'var(--gray-0)',
      }
    case 'lime':
      return {
        background: 'var(--color-primary)',
        iconColor: 'var(--gray-900)',
        badgeBackground: 'var(--color-primary)',
        badgeColor: 'var(--gray-900)',
      }
    case 'white':
      return {
        background: 'var(--color-background-primary)',
        iconColor: 'var(--gray-900)',
        badgeBackground: 'var(--gray-900)',
        badgeColor: 'var(--gray-0)',
        border: '1px solid var(--color-border)',
      }
    default:
      return {
        background: 'var(--gray-900)',
        iconColor: 'var(--gray-0)',
        badgeBackground: 'var(--gray-900)',
        badgeColor: 'var(--gray-0)',
      }
  }
}

interface CreditCardItemProps {
  card: CreditCard
  onClick: () => void
}

const CreditCardItem = ({ card, onClick }: CreditCardItemProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const themeColors = getThemeColors(card.theme)

  // Calcular percentual de uso
  const usagePercentage = card.limit > 0 
    ? Math.round((card.currentBill / card.limit) * 100)
    : 0

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="rounded-card cursor-pointer"
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
      {/* Zona 1: Ícone à esquerda */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--border-radius-card)',
          backgroundColor: themeColors.background,
          borderWidth: themeColors.border ? '1px' : 'none',
          borderStyle: themeColors.border ? 'solid' : 'none',
          borderColor: themeColors.border || 'transparent',
        }}
      >
        <svg
          className="w-6 h-6"
          style={{ color: themeColors.iconColor }}
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

        {/* Últimos dígitos mascarados */}
        <p
          style={{
            fontSize: 'var(--font-size-body-sm)',
            fontWeight: 'var(--font-weight-regular)',
            color: 'var(--color-text-secondary)',
          }}
        >
          •••• {card.lastDigits || '0000'}
        </p>
      </div>

      {/* Zona 3: Indicador de uso à direita */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          minWidth: '48px',
          height: '32px',
          paddingLeft: 'var(--spacing-sm)',
          paddingRight: 'var(--spacing-sm)',
          borderRadius: 'var(--border-radius-full)',
          backgroundColor: themeColors.badgeBackground,
          color: themeColors.badgeColor,
          fontSize: 'var(--font-size-body-sm)',
          fontWeight: 'var(--font-weight-bold)',
        }}
      >
        {usagePercentage}%
      </div>
    </div>
  )
}

const CreditCardsWidget = () => {
  const { creditCards } = useFinance()
  const [currentPage, setCurrentPage] = useState(1)

  // Calcular paginação
  const totalPages = Math.ceil(creditCards.length / CARDS_PER_PAGE)
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE
  const endIndex = startIndex + CARDS_PER_PAGE
  const currentCards = creditCards.slice(startIndex, endIndex)

  const handleAddCard = () => {
    // TODO: Abrir modal de criação de cartão
    console.log('Abrir modal de criação de cartão')
  }

  const handleCardClick = (card: CreditCard) => {
    // TODO: Abrir modal de detalhes do cartão
    console.log('Abrir modal de detalhes do cartão:', card.id)
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
      className="rounded-card h-full flex flex-col"
      style={{
        backgroundColor: 'var(--gray-100)',
        padding: 'var(--spacing-container-padding)',
        borderRadius: 'var(--border-radius-card)',
        height: '100%',
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
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 'var(--spacing-md)',
          flex: 1,
        }}
      >
        {currentCards.map((card) => (
          <CreditCardItem
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>

      {/* Paginação (só aparece se houver mais de 3 cartões) */}
      {creditCards.length > CARDS_PER_PAGE && (
        <div
          className="flex items-center justify-center gap-2 mt-4"
          style={{
            marginTop: 'var(--spacing-md)',
            gap: 'var(--spacing-sm)',
          }}
        >
          {/* Botão Anterior */}
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
              color: 'var(--gray-900)',
              minWidth: '60px',
              textAlign: 'center',
            }}
          >
            {currentPage} / {totalPages}
          </span>

          {/* Botão Próxima */}
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
    </div>
  )
}

export default CreditCardsWidget
