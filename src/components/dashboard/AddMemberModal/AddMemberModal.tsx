import { useState, useEffect } from 'react'
import { useFinance } from '@/contexts/FinanceContext'

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
}

// Sugestões comuns de funções na família
const FAMILY_ROLES = ['Pai', 'Mãe', 'Filho', 'Filha', 'Avô', 'Avó', 'Tio', 'Tia']

const AddMemberModal = ({ isOpen, onClose }: AddMemberModalProps) => {
  const { addFamilyMember } = useFinance()

  // Estados do formulário
  const [name, setName] = useState<string>('')
  const [role, setRole] = useState<string>('')
  const [avatarType, setAvatarType] = useState<'url' | 'upload'>('url')
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [monthlyIncome, setMonthlyIncome] = useState<string>('')

  // Estados de validação
  const [errors, setErrors] = useState<{
    name?: string
    role?: string
  }>({})

  // Estado para mostrar sugestões de função
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false)

  // Limpar formulário quando modal fecha
  useEffect(() => {
    if (!isOpen) {
      setName('')
      setRole('')
      setAvatarType('url')
      setAvatarUrl('')
      setAvatarFile(null)
      setMonthlyIncome('')
      setErrors({})
      setShowRoleSuggestions(false)
    }
  }, [isOpen])

  // Fechar modal ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        alert('Por favor, selecione uma imagem JPG ou PNG')
        return
      }
      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB')
        return
      }
      setAvatarFile(file)
      // Criar URL local para preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Validação
  const validate = (): boolean => {
    const newErrors: typeof errors = {}

    // Validar nome
    if (!name || name.trim().length < 3) {
      newErrors.name = 'Por favor, insira um nome válido'
    }

    // Validar função
    if (!role || role.trim().length === 0) {
      newErrors.role = 'Por favor, informe a função na família'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submeter formulário
  const handleSubmit = () => {
    if (!validate()) {
      return
    }

    // Determinar URL do avatar
    let finalAvatarUrl: string | undefined
    if (avatarType === 'url' && avatarUrl.trim()) {
      finalAvatarUrl = avatarUrl.trim()
    } else if (avatarType === 'upload' && avatarFile) {
      // Em produção, você faria upload aqui e obteria a URL
      // Por enquanto, usamos a URL local gerada
      finalAvatarUrl = avatarUrl
    }
    // Se nenhuma imagem fornecida, undefined = avatar padrão será usado

    // Converter renda mensal para número
    const incomeValue = monthlyIncome
      ? parseFloat(monthlyIncome.replace(/[^\d,.-]/g, '').replace(',', '.'))
      : undefined

    addFamilyMember({
      name: name.trim(),
      role: role.trim(),
      avatarUrl: finalAvatarUrl,
      monthlyIncome: incomeValue || undefined,
    })

    // Notificação
    console.log('Membro adicionado com sucesso!')

    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="flex flex-col"
        style={{
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          borderRadius: 'var(--border-radius-card)',
          margin: 'var(--spacing-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header
          className="flex items-center justify-between flex-shrink-0"
          style={{
            padding: 'var(--spacing-lg)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--font-size-heading-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
            }}
          >
            Adicionar Membro da Família
          </h2>

          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transitionProperty: 'background-color',
              transitionDuration: '200ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--gray-100)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        {/* Conteúdo scrollável */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            padding: 'var(--spacing-lg)',
            maxHeight: 'calc(90vh - 200px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-lg)',
            }}
          >
            {/* Campo Nome Completo */}
            <div>
              <label
                style={{
                  fontSize: 'var(--font-size-body-sm)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                  marginBottom: 'var(--spacing-sm)',
                  display: 'block',
                }}
              >
                Nome Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }))
                  }
                }}
                placeholder="Ex: João Silva"
                className="w-full"
                style={{
                  height: '56px',
                  padding: '12px 24px',
                  fontSize: 'var(--font-size-body-md)',
                  color: 'var(--gray-900)',
                  backgroundColor: '#FFFFFF',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: errors.name ? '#ef4444' : 'var(--color-border)',
                  borderRadius: 'var(--border-radius-input)',
                }}
              />
              {errors.name && (
                <p
                  style={{
                    fontSize: 'var(--font-size-body-sm)',
                    color: '#ef4444',
                    marginTop: '4px',
                  }}
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* Campo Função/Papel (Combobox) */}
            <div className="relative">
              <label
                style={{
                  fontSize: 'var(--font-size-body-sm)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                  marginBottom: 'var(--spacing-sm)',
                  display: 'block',
                }}
              >
                Função na Família
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value)
                    setShowRoleSuggestions(true)
                    if (errors.role) {
                      setErrors((prev) => ({ ...prev, role: undefined }))
                    }
                  }}
                  onFocus={() => setShowRoleSuggestions(true)}
                  onBlur={() => {
                    // Delay para permitir clique nas sugestões
                    setTimeout(() => setShowRoleSuggestions(false), 200)
                  }}
                  placeholder="Ex: Pai, Mãe, Filho, Avô..."
                  className="w-full"
                  style={{
                    height: '56px',
                    padding: '12px 24px',
                    fontSize: 'var(--font-size-body-md)',
                    color: 'var(--gray-900)',
                    backgroundColor: '#FFFFFF',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: errors.role ? '#ef4444' : 'var(--color-border)',
                    borderRadius: 'var(--border-radius-input)',
                  }}
                />
                {showRoleSuggestions && role.trim().length > 0 && (
                  <div
                    className="absolute z-10 w-full"
                    style={{
                      marginTop: '4px',
                      backgroundColor: '#FFFFFF',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: 'var(--color-border)',
                      borderRadius: 'var(--border-radius-input)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      maxHeight: '200px',
                      overflowY: 'auto',
                    }}
                  >
                    {FAMILY_ROLES.filter((r) =>
                      r.toLowerCase().includes(role.toLowerCase())
                    ).map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setRole(suggestion)
                          setShowRoleSuggestions(false)
                        }}
                        className="w-full text-left"
                        style={{
                          padding: '12px 24px',
                          fontSize: 'var(--font-size-body-md)',
                          color: 'var(--gray-900)',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          border: 'none',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--gray-100)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.role && (
                <p
                  style={{
                    fontSize: 'var(--font-size-body-sm)',
                    color: '#ef4444',
                    marginTop: '4px',
                  }}
                >
                  {errors.role}
                </p>
              )}
            </div>

            {/* Campo Avatar */}
            <div>
              <label
                style={{
                  fontSize: 'var(--font-size-body-sm)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                  marginBottom: 'var(--spacing-sm)',
                  display: 'block',
                }}
              >
                Avatar (Opcional)
              </label>

              {/* Tabs URL / Upload */}
              <div
                className="flex rounded-lg overflow-hidden mb-3"
                style={{
                  backgroundColor: 'var(--gray-100)',
                  padding: '4px',
                  gap: '4px',
                }}
              >
                <button
                  onClick={() => {
                    setAvatarType('url')
                    setAvatarFile(null)
                  }}
                  className="flex-1"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: avatarType === 'url' ? '#FFFFFF' : 'transparent',
                    color: avatarType === 'url' ? 'var(--gray-900)' : 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-body-sm)',
                    fontWeight: 'var(--font-weight-bold)',
                    borderRadius: 'var(--border-radius-button)',
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: avatarType === 'url' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  URL
                </button>
                <button
                  onClick={() => {
                    setAvatarType('upload')
                    setAvatarUrl('')
                  }}
                  className="flex-1"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: avatarType === 'upload' ? '#FFFFFF' : 'transparent',
                    color: avatarType === 'upload' ? 'var(--gray-900)' : 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-body-sm)',
                    fontWeight: 'var(--font-weight-bold)',
                    borderRadius: 'var(--border-radius-button)',
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: avatarType === 'upload' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  Upload
                </button>
              </div>

              {/* Conteúdo da aba selecionada */}
              {avatarType === 'url' ? (
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://exemplo.com/avatar.jpg"
                  className="w-full"
                  style={{
                    height: '56px',
                    padding: '12px 24px',
                    fontSize: 'var(--font-size-body-md)',
                    color: 'var(--gray-900)',
                    backgroundColor: '#FFFFFF',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border)',
                    borderRadius: 'var(--border-radius-input)',
                  }}
                />
              ) : (
                <div>
                  <label
                    className="flex items-center justify-center cursor-pointer"
                    style={{
                      height: '56px',
                      padding: '12px 24px',
                      fontSize: 'var(--font-size-body-md)',
                      color: 'var(--gray-900)',
                      backgroundColor: '#FFFFFF',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: 'var(--color-border)',
                      borderRadius: 'var(--border-radius-input)',
                    }}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <span>
                      {avatarFile ? avatarFile.name : 'Selecionar arquivo (JPG, PNG, máx. 5MB)'}
                    </span>
                  </label>
                  {avatarFile && (
                    <p
                      style={{
                        fontSize: 'var(--font-size-body-sm)',
                        color: 'var(--color-text-secondary)',
                        marginTop: '4px',
                      }}
                    >
                      Arquivo selecionado: {avatarFile.name} ({(avatarFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              )}

              {/* Preview do avatar */}
              {(avatarUrl || avatarFile) && (
                <div
                  className="mt-3 flex items-center justify-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: 'var(--border-radius-avatar)',
                    overflow: 'hidden',
                    border: '2px solid var(--color-border)',
                  }}
                >
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Campo Renda Mensal */}
            <div>
              <label
                style={{
                  fontSize: 'var(--font-size-body-sm)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                  marginBottom: 'var(--spacing-sm)',
                  display: 'block',
                }}
              >
                Renda Mensal Estimada (Opcional)
              </label>
              <div className="relative">
                <span
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 'var(--font-size-body-md)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--gray-900)',
                    pointerEvents: 'none',
                  }}
                >
                  R$
                </span>
                <input
                  type="text"
                  value={monthlyIncome}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d,.-]/g, '')
                    setMonthlyIncome(val)
                  }}
                  placeholder="0,00"
                  className="w-full"
                  style={{
                    height: '56px',
                    paddingLeft: '48px',
                    paddingRight: '24px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    fontSize: 'var(--font-size-body-md)',
                    color: 'var(--gray-900)',
                    backgroundColor: '#FFFFFF',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border)',
                    borderRadius: 'var(--border-radius-input)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer
          className="flex items-center justify-end flex-shrink-0"
          style={{
            padding: 'var(--spacing-lg)',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: '#FFFFFF',
            gap: 'var(--spacing-md)',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '12px 16px',
              fontSize: 'var(--font-size-body-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--gray-900)',
              backgroundColor: 'transparent',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-border)',
              borderRadius: '100px',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '12px 16px',
              fontSize: 'var(--font-size-body-md)',
              fontWeight: 'var(--font-weight-bold)',
              color: '#FFFFFF',
              backgroundColor: 'var(--gray-900)',
              border: 'none',
              borderRadius: '100px',
              cursor: 'pointer',
            }}
          >
            Adicionar Membro
          </button>
        </footer>
      </div>
    </div>
  )
}

export default AddMemberModal
