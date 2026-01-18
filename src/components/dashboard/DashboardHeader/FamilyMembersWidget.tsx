import { useState } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { UserIcon } from '@/components/layout/Sidebar/Icons'

const FamilyMembersWidget = () => {
  const { familyMembers, selectedMember, setSelectedMember } = useFinance()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleMemberClick = (memberId: string) => {
    if (selectedMember === memberId) {
      setSelectedMember(null) // Remove filtro se já estiver selecionado
    } else {
      setSelectedMember(memberId) // Aplica filtro
    }
  }

  const handleAddMember = () => {
    // TODO: Abrir modal de adicionar membro
    console.log('Abrir modal de adicionar membro')
  }

  return (
    <div className="flex items-center">
      {/* Avatares sobrepostos */}
      <div className="flex items-center" style={{ marginRight: 'var(--spacing-sm)' }}>
        {familyMembers.map((member, index) => {
          const isSelected = selectedMember === member.id

          return (
            <button
              key={member.id}
              onClick={() => handleMemberClick(member.id)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative flex items-center justify-center flex-shrink-0 transition-all duration-200"
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: 'var(--border-radius-avatar)',
                backgroundColor: 'var(--color-primary)',
                marginLeft: index > 0 ? '-0.5rem' : '0',
                borderWidth: isSelected ? '3px' : '2px',
                borderStyle: 'solid',
                borderColor: isSelected ? 'var(--gray-900)' : 'var(--gray-0)', // Borda branca quando não selecionado
                cursor: 'pointer',
                transform: hoveredIndex === index ? 'scale(1.1) translateZ(0)' : 'scale(1)',
                zIndex: hoveredIndex === index ? 10 : index + 1,
                transitionProperty: 'transform, border-color',
                transitionDuration: '200ms',
              }}
              aria-label={`Filtrar por ${member.name}`}
            >
              <UserIcon
                className="w-6 h-6"
                style={{ color: 'var(--gray-900)' }}
              />

              {/* Ícone de check verde no canto inferior direito quando selecionado */}
              {isSelected && (
                <div
                  className="absolute bottom-0 right-0 flex items-center justify-center rounded-full"
                  style={{
                    width: '1rem',
                    height: '1rem',
                    backgroundColor: 'var(--color-success)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: 'var(--gray-0)',
                    borderRadius: 'var(--border-radius-full)',
                    transform: 'translate(25%, 25%)',
                  }}
                >
                  <svg
                    className="w-2 h-2"
                    style={{ color: 'var(--gray-0)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Botão "+" para adicionar membro */}
      <button
        onClick={handleAddMember}
        className="flex items-center justify-center flex-shrink-0 rounded-full"
        style={{
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: 'var(--border-radius-avatar)',
          backgroundColor: 'var(--color-background-primary)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--color-border)',
          cursor: 'pointer',
          transitionProperty: 'background-color',
          transitionDuration: '200ms',
          marginLeft: 'var(--spacing-xs)',
        }}
        aria-label="Adicionar membro"
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
  )
}

export default FamilyMembersWidget
