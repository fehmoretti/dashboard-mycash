import { useState, useMemo } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { FamilyMember } from '@/types'
import { formatCurrency } from '@/utils/format'
import AddMemberModal from '@/components/dashboard/AddMemberModal'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/constants'

type TabType = 'info' | 'settings'

const ProfileView = () => {
  const { familyMembers, transactions, creditCards, bankAccounts, goals } = useFinance()
  const [activeTab, setActiveTab] = useState<TabType>('info')
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null)

  // Estados para configurações
  const [notifications, setNotifications] = useState({
    billReminder: true,
    cardLimitAlert: true,
    monthlyEmail: false,
    goalAchievement: true,
  })

  // Obter usuário atual (primeiro membro do array)
  const currentUser = useMemo(() => {
    return familyMembers.length > 0 ? familyMembers[0] : null
  }, [familyMembers])

  // Obter outros membros (excluindo o usuário atual)
  const otherMembers = useMemo(() => {
    if (familyMembers.length <= 1) return []
    return familyMembers.slice(1)
  }, [familyMembers])

  const handleLogout = () => {
    // TODO: Implementar lógica de logout
    if (confirm('Deseja realmente sair do sistema?')) {
      alert('Logout implementado (TODO)')
      // Aqui seria redirecionado para tela de login ou limpar dados da sessão
    }
  }

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member)
    setIsEditProfileModalOpen(true)
  }

  const handleEditProfile = () => {
    if (currentUser) {
      setEditingMember(currentUser)
      setIsEditProfileModalOpen(true)
    }
  }

  // Avatar padrão genérico
  const DefaultAvatar = ({ size }: { size: number }) => (
    <div
      className="flex items-center justify-center rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: 'var(--border-radius-avatar)',
        backgroundColor: 'var(--gray-200)',
      }}
    >
      <svg
        className="w-6 h-6"
        style={{ color: 'var(--color-text-secondary)' }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
  )

  return (
    <div
      className="px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8 w-full"
      style={{
        backgroundColor: '#F5F6F8',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      {/* Abas */}
      <div
        className="flex gap-4 mb-6"
        style={{
          marginBottom: 'var(--spacing-xl)',
          gap: 'var(--spacing-md)',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'var(--color-border)',
        }}
      >
        <button
          onClick={() => setActiveTab('info')}
          className="pb-4"
          style={{
            paddingBottom: 'var(--spacing-md)',
            fontSize: 'var(--font-size-body-lg)',
            fontWeight: activeTab === 'info' ? 'var(--font-weight-bold)' : 'var(--font-weight-regular)',
            color: activeTab === 'info' ? 'var(--gray-900)' : 'var(--color-text-secondary)',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottomWidth: activeTab === 'info' ? '3px' : '0',
            borderBottomStyle: 'solid',
            borderBottomColor: activeTab === 'info' ? 'var(--gray-900)' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: activeTab === 'info' ? '-3px' : '0',
          }}
        >
          Informações
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className="pb-4"
          style={{
            paddingBottom: 'var(--spacing-md)',
            fontSize: 'var(--font-size-body-lg)',
            fontWeight: activeTab === 'settings' ? 'var(--font-weight-bold)' : 'var(--font-weight-regular)',
            color: activeTab === 'settings' ? 'var(--gray-900)' : 'var(--color-text-secondary)',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottomWidth: activeTab === 'settings' ? '3px' : '0',
            borderBottomStyle: 'solid',
            borderBottomColor: activeTab === 'settings' ? 'var(--gray-900)' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: activeTab === 'settings' ? '-3px' : '0',
          }}
        >
          Configurações
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'info' && (
        <div className="flex flex-col gap-6" style={{ gap: 'var(--spacing-xl)' }}>
          {/* Seção de Perfil do Usuário */}
          {currentUser && (
            <div
              className="rounded-card p-6"
              style={{
                backgroundColor: '#FFFFFF',
                padding: 'var(--spacing-xxl)',
                borderRadius: 'var(--border-radius-card)',
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6" style={{ gap: 'var(--spacing-xl)' }}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="rounded-full"
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: 'var(--border-radius-avatar)',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <DefaultAvatar size={120} />
                  )}
                </div>

                {/* Informações */}
                <div className="flex-1">
                  <h2
                    style={{
                      fontSize: 'var(--font-size-heading-xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--gray-900)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    {currentUser.name}
                  </h2>
                  <p
                    style={{
                      fontSize: 'var(--font-size-body-md)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--spacing-md)',
                    }}
                  >
                    {currentUser.role}
                  </p>

                  <div className="flex flex-col gap-2" style={{ gap: 'var(--spacing-sm)' }}>
                    {/* Email - placeholder por enquanto */}
                    <div className="flex items-center gap-2" style={{ gap: '8px' }}>
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        style={{ color: 'var(--color-text-secondary)' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span
                        style={{
                          fontSize: 'var(--font-size-body-sm)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {currentUser.name.toLowerCase().replace(/\s+/g, '.')}@exemplo.com
                      </span>
                    </div>

                    {/* Renda Mensal */}
                    {currentUser.monthlyIncome !== undefined && (
                      <div className="flex items-center gap-2" style={{ gap: '8px' }}>
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: 'var(--color-text-secondary)' }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span
                          style={{
                            fontSize: 'var(--font-size-body-sm)',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          Renda mensal: {formatCurrency(currentUser.monthlyIncome)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botão Editar Perfil */}
                <div className="flex-shrink-0">
                  <button
                    onClick={handleEditProfile}
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
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--gray-100)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    Editar Perfil
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Seção Membros da Família */}
          <div
            className="rounded-card p-6"
            style={{
              backgroundColor: '#FFFFFF',
              padding: 'var(--spacing-xxl)',
              borderRadius: 'var(--border-radius-card)',
            }}
          >
            <div className="flex items-center justify-between mb-6" style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h3
                style={{
                  fontSize: 'var(--font-size-heading-lg)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                }}
              >
                Membros da Família
              </h3>
            </div>

            {otherMembers.length === 0 && familyMembers.length === 1 ? (
              /* Estado vazio - apenas usuário cadastrado */
              <div
                className="flex flex-col items-center justify-center p-8"
                style={{
                  padding: 'var(--spacing-xxl)',
                  textAlign: 'center',
                  borderWidth: '1px',
                  borderStyle: 'dashed',
                  borderColor: 'var(--color-border)',
                  borderRadius: 'var(--border-radius-card)',
                }}
              >
                <svg
                  className="w-16 h-16 mb-4"
                  style={{ color: 'var(--gray-200)', marginBottom: 'var(--spacing-md)' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <p
                  style={{
                    fontSize: 'var(--font-size-body-md)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--spacing-md)',
                  }}
                >
                  Adicione outros membros da família para melhor controle financeiro
                </p>
                <button
                  onClick={() => setIsAddMemberModalOpen(true)}
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
                  Adicionar Membro da Família
                </button>
              </div>
            ) : (
              /* Lista de membros */
              <div className="flex flex-col gap-3" style={{ gap: '12px' }}>
                {otherMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => handleEditMember(member)}
                    className="flex items-center gap-4 p-4 rounded-card cursor-pointer transition-colors"
                    style={{
                      backgroundColor: 'var(--gray-50)',
                      padding: 'var(--spacing-md)',
                      borderRadius: 'var(--border-radius-card)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--gray-100)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--gray-50)'
                    }}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="rounded-full"
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--border-radius-avatar)',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <DefaultAvatar size={48} />
                      )}
                    </div>

                    {/* Nome e Função */}
                    <div className="flex-1">
                      <p
                        style={{
                          fontSize: 'var(--font-size-body-md)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--gray-900)',
                          marginBottom: '4px',
                        }}
                      >
                        {member.name}
                      </p>
                      <p
                        style={{
                          fontSize: 'var(--font-size-body-sm)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {member.role}
                      </p>
                    </div>

                    {/* Renda Mensal */}
                    {member.monthlyIncome !== undefined && (
                      <div className="flex-shrink-0">
                        <p
                          style={{
                            fontSize: 'var(--font-size-body-md)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--gray-900)',
                          }}
                        >
                          {formatCurrency(member.monthlyIncome)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botão Sair */}
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2"
              style={{
                padding: '12px 24px',
                fontSize: 'var(--font-size-body-md)',
                fontWeight: 'var(--font-weight-bold)',
                color: '#FFFFFF',
                backgroundColor: '#DC2626',
                border: 'none',
                borderRadius: '100px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#B91C1C'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#DC2626'
              }}
            >
              <svg
                className="w-5 h-5"
                style={{ color: '#FFFFFF' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sair
            </button>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="flex flex-col gap-6" style={{ gap: 'var(--spacing-xl)' }}>
          {/* Seção Preferências de Exibição */}
          <div
            className="rounded-card p-6"
            style={{
              backgroundColor: '#FFFFFF',
              padding: 'var(--spacing-xxl)',
              borderRadius: 'var(--border-radius-card)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--font-size-heading-lg)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--gray-900)',
                marginBottom: 'var(--spacing-xl)',
              }}
            >
              Preferências de Exibição
            </h3>

            <div className="flex flex-col gap-4" style={{ gap: 'var(--spacing-lg)' }}>
              {/* Toggle Modo Escuro */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2" style={{ gap: '8px' }}>
                  <span
                    style={{
                      fontSize: 'var(--font-size-body-md)',
                      color: 'var(--gray-900)',
                    }}
                  >
                    Modo Escuro
                  </span>
                  <span
                    className="px-2 py-1 rounded-button"
                    style={{
                      paddingLeft: '8px',
                      paddingRight: '8px',
                      paddingTop: '4px',
                      paddingBottom: '4px',
                      fontSize: 'var(--font-size-body-xs)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: '#FFFFFF',
                      backgroundColor: 'var(--gray-400)',
                      borderRadius: 'var(--border-radius-button)',
                    }}
                  >
                    Em breve
                  </span>
                </div>
                <button
                  disabled
                  className="flex items-center rounded-full cursor-not-allowed"
                  style={{
                    width: '44px',
                    height: '24px',
                    backgroundColor: 'var(--gray-200)',
                    borderRadius: '12px',
                    padding: '2px',
                    opacity: 0.5,
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '50%',
                      marginLeft: '2px',
                    }}
                  />
                </button>
              </div>

              {/* Select Moeda */}
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
                  Moeda Padrão
                </label>
                <select
                  disabled
                  className="w-full"
                  style={{
                    padding: '12px 16px',
                    fontSize: 'var(--font-size-body-md)',
                    color: 'var(--gray-900)',
                    backgroundColor: '#FFFFFF',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border)',
                    borderRadius: 'var(--border-radius-input)',
                    cursor: 'not-allowed',
                    opacity: 0.7,
                  }}
                >
                  <option>Real Brasileiro (R$)</option>
                </select>
              </div>

              {/* Select Formato de Data */}
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
                  Formato de Data
                </label>
                <select
                  className="w-full"
                  style={{
                    padding: '12px 16px',
                    fontSize: 'var(--font-size-body-md)',
                    color: 'var(--gray-900)',
                    backgroundColor: '#FFFFFF',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-border)',
                    borderRadius: 'var(--border-radius-input)',
                    cursor: 'pointer',
                  }}
                >
                  <option>DD/MM/AAAA</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seção Notificações */}
          <div
            className="rounded-card p-6"
            style={{
              backgroundColor: '#FFFFFF',
              padding: 'var(--spacing-xxl)',
              borderRadius: 'var(--border-radius-card)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--font-size-heading-lg)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--gray-900)',
                marginBottom: 'var(--spacing-xl)',
              }}
            >
              Notificações
            </h3>

            <div className="flex flex-col gap-4" style={{ gap: 'var(--spacing-lg)' }}>
              {/* Toggle Lembrete de Vencimento */}
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: 'var(--font-size-body-md)',
                    color: 'var(--gray-900)',
                  }}
                >
                  Lembrete de vencimento de contas
                </span>
                <button
                  onClick={() => setNotifications({ ...notifications, billReminder: !notifications.billReminder })}
                  className="flex items-center rounded-full cursor-pointer"
                  style={{
                    width: '44px',
                    height: '24px',
                    backgroundColor: notifications.billReminder ? 'var(--gray-900)' : 'var(--gray-200)',
                    borderRadius: '12px',
                    padding: '2px',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '50%',
                      marginLeft: notifications.billReminder ? '22px' : '2px',
                      transition: 'margin-left 0.2s',
                    }}
                  />
                </button>
              </div>

              {/* Toggle Alerta de Limite */}
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: 'var(--font-size-body-md)',
                    color: 'var(--gray-900)',
                  }}
                >
                  Alerta de aproximação do limite de cartão
                </span>
                <button
                  onClick={() => setNotifications({ ...notifications, cardLimitAlert: !notifications.cardLimitAlert })}
                  className="flex items-center rounded-full cursor-pointer"
                  style={{
                    width: '44px',
                    height: '24px',
                    backgroundColor: notifications.cardLimitAlert ? 'var(--gray-900)' : 'var(--gray-200)',
                    borderRadius: '12px',
                    padding: '2px',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '50%',
                      marginLeft: notifications.cardLimitAlert ? '22px' : '2px',
                      transition: 'margin-left 0.2s',
                    }}
                  />
                </button>
              </div>

              {/* Toggle Resumo Mensal */}
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: 'var(--font-size-body-md)',
                    color: 'var(--gray-900)',
                  }}
                >
                  Resumo mensal por email
                </span>
                <button
                  onClick={() => setNotifications({ ...notifications, monthlyEmail: !notifications.monthlyEmail })}
                  className="flex items-center rounded-full cursor-pointer"
                  style={{
                    width: '44px',
                    height: '24px',
                    backgroundColor: notifications.monthlyEmail ? 'var(--gray-900)' : 'var(--gray-200)',
                    borderRadius: '12px',
                    padding: '2px',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '50%',
                      marginLeft: notifications.monthlyEmail ? '22px' : '2px',
                      transition: 'margin-left 0.2s',
                    }}
                  />
                </button>
              </div>

              {/* Toggle Objetivos Alcançados */}
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: 'var(--font-size-body-md)',
                    color: 'var(--gray-900)',
                  }}
                >
                  Notificações de novos objetivos alcançados
                </span>
                <button
                  onClick={() => setNotifications({ ...notifications, goalAchievement: !notifications.goalAchievement })}
                  className="flex items-center rounded-full cursor-pointer"
                  style={{
                    width: '44px',
                    height: '24px',
                    backgroundColor: notifications.goalAchievement ? 'var(--gray-900)' : 'var(--gray-200)',
                    borderRadius: '12px',
                    padding: '2px',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '50%',
                      marginLeft: notifications.goalAchievement ? '22px' : '2px',
                      transition: 'margin-left 0.2s',
                    }}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Seção Categorias */}
          <div
            className="rounded-card p-6"
            style={{
              backgroundColor: '#FFFFFF',
              padding: 'var(--spacing-xxl)',
              borderRadius: 'var(--border-radius-card)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--font-size-heading-lg)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--gray-900)',
                marginBottom: 'var(--spacing-xl)',
              }}
            >
              Gerenciar Categorias
            </h3>

            <div className="flex flex-col gap-6" style={{ gap: 'var(--spacing-xl)' }}>
              {/* Categorias de Receita */}
              <div>
                <div className="flex items-center justify-between mb-4" style={{ marginBottom: 'var(--spacing-md)' }}>
                  <h4
                    style={{
                      fontSize: 'var(--font-size-body-lg)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--gray-900)',
                    }}
                  >
                    Categorias de Receita
                  </h4>
                  <button
                    onClick={() => alert('Modal de adicionar categoria em desenvolvimento')}
                    style={{
                      padding: '8px 16px',
                      fontSize: 'var(--font-size-body-sm)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: '#FFFFFF',
                      backgroundColor: 'var(--gray-900)',
                      border: 'none',
                      borderRadius: '100px',
                      cursor: 'pointer',
                    }}
                  >
                    + Adicionar Categoria
                  </button>
                </div>
                <div className="flex flex-wrap gap-2" style={{ gap: '8px' }}>
                  {INCOME_CATEGORIES.map((category) => (
                    <div
                      key={category}
                      className="group flex items-center gap-2 px-3 py-2 rounded-button relative"
                      style={{
                        backgroundColor: 'var(--gray-50)',
                        padding: '8px 12px',
                        borderRadius: 'var(--border-radius-button)',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--gray-100)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--gray-50)'
                      }}
                    >
                      <span
                        style={{
                          fontSize: 'var(--font-size-body-sm)',
                          color: 'var(--gray-900)',
                        }}
                      >
                        {category}
                      </span>
                      <div
                        className="flex gap-1 opacity-0 group-hover:opacity-100"
                        style={{
                          marginLeft: '8px',
                          transition: 'opacity 0.2s',
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            alert(`Editar categoria: ${category}`)
                          }}
                          className="p-1"
                          style={{
                            padding: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          <svg
                            className="w-4 h-4"
                            style={{ color: 'var(--gray-600)' }}
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
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm(`Deseja remover a categoria "${category}"?`)) {
                              alert(`Categoria removida: ${category}`)
                            }
                          }}
                          className="p-1"
                          style={{
                            padding: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          <svg
                            className="w-4 h-4"
                            style={{ color: '#DC2626' }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categorias de Despesa */}
              <div>
                <div className="flex items-center justify-between mb-4" style={{ marginBottom: 'var(--spacing-md)' }}>
                  <h4
                    style={{
                      fontSize: 'var(--font-size-body-lg)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--gray-900)',
                    }}
                  >
                    Categorias de Despesa
                  </h4>
                  <button
                    onClick={() => alert('Modal de adicionar categoria em desenvolvimento')}
                    style={{
                      padding: '8px 16px',
                      fontSize: 'var(--font-size-body-sm)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: '#FFFFFF',
                      backgroundColor: 'var(--gray-900)',
                      border: 'none',
                      borderRadius: '100px',
                      cursor: 'pointer',
                    }}
                  >
                    + Adicionar Categoria
                  </button>
                </div>
                <div className="flex flex-wrap gap-2" style={{ gap: '8px' }}>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <div
                      key={category}
                      className="group flex items-center gap-2 px-3 py-2 rounded-button relative"
                      style={{
                        backgroundColor: 'var(--gray-50)',
                        padding: '8px 12px',
                        borderRadius: 'var(--border-radius-button)',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--gray-100)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--gray-50)'
                      }}
                    >
                      <span
                        style={{
                          fontSize: 'var(--font-size-body-sm)',
                          color: 'var(--gray-900)',
                        }}
                      >
                        {category}
                      </span>
                      <div
                        className="flex gap-1 opacity-0 group-hover:opacity-100"
                        style={{
                          marginLeft: '8px',
                          transition: 'opacity 0.2s',
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            alert(`Editar categoria: ${category}`)
                          }}
                          className="p-1"
                          style={{ padding: '4px', cursor: 'pointer' }}
                        >
                          <svg
                            className="w-4 h-4"
                            style={{ color: 'var(--gray-600)' }}
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
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm(`Deseja remover a categoria "${category}"?`)) {
                              alert(`Categoria removida: ${category}`)
                            }
                          }}
                          className="p-1"
                          style={{ padding: '4px', cursor: 'pointer' }}
                        >
                          <svg
                            className="w-4 h-4"
                            style={{ color: '#DC2626' }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Seção Dados e Privacidade */}
          <div
            className="rounded-card p-6"
            style={{
              backgroundColor: '#FFFFFF',
              padding: 'var(--spacing-xxl)',
              borderRadius: 'var(--border-radius-card)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--font-size-heading-lg)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--gray-900)',
                marginBottom: 'var(--spacing-xl)',
              }}
            >
              Dados e Privacidade
            </h3>

            <div className="flex flex-col gap-4" style={{ gap: 'var(--spacing-lg)' }}>
              <button
                onClick={() => {
                  const data = {
                    transactions,
                    creditCards,
                    bankAccounts,
                    familyMembers,
                    goals,
                    exportDate: new Date().toISOString(),
                  }
                  const json = JSON.stringify(data, null, 2)
                  const blob = new Blob([json], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = `mycash_backup_${new Date().toISOString().split('T')[0]}.json`
                  link.click()
                  URL.revokeObjectURL(url)
                }}
                style={{
                  padding: '12px 24px',
                  fontSize: 'var(--font-size-body-md)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                  backgroundColor: 'transparent',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--color-border)',
                  borderRadius: '100px',
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                Exportar Todos os Dados
              </button>

              <button
                onClick={() => {
                  if (
                    confirm(
                      'ATENÇÃO: Esta ação irá apagar TODOS os dados do sistema. Esta ação não pode ser desfeita.\n\nDeseja continuar?'
                    )
                  ) {
                    if (confirm('Confirme novamente: Deseja realmente apagar TODOS os dados?')) {
                      alert('Funcionalidade de limpar dados em desenvolvimento')
                    }
                  }
                }}
                style={{
                  padding: '12px 24px',
                  fontSize: 'var(--font-size-body-md)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: '#FFFFFF',
                  backgroundColor: '#DC2626',
                  border: 'none',
                  borderRadius: '100px',
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                Limpar Todos os Dados
              </button>

              <p
                style={{
                  fontSize: 'var(--font-size-body-sm)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Esta ação não pode ser desfeita
              </p>
            </div>
          </div>

          {/* Seção Sobre */}
          <div
            className="rounded-card p-6"
            style={{
              backgroundColor: '#FFFFFF',
              padding: 'var(--spacing-xxl)',
              borderRadius: 'var(--border-radius-card)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--font-size-heading-lg)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--gray-900)',
                marginBottom: 'var(--spacing-lg)',
              }}
            >
              Sobre o mycash+
            </h3>

            <div className="flex flex-col gap-3" style={{ gap: '12px' }}>
              <p
                style={{
                  fontSize: 'var(--font-size-body-md)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--gray-900)',
                }}
              >
                Versão: v1.0.0
              </p>
              <p
                style={{
                  fontSize: 'var(--font-size-body-sm)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Sistema de gestão financeira familiar
              </p>
              <div className="flex flex-col gap-2" style={{ gap: '8px', marginTop: 'var(--spacing-sm)' }}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Termos de Uso em desenvolvimento')
                  }}
                  style={{
                    fontSize: 'var(--font-size-body-sm)',
                    color: 'var(--gray-900)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Termos de Uso
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Política de Privacidade em desenvolvimento')
                  }}
                  style={{
                    fontSize: 'var(--font-size-body-sm)',
                    color: 'var(--gray-900)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Política de Privacidade
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Membro */}
      <AddMemberModal isOpen={isAddMemberModalOpen} onClose={() => setIsAddMemberModalOpen(false)} />

      {/* TODO: Modal de Editar Perfil/Membro */}
      {isEditProfileModalOpen && editingMember && (
        <div>Modal de edição em desenvolvimento</div>
      )}
    </div>
  )
}

export default ProfileView
