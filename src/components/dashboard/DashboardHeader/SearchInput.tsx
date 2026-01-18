interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const SearchInput = ({ value, onChange, placeholder = 'Pesquisar...' }: SearchInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div
      className="relative flex items-center"
      style={{
        width: '100%',
      }}
    >
      {/* Ícone de lupa */}
      <div
        className="absolute left-0 flex items-center justify-center"
        style={{
          paddingLeft: '24px', // Padding horizontal do input
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Campo de input */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full"
        style={{
          paddingTop: '12px', // Padding vertical
          paddingBottom: '12px', // Padding vertical
          paddingLeft: 'calc(24px + 20px + 8px)', // Padding horizontal + largura ícone (w-5 = 20px) + gap de 8px
          paddingRight: '24px', // Padding horizontal
          borderRadius: '100px', // Corner radius
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-background-primary)',
          fontSize: 'var(--font-size-body-md)',
          color: 'var(--gray-900)',
        }}
      />
    </div>
  )
}

export default SearchInput
