import { useState, useMemo } from 'react'
import { DateRange } from '@/types'

interface DatePickerCalendarProps {
  dateRange: DateRange | null
  onSelect: (range: DateRange | null) => void
  onClose: () => void
}

// Função para formatar data como "Mon, Aug 17"
const formatSelectedDate = (date: Date | null): string => {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

const DatePickerCalendar = ({ dateRange, onSelect, onClose }: DatePickerCalendarProps) => {
  const now = new Date()
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [startDate, setStartDate] = useState<Date | null>(dateRange?.startDate || null)
  const [endDate, setEndDate] = useState<Date | null>(dateRange?.endDate || null)

  // Dias da semana abreviados
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  // Gerar dias do calendário para o mês atual
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Adicionar dias vazios no início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Adicionar dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day))
    }

    return days
  }, [currentMonth, currentYear])

  // Nome do mês formatado
  const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
    .format(new Date(currentYear, currentMonth))
    .split(' ')
    .map((word, idx) => idx === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word)
    .join(' ')

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      // Primeira seleção ou reset
      setStartDate(date)
      setEndDate(null)
    } else if (startDate && !endDate) {
      // Segunda seleção
      if (date < startDate) {
        // Se a data selecionada for anterior, trocar
        setEndDate(startDate)
        setStartDate(date)
      } else {
        setEndDate(date)
      }
    }
  }

  const handleClear = () => {
    setStartDate(null)
    setEndDate(null)
    onSelect(null)
  }

  const handleOK = () => {
    if (startDate && endDate) {
      onSelect({ startDate, endDate })
    } else if (startDate) {
      // Se apenas startDate está selecionado, usar ela como endDate também
      onSelect({ startDate, endDate: startDate })
    }
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Data selecionada para exibição no topo
  const displayDate = endDate || startDate || now

  // Verificar se uma data está no intervalo selecionado
  const isDateInRange = (date: Date): boolean => {
    if (!startDate || !endDate) return false
    const dateTime = date.getTime()
    const startTime = startDate.getTime()
    const endTime = endDate.getTime()
    return dateTime >= startTime && dateTime <= endTime
  }

  // Verificar se é a data selecionada (começo ou fim)
  const isSelectedDate = (date: Date): boolean => {
    if (!date) return false
    const dateStr = date.toDateString()
    return (
      (startDate ? startDate.toDateString() === dateStr : false) ||
      (endDate ? endDate.toDateString() === dateStr : false)
    )
  }

  // Verificar se é hoje
  const isToday = (date: Date | null): boolean => {
    if (!date) return false
    return date.toDateString() === now.toDateString()
  }

  return (
    <div
      className="rounded-lg shadow-lg z-50"
      style={{
        backgroundColor: 'var(--color-background-primary)',
        minWidth: '320px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-border)',
        borderRadius: 'var(--border-radius-card)',
        overflow: 'hidden',
      }}
    >
      {/* Título e Data Selecionada */}
      <div
        style={{
          padding: 'var(--spacing-container-padding)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--color-border)',
        }}
      >
        <p
          style={{
            fontSize: 'var(--font-size-body-sm)',
            fontWeight: 'var(--font-weight-regular)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-sm)',
          }}
        >
          Select date
        </p>
        <div className="flex items-center gap-2">
          <p
            style={{
              fontSize: 'var(--font-size-body-lg)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
            }}
          >
            {formatSelectedDate(displayDate)}
          </p>
          {/* Ícone de lápis */}
          <svg
            className="w-4 h-4"
            style={{ color: 'var(--color-text-secondary)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
      </div>

      {/* Navegação do Mês */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--spacing-container-padding)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            style={{
              fontSize: 'var(--font-size-body-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
            }}
          >
            {monthName}
          </span>
          {/* Seta para baixo (dropdown) */}
          <svg
            className="w-4 h-4"
            style={{ color: 'var(--color-text-secondary)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          {/* Seta esquerda */}
          <button
            onClick={goToPreviousMonth}
            style={{
              padding: 'var(--spacing-xs)',
              cursor: 'pointer',
              borderRadius: 'var(--border-radius-sm)',
            }}
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
          {/* Seta direita */}
          <button
            onClick={goToNextMonth}
            style={{
              padding: 'var(--spacing-xs)',
              cursor: 'pointer',
              borderRadius: 'var(--border-radius-sm)',
            }}
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
        </div>
      </div>

      {/* Grid de Calendário */}
      <div style={{ padding: 'var(--spacing-container-padding)' }}>
        {/* Dias da semana */}
        <div
          className="grid grid-cols-7 gap-1 mb-2"
          style={{
            gap: 'var(--spacing-xs)',
            marginBottom: 'var(--spacing-sm)',
          }}
        >
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="text-center"
              style={{
                fontSize: 'var(--font-size-body-sm)',
                fontWeight: 'var(--font-weight-regular)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Dias do calendário */}
        <div
          className="grid grid-cols-7 gap-1"
          style={{
            gap: 'var(--spacing-xs)',
          }}
        >
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={index}></div>
            }

            const selected = isSelectedDate(date)
            const inRange = isDateInRange(date)
            const today = isToday(date)

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                className="flex items-center justify-center"
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: 'var(--border-radius-full)',
                  fontSize: 'var(--font-size-body-sm)',
                  fontWeight: selected ? 'var(--font-weight-bold)' : 'var(--font-weight-regular)',
                  color: selected ? 'var(--gray-900)' : 'var(--gray-900)',
                  backgroundColor: selected
                    ? 'var(--color-primary)' // Verde-limão quando selecionado
                    : inRange
                    ? 'var(--gray-100)' // Cinza claro quando no intervalo
                    : 'transparent',
                  cursor: 'pointer',
                  transitionProperty: 'background-color',
                  transitionDuration: '200ms',
                  ...(today && !selected
                    ? { border: '1px solid var(--color-border)' }
                    : { border: 'none' }),
                }}
                onMouseEnter={(e) => {
                  if (!selected && !inRange) {
                    e.currentTarget.style.backgroundColor = 'var(--gray-100)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected && !inRange) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Botões do rodapé */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--spacing-container-padding)',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'var(--color-border)',
        }}
      >
        <button
          onClick={handleClear}
          style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            fontSize: 'var(--font-size-body-md)',
            fontWeight: 'var(--font-weight-regular)',
            color: 'var(--gray-900)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Clear
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              fontSize: 'var(--font-size-body-md)',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--gray-900)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleOK}
            style={{
              paddingTop: '12px',
              paddingBottom: '12px',
              paddingLeft: '24px',
              paddingRight: '24px',
              fontSize: 'var(--font-size-body-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-0)',
              backgroundColor: 'var(--gray-900)',
              borderRadius: '100px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

export default DatePickerCalendar
