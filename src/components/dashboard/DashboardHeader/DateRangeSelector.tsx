import { useState, useRef, useEffect } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { DateRange } from '@/types'
import DatePickerCalendar from './DatePickerCalendar'

// Função para formatar período como "01 Jan - 31 Jan 2026"
const formatDateRange = (range: DateRange | null): string => {
  if (!range) {
    // Se não houver filtro, mostrar período atual do mês
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0')
      const month = date.toLocaleDateString('pt-BR', { month: 'short' })
      return `${day} ${month}`
    }
    
    const year = now.getFullYear()
    return `${formatDate(firstDay)} - ${formatDate(lastDay)} ${year}`
  }

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = date.toLocaleDateString('pt-BR', { month: 'short' })
    return `${day} ${month}`
  }

  const startYear = range.startDate.getFullYear()
  const endYear = range.endDate.getFullYear()
  
  // Se ambos são do mesmo ano, mostrar apenas no final
  if (startYear === endYear) {
    return `${formatDate(range.startDate)} - ${formatDate(range.endDate)} ${startYear}`
  }
  
  // Se anos diferentes, mostrar ambos
  return `${formatDate(range.startDate)} ${startYear} - ${formatDate(range.endDate)} ${endYear}`
}

const DateRangeSelector = () => {
  const { dateRange, setDateRange } = useFinance()
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])


  return (
    <div className="relative">
      {/* Botão que mostra o período atual */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center"
        style={{
          paddingTop: '12px', // Padding vertical
          paddingBottom: '12px', // Padding vertical
          paddingLeft: 'calc(24px + 20px + 8px)', // Padding horizontal + largura ícone (w-5 = 20px) + gap de 8px
          paddingRight: '24px', // Padding horizontal
          backgroundColor: 'var(--color-background-primary)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--color-border)',
          borderRadius: '100px', // Corner radius
          cursor: 'pointer',
          transitionProperty: 'background-color',
          transitionDuration: '200ms',
        }}
        aria-label="Selecionar período"
      >
        {/* Ícone de calendário */}
        <div
          className="absolute left-0 flex items-center justify-center"
          style={{
            left: '24px', // Padding horizontal do input
            pointerEvents: 'none',
          }}
        >
          <svg
            className="w-5 h-5"
            style={{ color: 'var(--color-text-secondary)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Texto formatado do período */}
        <span
          className="whitespace-nowrap"
          style={{
            fontSize: 'var(--font-size-body-md)',
            fontWeight: 'var(--font-weight-regular)',
            color: 'var(--gray-900)',
          }}
        >
          {formatDateRange(dateRange)}
        </span>
      </button>

      {/* Calendário completo */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 z-50">
          <DatePickerCalendar
            dateRange={dateRange}
            onSelect={(range) => {
              setDateRange(range)
            }}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  )
}

export default DateRangeSelector
