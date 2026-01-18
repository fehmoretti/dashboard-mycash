# Documentação de Componentes - mycash+

## 📦 Visão Geral

Este documento descreve todos os componentes criados no projeto, agrupados por domínio, suas responsabilidades, props e uso.

---

## 🏗️ Componentes de Layout

### `MainLayout`
**Localização**: `src/components/layout/MainLayout/MainLayout.tsx`  
**Responsabilidade**: Layout principal da aplicação que gerencia Sidebar (desktop) e HeaderMobile (mobile/tablet)  
**Props**: Nenhuma (usa `Outlet` do React Router)  
**Características**:
- Renderização condicional baseada em breakpoint (1280px)
- Gerencia margem do conteúdo baseado no estado da sidebar
- Transições suaves entre estados

### `Sidebar`
**Localização**: `src/components/layout/Sidebar/Sidebar.tsx`  
**Responsabilidade**: Navegação lateral para desktop (≥1280px)  
**Props**: `{ currentPath: string }`  
**Características**:
- Estados expanded/collapsed
- Menu de navegação principal
- Empurra conteúdo, nunca sobrepõe
- Visible apenas no desktop

### `HeaderMobile`
**Localização**: `src/components/layout/HeaderMobile/`  
**Responsabilidade**: Cabeçalho para mobile/tablet (<1280px)  
**Subcomponentes**:
- `MenuDropdown`: Menu drawer lateral
- `NewTransactionButton`: Botão para nova transação  
**Características**:
- Botão de menu abre drawer
- Ações principais sempre acessíveis
- Some completamente no desktop

---

## 📊 Componentes do Dashboard

### Cards de Resumo

#### `BalanceCard`
**Localização**: `src/components/dashboard/BalanceCard/BalanceCard.tsx`  
**Responsabilidade**: Exibe saldo total (contas bancárias - faturas de cartões)  
**Props**: Nenhuma (usa `useFinance`)  
**Características**:
- Animação de contagem (`useCountAnimation`)
- Valor formatado em R$
- Atualiza baseado em filtros ativos

#### `IncomeCard`
**Localização**: `src/components/dashboard/IncomeCard/IncomeCard.tsx`  
**Responsabilidade**: Exibe total de receitas do período filtrado  
**Props**: Nenhuma (usa `useFinance`)  
**Características**:
- Soma todas as transações de tipo 'income'
- Respeita filtros de membro e período
- Animação de contagem

#### `ExpenseCard`
**Localização**: `src/components/dashboard/ExpenseCard/ExpenseCard.tsx`  
**Responsabilidade**: Exibe total de despesas do período filtrado  
**Props**: Nenhuma (usa `useFinance`)  
**Características**:
- Soma todas as transações de tipo 'expense'
- Respeita filtros de membro e período
- Animação de contagem

### Widgets

#### `CreditCardsWidget`
**Localização**: `src/components/dashboard/CreditCardsWidget/CreditCardsWidget.tsx`  
**Responsabilidade**: Widget de cartões de crédito com paginação  
**Props**: Nenhuma (usa `useFinance`)  
**Características**:
- Lista paginada de cartões (3 por vez)
- Badge de uso percentual
- Botão "Adicionar Cartão"
- Clique abre modal de detalhes

#### `UpcomingExpensesWidget`
**Localização**: `src/components/dashboard/UpcomingExpensesWidget/UpcomingExpensesWidget.tsx`  
**Responsabilidade**: Lista próximas despesas a vencer  
**Props**: Nenhuma (usa `useFinance`)  
**Características**:
- Ordena por data de vencimento
- Destaque para despesas próximas
- Ações: marcar como pago, adicionar despesa

### Gráficos

#### `ExpensesByCategoryCarousel`
**Localização**: `src/components/dashboard/ExpensesByCategoryCarousel/ExpensesByCategoryCarousel.tsx`  
**Responsabilidade**: Carrossel de gráficos donut por categoria  
**Props**: Nenhuma (usa `useFinance`)  
**Características**:
- Navegação por setas ou dots
- Gráfico donut por categoria
- Exibe percentual e valor total
- Usa Recharts

#### `CategoryDonutCard`
**Localização**: `src/components/dashboard/CategoryDonutCard/CategoryDonutCard.tsx`  
**Responsabilidade**: Card individual de categoria com gráfico donut  
**Props**: `{ category: string, amount: number, percentage: number }`  
**Características**:
- Gráfico donut animado
- Percentual formatado
- Valor total formatado

#### `FinancialFlowChart`
**Localização**: `src/components/dashboard/FinancialFlowChart/FinancialFlowChart.tsx`  
**Responsabilidade**: Gráfico de linha temporal de receitas e despesas  
**Props**: Nenhuma (usa `useFinance`)  
**Características**:
- Linha temporal mensal
- Diferenciação visual entre receitas e despesas
- Tooltips interativos
- Usa Recharts

### Tabelas

#### `TransactionsTable`
**Localização**: `src/components/dashboard/TransactionsTable/TransactionsTable.tsx`  
**Responsabilidade**: Tabela de transações com paginação e busca local  
**Props**: 
- `transactions?: Transaction[]` (opcional, usa do contexto se não fornecido)
- `itemsPerPage?: number` (padrão: 5)
- `showLocalFilters?: boolean` (padrão: true)  
**Características**:
- Paginação completa
- Busca local por descrição/categoria
- Filtro local por tipo
- Integração com filtros globais
- Versão desktop: tabela completa
- Versão mobile: cards verticais (TODO)

### Header do Dashboard

#### `DashboardHeader`
**Localização**: `src/components/dashboard/DashboardHeader/DashboardHeader.tsx`  
**Responsabilidade**: Barra de controles no topo do dashboard  
**Subcomponentes**:
- `SearchInput`: Campo de busca textual
- `FilterButton`: Botão de filtros (abre popover/modal)
- `DateRangeSelector`: Seletor de período
- `FamilyMembersWidget`: Avatares de membros da família
- `NewTransactionButton`: Botão nova transação

#### `SearchInput`
**Props**: `{ value: string, onChange: (value: string) => void, placeholder?: string }`

#### `FilterButton`
**Responsabilidade**: Gerencia filtros de tipo, membro e período  
**Características**:
- Desktop: Abre popover
- Mobile: Abre modal fullscreen

#### `FilterPopover`
**Props**: Nenhuma (usa `useFinance`)  
**Características**:
- Filtros: tipo, membro, período
- Aplica/remove filtros globalmente

#### `FiltersMobileModal`
**Props**: `{ isOpen: boolean, onClose: () => void }`  
**Características**:
- Modal fullscreen no mobile
- Estados temporários até aplicar
- Slide-in/slide-out animation

#### `DateRangeSelector`
**Características**:
- Mostra período atual ou filtrado
- Abre calendário ao clicar
- Formato: "01 jan - 31 jan, 2024"

#### `SimpleDateRangePicker`
**Props**: `{ dateRange: DateRange | null, onDateRangeChange: (range: DateRange | null) => void }`  
**Características**:
- Seleção de período simplificada
- Usado em modais mobile

#### `FamilyMembersWidget`
**Características**:
- Mostra avatares de todos os membros
- Clique filtra por membro
- Botão para adicionar membro

---

## 🪟 Modais

### `NewTransactionModal`
**Localização**: `src/components/dashboard/NewTransactionModal/NewTransactionModal.tsx`  
**Responsabilidade**: Formulário completo para criar nova transação  
**Props**: `{ isOpen: boolean, onClose: () => void, prefilledAccountId?: string | null }`  
**Campos**:
- Toggle Receita/Despesa
- Valor (com formatação R$)
- Descrição
- Categoria (com opção de criar nova)
- Membro (opcional)
- Conta/Cartão
- Parcelamento (cartões de crédito)
- Despesa recorrente (apenas despesas)  
**Validações**:
- Valor > 0
- Descrição mínimo 3 caracteres
- Categoria obrigatória
- Conta/Cartão obrigatório  
**Características**:
- Responsivo (width 100% mobile, max-width desktop)
- Header e footer fixos, corpo scrollável
- Fecha por ESC, click fora ou X

### `AddAccountModal`
**Localização**: `src/components/dashboard/AddAccountModal/AddAccountModal.tsx`  
**Responsabilidade**: Formulário para adicionar conta bancária ou cartão de crédito  
**Props**: `{ isOpen: boolean, onClose: () => void }`  
**Campos (Conta Bancária)**:
- Nome
- Tipo (Corrente, Poupança)
- Banco
- Saldo inicial  
**Campos (Cartão de Crédito)**:
- Nome
- Banco
- Limite
- Dia de fechamento
- Dia de vencimento
- Últimos 4 dígitos
- Tema (preto, verde-limão, branco)  
**Validações**: Campos obrigatórios validados  
**Características**: Toggle entre Conta/Cartão muda campos

### `AddMemberModal`
**Localização**: `src/components/dashboard/AddMemberModal/AddMemberModal.tsx`  
**Responsabilidade**: Formulário para adicionar membro da família  
**Props**: `{ isOpen: boolean, onClose: () => void, member?: FamilyMember }`  
**Campos**:
- Nome
- Papel na família
- Renda mensal (opcional)
- URL do avatar (opcional)  
**Características**: Permite edição se `member` fornecido

### `CardDetailsModal`
**Localização**: `src/components/dashboard/CardDetailsModal/CardDetailsModal.tsx`  
**Responsabilidade**: Modal de detalhes completos do cartão  
**Props**: `{ isOpen: boolean, onClose: () => void, card: CreditCard, onAddExpense?: (cardId: string) => void, onEditCard?: () => void }`  
**Conteúdo**:
- Informações do cartão (limite, fatura, disponível)
- Barra de progresso de uso
- Datas de fechamento e vencimento
- Lista paginada de despesas associadas
- Botões: Ver Extrato, Adicionar Despesa, Editar Cartão  
**Características**: Tabela de despesas dentro do modal

---

## 📄 Páginas

### `Dashboard`
**Localização**: `src/App.tsx`  
**Rota**: `/`  
**Responsabilidade**: Página inicial com visão geral  
**Componentes**:
- DashboardHeader
- ExpensesByCategoryCarousel
- BalanceCard, IncomeCard, ExpenseCard
- CreditCardsWidget
- FinancialFlowChart
- UpcomingExpensesWidget
- TransactionsTable  
**Layout**: Grid responsivo (1→2→3 colunas)

### `CardsView`
**Localização**: `src/pages/CardsView.tsx`  
**Rota**: `/cartoes`  
**Responsabilidade**: Página dedicada para cartões de crédito  
**Características**:
- Grid responsivo de cards (1→2→3 colunas)
- Informações detalhadas de cada cartão
- Botões: Ver Detalhes, Adicionar Despesa
- Estado vazio amigável
- Integração com AddAccountModal, CardDetailsModal, NewTransactionModal

### `TransactionsView`
**Localização**: `src/pages/TransactionsView.tsx`  
**Rota**: `/transacoes`  
**Responsabilidade**: Página completa de transações com filtros avançados  
**Características**:
- Filtros avançados: busca, tipo, categoria, conta, membro, status, período
- Resumo estatístico (receitas, despesas, diferença, contagem)
- Tabela expandida (10 itens por página)
- Exportação CSV
- Integração com NewTransactionModal

### `ProfileView`
**Localização**: `src/pages/ProfileView.tsx`  
**Rota**: `/perfil`  
**Responsabilidade**: Página de perfil e configurações  
**Abas**:
- **Informações**: Dados do usuário e membros da família
- **Configurações**: Preferências, notificações, categorias, privacidade  
**Características**:
- Sistema de abas
- Integração com AddMemberModal
- Botão de logout

---

## 🎣 Hooks Customizados

### `useFinance`
**Localização**: `src/contexts/FinanceContext.tsx`  
**Responsabilidade**: Hook para acessar contexto financeiro global  
**Retorna**: Objeto com:
- Arrays: `transactions`, `creditCards`, `bankAccounts`, `familyMembers`, `goals`
- Filtros: `selectedMember`, `dateRange`, `transactionType`, `searchText`
- Setters de filtros
- Funções CRUD para todas as entidades
- Funções de cálculo: `getFilteredTransactions`, `calculateTotalBalance`, etc.  
**Uso**: `const { transactions, addTransaction } = useFinance()`

### `useSidebar`
**Localização**: `src/hooks/useSidebar.ts`  
**Responsabilidade**: Gerencia estado expandido/colapsado da sidebar  
**Retorna**: `{ isExpanded: boolean, toggle: () => void, expand: () => void, collapse: () => void }`  
**Características**: Persiste estado no localStorage

### `useCountAnimation`
**Localização**: `src/hooks/useCountAnimation.ts`  
**Responsabilidade**: Anima contagem de valores numéricos  
**Props**: `{ targetValue: number, duration?: number }`  
**Retorna**: `number` (valor animado)  
**Uso**: Cards de resumo financeiro

---

## 🧰 Utilitários

### Currency (`currency.utils.ts`)
- `formatCurrency(value: number)`: Formata como R$ 1.234,56
- `formatCompactCurrency(value: number)`: Formata como R$ 2,5k ou R$ 1,2M
- `parseCurrencyInput(input: string)`: Converte string para número

### Date (`date.utils.ts`)
- `formatDate(date: Date)`: Formata como DD/MM/AAAA
- `formatDateLong(date: Date)`: Formata como "15 de Janeiro de 2024"
- `formatDateRange(start: Date, end: Date)`: Formata intervalo
- `formatRelativeDate(date: Date)`: Formata relativa ("Hoje", "Há 3 dias")

### Finance (`finance.utils.ts`)
- `calculatePercentage(partial, total, decimals)`: Calcula percentual
- `calculateDifference(oldValue, newValue)`: Calcula diferença absoluta e percentual
- `calculateInstallmentValue(totalValue, installments)`: Calcula valor de parcela

### Array (`array.utils.ts`)
- `groupByCategory(transactions)`: Agrupa por categoria
- `filterByDateRange(transactions, dateRange)`: Filtra por período
- `sortByDate(transactions, order)`: Ordena por data

### Validation (`validation.utils.ts`)
- `isValidEmail(email)`: Valida email
- `isValidCPF(cpf)`: Valida CPF brasileiro
- `isValidDate(date, allowFuture)`: Valida data
- `isPositiveNumber(value)`: Verifica se > 0

### ID (`id.utils.ts`)
- `generateUniqueId(prefix?)`: Gera ID único (crypto.randomUUID ou fallback)

---

## 📊 Tipos Principais

**Localização**: `src/types/index.ts`

- `Transaction`: Transação financeira
- `CreditCard`: Cartão de crédito
- `BankAccount`: Conta bancária
- `FamilyMember`: Membro da família
- `Goal`: Objetivo financeiro
- `DateRange`: Intervalo de datas
- `CategoryExpense`: Despesa por categoria

---

## 🎨 Design System

**Localização**: `src/styles/variables.css`

### Cores
- `--color-primary`: Verde-limão (#C6FF00)
- `--color-danger`: Vermelho para alertas
- `--color-success`: Verde para sucesso
- Tons de cinza: `--gray-0` a `--gray-900`

### Espaçamentos
- `--spacing-container-padding`: Padding de containers
- `--spacing-card-gap`: Espaçamento entre cards
- `--spacing-input-padding`: Padding de inputs

### Tipografia
- `--font-size-heading-lg/md`: Tamanhos de heading
- `--font-size-body-lg/md/sm`: Tamanhos de corpo
- `--font-weight-bold/regular`: Pesos de fonte

### Border Radius
- `--border-radius-card`: Bordas arredondadas de cards
- `--border-radius-button`: Bordas de botões
- `--border-radius-input`: Bordas de inputs

---

## ✅ Status de Implementação

### Completo ✅
- Todas as páginas principais
- Sistema de navegação (sidebar + header mobile)
- Context global
- Cálculos financeiros
- Filtros combinados
- Modais com validação
- Design system integrado
- Responsividade completa
- Animações e transições
- Formatações brasileiras
- Acessibilidade básica

### Parcial/Pendente 🔄
- Sistema de toasts (usa `console.log` temporariamente)
- Modal de editar perfil/membro
- Tabela mobile com cards verticais
- Integração com Supabase (preparado com TODOs)

---

**Total de Componentes**: ~40+  
**Total de Páginas**: 4  
**Total de Hooks**: 3  
**Total de Utilitários**: 30+ funções
