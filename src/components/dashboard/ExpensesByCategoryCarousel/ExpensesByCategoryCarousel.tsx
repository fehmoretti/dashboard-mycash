import { useState, useRef, useEffect } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import CategoryDonutCard from '../CategoryDonutCard/CategoryDonutCard'

// Array de cores rotativas para os donuts
const COLORS = [
  'var(--color-primary)', // Verde-limão
  'var(--gray-900)', // Preto
  'var(--color-text-secondary)', // Cinza médio
]

const ExpensesByCategoryCarousel = () => {
  const { calculateExpensesByCategory } = useFinance()
  const categoryExpenses = calculateExpensesByCategory()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Verificar se há scroll disponível
  const checkScrollButtons = () => {
    if (!carouselRef.current) return

    const { scrollLeft: currentScroll, scrollWidth, clientWidth } = carouselRef.current
    setShowLeftArrow(currentScroll > 0)
    setShowRightArrow(currentScroll < scrollWidth - clientWidth - 1)
  }

  useEffect(() => {
    checkScrollButtons()
    const carousel = carouselRef.current
    if (!carousel) return

    const handleScroll = () => {
      checkScrollButtons()
    }

    carousel.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', checkScrollButtons)

    return () => {
      carousel.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkScrollButtons)
    }
  }, [categoryExpenses])

  // Scroll com mouse wheel (horizontal)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return
    e.preventDefault()
    carouselRef.current.scrollLeft += e.deltaY
  }

  // Drag to scroll
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2 // Velocidade do scroll
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  // Navegação com setas
  const scrollLeftHandler = () => {
    if (!carouselRef.current) return
    carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' })
  }

  const scrollRightHandler = () => {
    if (!carouselRef.current) return
    carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' })
  }

  if (categoryExpenses.length === 0) {
    return null
  }

  return (
    <div
      className="relative"
      style={{
        marginBottom: 'var(--spacing-card-gap)',
        width: '100%',
        overflow: 'hidden', // Esconde cards que não cabem
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        setIsDragging(false)
      }}
    >
      {/* Gradiente de máscara na borda esquerda (só aparece se houver scroll) */}
      {showLeftArrow && (
        <div
          className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
          style={{
            width: '48px',
            background: 'linear-gradient(to right, var(--color-background-primary), transparent)',
          }}
        />
      )}

      {/* Carrossel */}
      <div
        ref={carouselRef}
        className="flex scrollbar-hide"
        style={{
          gap: 'var(--spacing-card-gap)',
          width: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
          cursor: isDragging ? 'grabbing' : 'grab',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {categoryExpenses.map((categoryExpense, index) => (
          <div 
            key={categoryExpense.category} 
            style={{ 
              flex: '1 1 0', // Ocupa espaço igual (fill)
              minWidth: '160px', // Largura mínima
              maxWidth: '100%',
            }}
          >
            <CategoryDonutCard
              categoryExpense={categoryExpense}
              color={COLORS[index % COLORS.length]}
            />
          </div>
        ))}
      </div>

      {/* Gradiente de máscara na borda direita (só aparece se houver scroll) */}
      {showRightArrow && (
        <div
          className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
          style={{
            width: '48px',
            background: 'linear-gradient(to left, var(--color-background-primary), transparent)',
          }}
        />
      )}

      {/* Setas de navegação (desktop only) */}
      {isHovering && (
        <>
          {showLeftArrow && (
            <button
              onClick={scrollLeftHandler}
              className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center rounded-full shadow-lg"
              style={{
                width: '2.5rem',
                height: '2.5rem',
                backgroundColor: 'var(--color-background-primary)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              aria-label="Rolar para esquerda"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {showRightArrow && (
            <button
              onClick={scrollRightHandler}
              className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 items-center justify-center rounded-full shadow-lg"
              style={{
                width: '2.5rem',
                height: '2.5rem',
                backgroundColor: 'var(--color-background-primary)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              aria-label="Rolar para direita"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default ExpensesByCategoryCarousel
