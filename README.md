# mycash+ - Dashboard Financeiro Familiar

Sistema de gestão financeira familiar desenvolvido com React, TypeScript, Vite e Tailwind CSS. Permite gerenciar transações financeiras, cartões de crédito, contas bancárias, objetivos financeiros e membros da família em uma interface moderna e responsiva.

## 🎯 Objetivo do Sistema

O **mycash+** é uma aplicação web para gestão financeira familiar que permite:

- 📊 Visualizar resumo financeiro com cards, gráficos e tabelas
- 💳 Gerenciar cartões de crédito e contas bancárias
- 💰 Registrar transações de receitas e despesas
- 👨‍👩‍👧‍👦 Controlar finanças por membros da família
- 🎯 Definir e acompanhar objetivos financeiros
- 📈 Visualizar gastos por categoria com gráficos interativos
- 🔍 Filtrar e buscar transações com múltiplos critérios
- 📱 Funcionar perfeitamente em mobile, tablet e desktop

## 🚀 Tecnologias Utilizadas

### Core
- **React 18.3.1** - Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.5.4** - Superset JavaScript com tipagem estática
- **Vite 5.4.3** - Build tool e dev server ultra-rápido

### Estilização
- **Tailwind CSS 3.4.13** - Framework CSS utility-first
- **CSS Variables** - Design tokens do Figma para consistência visual

### Roteamento
- **React Router DOM 6.26.0** - Roteamento SPA (Single Page Application)

### Gráficos
- **Recharts 3.6.0** - Biblioteca de gráficos para React

### Desenvolvimento
- **ESLint** - Linter para garantir qualidade de código
- **TypeScript ESLint** - Regras específicas para TypeScript
- **Autoprefixer** - Processador CSS para compatibilidade

## 📦 Instalação

### Pré-requisitos
- **Node.js** >= 18.x
- **npm** >= 9.x ou **yarn** >= 1.x

### Passos de Instalação

1. **Clone o repositório** (se aplicável):
```bash
git clone <repository-url>
cd Dashboard-mycash-figma-mcp
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**:
```bash
npm run dev
```

4. **Acesse no navegador**:
```
http://localhost:5173
```

## 🛠️ Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev
```
Inicia servidor de desenvolvimento Vite com hot-reload. Acesse `http://localhost:5173`.

### Build de Produção
```bash
npm run build
```
Compila o projeto para produção usando TypeScript e Vite. Gera arquivos otimizados na pasta `dist/`.

### Preview da Build
```bash
npm run preview
```
Visualiza a build de produção localmente antes de fazer deploy.

### Linter
```bash
npm run lint
```
Executa ESLint para verificar erros e warnings no código.

## 📁 Estrutura de Pastas

```
src/
├── assets/                    # Recursos estáticos (imagens, ícones, fontes)
├── components/                # Componentes React
│   ├── dashboard/            # Componentes específicos do dashboard
│   │   ├── AddAccountModal/  # Modal para adicionar conta/cartão
│   │   ├── AddMemberModal/   # Modal para adicionar membro da família
│   │   ├── BalanceCard/      # Card de saldo total
│   │   ├── CardDetailsModal/ # Modal de detalhes do cartão
│   │   ├── CreditCardsWidget/# Widget de cartões de crédito
│   │   ├── DashboardHeader/  # Cabeçalho com filtros e busca
│   │   ├── ExpensesByCategoryCarousel/ # Carrossel de gastos por categoria
│   │   ├── FinancialFlowChart/# Gráfico de fluxo financeiro
│   │   ├── IncomeCard/       # Card de receitas
│   │   ├── ExpenseCard/      # Card de despesas
│   │   ├── NewTransactionModal/ # Modal de nova transação
│   │   ├── TransactionsTable/   # Tabela de transações
│   │   └── UpcomingExpensesWidget/ # Widget de próximas despesas
│   └── layout/               # Componentes de layout
│       ├── HeaderMobile/     # Header para mobile/tablet
│       ├── MainLayout/       # Layout principal com sidebar/header
│       └── Sidebar/          # Sidebar para desktop
├── constants/                # Constantes do sistema
│   ├── animations.ts         # Constantes de animações
│   └── index.ts              # Categorias, rotas, breakpoints
├── contexts/                 # Contextos React (estado global)
│   ├── FinanceContext.tsx    # Contexto principal de finanças
│   └── mockData.ts           # Dados mock para desenvolvimento
├── hooks/                    # Hooks customizados
│   ├── useCountAnimation.ts  # Hook para animação de números
│   └── useSidebar.ts         # Hook para estado da sidebar
├── pages/                    # Páginas de nível superior
│   ├── CardsView.tsx         # Página de cartões
│   ├── ProfileView.tsx       # Página de perfil
│   └── TransactionsView.tsx  # Página de transações
├── styles/                   # Estilos globais
│   ├── base.css              # Estilos base e animações
│   └── variables.css         # Design tokens (CSS variables)
├── types/                    # Tipos TypeScript
│   └── index.ts              # Interfaces e tipos principais
├── utils/                    # Funções utilitárias
│   ├── __tests__/            # Testes básicos
│   ├── array.utils.ts        # Utilitários de arrays
│   ├── currency.utils.ts     # Formatação de moeda
│   ├── date.utils.ts         # Formatação de datas
│   ├── finance.utils.ts      # Cálculos financeiros
│   ├── format.ts             # Funções de formatação (legado)
│   ├── id.utils.ts           # Geração de IDs únicos
│   ├── index.ts              # Barrel export
│   └── validation.utils.ts   # Validações (email, CPF, etc)
├── App.tsx                   # Componente raiz com rotas
└── main.tsx                  # Ponto de entrada da aplicação
```

## 🧩 Principais Componentes e Responsabilidades

### Context (`FinanceContext`)
Gerencia todo o estado global da aplicação:
- Arrays principais: transações, cartões, contas, membros, objetivos
- Filtros: membro, período, tipo, busca textual
- Funções CRUD para todas as entidades
- Cálculos financeiros derivados (saldo, receitas, despesas, percentuais)

### Páginas Principais

#### `Dashboard` (`App.tsx`)
Página inicial com visão geral:
- Cards de resumo (Saldo, Receitas, Despesas)
- Carrossel de gastos por categoria
- Widget de cartões de crédito
- Gráfico de fluxo financeiro
- Widget de próximas despesas
- Tabela resumida de transações

#### `CardsView` (`pages/CardsView.tsx`)
Página dedicada para cartões de crédito:
- Grid responsivo de cartões
- Informações detalhadas de cada cartão
- Ações: ver detalhes, adicionar despesa
- Estado vazio amigável

#### `TransactionsView` (`pages/TransactionsView.tsx`)
Página completa de transações:
- Filtros avançados (tipo, categoria, conta, membro, status, período)
- Resumo estatístico de filtros
- Tabela expandida com paginação
- Exportação para CSV

#### `ProfileView` (`pages/ProfileView.tsx`)
Página de perfil e configurações:
- **Aba Informações**: Dados do usuário e membros da família
- **Aba Configurações**: Preferências, notificações, categorias, privacidade

### Componentes de Layout

#### `MainLayout`
Layout principal que gerencia:
- Renderização condicional de Sidebar (desktop) ou HeaderMobile (mobile/tablet)
- Espaçamento do conteúdo baseado na sidebar
- Transições suaves

#### `Sidebar`
Navegação lateral para desktop (≥1280px):
- Estados expanded/collapsed
- Menu de navegação principal
- Empurra conteúdo, nunca sobrepõe

#### `HeaderMobile`
Cabeçalho para mobile/tablet (<1280px):
- Botão de menu (drawer)
- Ações principais (nova transação, etc)
- Some completamente no desktop

### Componentes de Dashboard

#### `BalanceCard`, `IncomeCard`, `ExpenseCard`
Cards de resumo financeiro:
- Valores com animação de contagem
- Ícones e cores diferenciadas
- Atualizam baseado em filtros ativos

#### `TransactionsTable`
Tabela de transações:
- Versão desktop: tabela completa com todas as colunas
- Paginação e busca local
- Integração com filtros globais

#### `ExpensesByCategoryCarousel`
Carrossel de donuts por categoria:
- Gráficos donut para cada categoria
- Navegação por setas ou dots
- Percentual e valor total

#### `FinancialFlowChart`
Gráfico de fluxo financeiro:
- Linha temporal de receitas e despesas
- Tooltips interativos
- Responsivo

### Modais

#### `NewTransactionModal`
Formulário completo para nova transação:
- Toggle Receita/Despesa
- Campos: valor, descrição, categoria, conta/cartão, membro
- Parcelamento (cartões)
- Despesa recorrente
- Validações completas

#### `AddAccountModal`
Formulário para adicionar conta bancária ou cartão de crédito:
- Toggle Conta/Cartão
- Campos específicos para cada tipo
- Validações

#### `CardDetailsModal`
Detalhes completos do cartão:
- Informações do cartão
- Progresso de uso
- Lista de despesas associadas
- Ações: adicionar despesa, editar, ver extrato

## 🎨 Design System

O projeto utiliza **Design Tokens do Figma** através de CSS Variables:

### Hierarquia de Variáveis

1. **Semânticas** (prioridade alta): `--color-primary`, `--spacing-container-padding`
2. **Primitivas** (fallback): `--gray-900`, `--spacing-md`
3. **Conversão**: Valores hardcoded convertidos para tokens mais próximos

### Cores Principais
- `--color-primary`: Verde-limão (#C6FF00)
- `--color-danger`: Vermelho para alertas
- `--color-success`: Verde para sucesso
- Tons de cinza de `--gray-0` a `--gray-900`

### Espaçamentos
- Container: `--spacing-container-padding`
- Cards: `--spacing-card-gap`
- Inputs: `--spacing-input-padding`

### Tipografia
- Heading: `--font-size-heading-lg`, `--font-size-heading-md`
- Body: `--font-size-body-lg`, `--font-size-body-md`, `--font-size-body-sm`
- Fontes: Inter ou fallback sans-serif

## 📱 Responsividade

### Breakpoints Oficiais

- **Mobile (base)**: < 768px
- **Tablet (md)**: ≥ 768px e < 1280px
- **Desktop (lg)**: ≥ 1280px e < 1920px
- **Wide/4K (xl)**: ≥ 1920px

### Estratégia Mobile-First

O layout base SEMPRE parte do mobile. Breakpoints apenas evoluem o layout, nunca o recriam.

### Padrões de Espaçamento

- **Mobile**: `px-4` (16px)
- **Tablet**: `px-6` (24px)
- **Desktop**: `px-8` (32px)

### Limites de Largura

- **Desktop**: `max-w-[1400px]`
- **Wide/4K**: `max-w-[1600px]`
- Centralização: `mx-auto`

### Sidebar vs HeaderMobile

- **< 1280px**: HeaderMobile visível, Sidebar não renderizada
- **≥ 1280px**: Sidebar visível, HeaderMobile não renderizada
- Nunca coexistem

### Grids Responsivos

- **Mobile**: 1 coluna (cards empilhados)
- **Tablet**: 2 colunas quando apropriado
- **Desktop**: 3-4 colunas dependendo do componente

## 📋 Rotas Principais

| Rota | Path | Descrição |
|------|------|-----------|
| Dashboard | `/` | Página inicial com visão geral |
| Cartões | `/cartoes` | Gerenciamento de cartões de crédito |
| Transações | `/transacoes` | Lista completa e filtros avançados |
| Objetivos | `/objetivos` | Objetivos financeiros (placeholder) |
| Perfil | `/perfil` | Perfil e configurações do usuário |

## 🔄 Estado Global

Estado gerenciado via **React Context** (`FinanceProvider`):

### Dados Principais
- `transactions`: Array de transações
- `creditCards`: Array de cartões de crédito
- `bankAccounts`: Array de contas bancárias
- `familyMembers`: Array de membros da família
- `goals`: Array de objetivos financeiros

### Filtros Globais
- `selectedMember`: ID do membro selecionado (null = todos)
- `dateRange`: Intervalo de datas selecionado
- `transactionType`: 'all' | 'income' | 'expense'
- `searchText`: Texto de busca

### Funções Principais
- CRUD completo para todas as entidades
- `getFilteredTransactions()`: Retorna transações filtradas
- `calculateTotalBalance()`: Calcula saldo total
- `calculateIncomeForPeriod()`: Calcula receitas do período
- `calculateExpensesForPeriod()`: Calcula despesas do período

**Nota**: Atualmente os dados são temporários (memória). Não há persistência em localStorage ou backend. Futuramente integração com Supabase.

## 🧪 Testes e Validação

Veja `TESTING_CHECKLIST.md` para checklist completo de testes.

### Validações Implementadas

- ✅ Cálculos financeiros (tratamento de divisão por zero)
- ✅ Filtros combinados (AND lógico)
- ✅ Formatações brasileiras (moeda, datas, percentuais)
- ✅ Responsividade em todos os breakpoints
- ✅ Modais (validações, fechamento por ESC/click)
- ✅ Acessibilidade (navegação por teclado, aria-labels)

## 🛡️ Tratamento de Erros

### Cálculos Financeiros
- Divisão por zero: Retorna 0
- Arrays vazios: Tratados em filtros e cálculos

### Formulários
- Validação de campos obrigatórios
- Mensagens de erro descritivas
- Campos destacados quando inválidos

### Filtros
- Arrays vazios: Retornam array vazio, não erro
- Filtros combinados: Funcionam em conjunto (AND lógico)

## 📝 Decisões de Design

### Formatação Monetária
Sempre formato brasileiro: `R$ 1.234,56`
- Pontos para milhar
- Vírgula para decimais
- Sempre 2 casas decimais

### Formatação de Datas
Sempre formato brasileiro: `DD/MM/AAAA`
- Dia e mês com 2 dígitos
- Ano com 4 dígitos

### Percentuais
Sempre uma casa decimal: `XX,X%`
- Vírgula para decimais

### Animações
- Respeitam `prefers-reduced-motion`
- Transições suaves (200-300ms)
- Animações de entrada com stagger

### Modais
- No mobile: 100% da viewport
- No desktop: `max-width` adequado com centralização
- Header e footer fixos, corpo scrollável

## 🚧 Próximos Passos (Roadmap)

- [ ] Integração com Supabase para persistência real
- [ ] Autenticação de usuários
- [ ] Implementação completa da página de Objetivos
- [ ] Exportação para PDF além de CSV
- [ ] Dashboard com mais gráficos e estatísticas
- [ ] Notificações push para vencimentos
- [ ] App mobile nativo (React Native)

## 📝 Licença

Projeto privado - mycash+ © 2024

## 👥 Contribuindo

Atualmente o projeto não aceita contribuições externas. Para sugestões ou relatos de bugs, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para gestão financeira familiar**
