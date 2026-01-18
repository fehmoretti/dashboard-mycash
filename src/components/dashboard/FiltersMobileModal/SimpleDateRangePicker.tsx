import { useState, useMemo } from 'react'
import { DateRange } from '@/types'

interface SimpleDateRangePickerProps {
  dateRange: DateRange | null
  onDateRangeChange: (range: DateRange | null) => void
}

const SimpleDateRangePicker = ({ dateRange, onDateRangeChange }: SimpleDateRangePickerProps) => {
  const now = new Date()
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [startDate, setStartDate] = useState<Date | null>(dateRange?.startDate || null)
  const [endDate, setEndDate] = useState<Date | null>(dateRange?.endDate || null)

  // Dias da semana abreviados
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  // Gerar dias do calendário
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
    .map((word, idx) => (idx === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ')

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      // Primeira seleção ou reset
      setStartDate(date)
      setEndDate(null)
      onDateRangeChange(null)
    } else if (startDate && !endDate) {
      // Segunda seleção
      if (date < startDate) {
        // Se a data selecionada for anterior, trocar
        const newEndDate = startDate
        const newStartDate = date
        setStartDate(newStartDate)
        setEndDate(newEndDate)
        onDateRangeChange({ startDate: newStartDate, endDate: newEndDate })
      } else {
        setEndDate(date)
        onDateRangeChange({ startDate, endDate: date })
      }
    }
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
    <div>
      <label
        style={{
          fontSize: 'var(--font-size-body-md)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--gray-900)',
          marginBottom: 'var(--spacing-md)',
          display: 'block',
        }}
      >
        Período
      </label>

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--color-border)',
          borderRadius: 'var(--border-radius-card)',
          padding: 'var(--spacing-md)',
        }}
      >
        {/* Navegação do Mês */}
        <div
          className="flex items-center justify-between mb-4"
          style={{
            marginBottom: 'var(--spacing-md)',
          }}
        >
          <button
            onClick={goToPreviousMonth}
            style={{
              padding: '8px',
              cursor: 'pointer',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: 'transparent',
              border: 'none',
            }}
          >
            <svg
              className="w-5 h-5"
              style={{ color: 'var(--gray-900)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span
            style={{
              fontSize: 'var(--font-size-body-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
            }}
          >
            {monthName}
          </span>

          <button
            onClick={goToNextMonth}
            style={{
              padding: '8px',
              cursor: 'pointer',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: 'transparent',
              border: 'none',
            }}
          >
            <svg
              className="w-5 h-5"
              style={{ color: 'var(--gray-900)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Grid de dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-2" style={{ marginBottom: '8px' }}>
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center"
              style={{
                fontSize: 'var(--font-size-body-sm)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-secondary)',
                padding: '4px',
              }}
            >
              {day.charAt(0)}
            </div>
          ))}
        </div>

        {/* Grid de dias do mês */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} style={{ padding: '8px' }} />
            }

            const inRange = isDateInRange(day)
            const selected = isSelectedDate(day)
            const today = isToday(day)

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                className="text-center"
                style={{
                  padding: '8px',
                  fontSize: 'var(--font-size-body-sm)',
                  fontWeight: selected ? 'var(--font-weight-bold)' : 'var(--font-weight-regular)',
                  color: selected || inRange ? '#FFFFFF' : today ? 'var(--color-primary)' : 'var(--gray-900)',
                  backgroundColor: selected
                    ? 'var(--gray-900)'
                    : inRange
                      ? 'var(--gray-200)'
                      : 'transparent',
                  border: today ? `1px solid var(--color-primary)` : 'none',
                  borderRadius: 'var(--border-radius-button)',
                  cursor: 'pointer',
                  minHeight: '40px',
                  transitionProperty: 'all',
                  transitionDuration: '200ms',
                }}
              >
                {day.getDate()}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SimpleDateRangePicker
