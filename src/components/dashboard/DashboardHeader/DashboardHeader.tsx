import { useFinance } from '@/contexts/FinanceContext'
import SearchInput from './SearchInput'
import FilterButton from './FilterButton'
import DateRangeSelector from './DateRangeSelector'
import FamilyMembersWidget from './FamilyMembersWidget'
import NewTransactionButton from './NewTransactionButton'

const DashboardHeader = () => {
  const { searchText, setSearchText } = useFinance()

  const handleSearchChange = (value: string) => {
    setSearchText(value)
  }

  return (
    <header
      className="flex items-center mb-6 flex-wrap"
      style={{
        marginBottom: 'var(--spacing-card-gap)',
        paddingBottom: 'var(--spacing-md)',
      }}
    >
      {/* Busca à esquerda */}
      <div style={{ width: '320px', maxWidth: '320px', marginRight: '8px' }}>
        <SearchInput
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Pesquisar"
        />
      </div>

      {/* Botão de Filtros */}
      <div className="relative" style={{ marginRight: '8px' }}>
        <FilterButton />
      </div>

      {/* Seletor de Período */}
      <div className="relative" style={{ marginRight: '8px' }}>
        <DateRangeSelector />
      </div>

      {/* Widget de Membros da Família */}
      <div className="flex items-center" style={{ marginRight: 'var(--spacing-card-gap)' }}>
        <FamilyMembersWidget />
      </div>

      {/* Botão Nova Transação à direita */}
      <div className="ml-auto">
        <NewTransactionButton />
      </div>
    </header>
  )
}

export default DashboardHeader
