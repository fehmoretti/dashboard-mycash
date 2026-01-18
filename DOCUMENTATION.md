# mycash+ — Documentação do Projeto

## 📋 Progresso Geral

- [x] PROMPT 0: Análise e Planejamento Inicial
- [ ] PROMPT 1: Estrutura Base do Projeto
- [ ] PROMPT 2: Design Tokens e Sistema de Variáveis
- [ ] PROMPT 3: Layout Base e Sidebar Desktop
- [ ] PROMPT 4: Header Mobile e Navegação Responsiva
- [ ] PROMPT 5: Componentes Comuns Base
- [ ] PROMPT 6: Cards de Categorias
- [ ] PROMPT 7: Resumo Financeiro
- [ ] PROMPT 8: Gráfico de Fluxo Financeiro
- [ ] PROMPT 9: Cards & Contas
- [ ] PROMPT 10: Tabela de Extrato Detalhado
- [ ] PROMPT 11: Lista de Próximas Despesas
- [ ] PROMPT 12: Integração - Página Dashboard Completa
- [ ] PROMPT 13: Página Cartões
- [ ] PROMPT 14: Página Transações
- [ ] PROMPT 15: Página Perfil
- [ ] PROMPT 16: Polimento e Ajustes Finais

---

## ✅ PROMPT 0: Análise e Planejamento Inicial

**Status:** ✅ Concluído | **Data:** 2025-01-20 | **Build:** N/A (análise)

### 📚 Pré-Execução
✓ Rules relidas e compreendidas  
✓ Design do Figma analisado (via descrição detalhada)  
✓ Hierarquia de variáveis confirmada  
✓ Link do Figma: https://www.figma.com/design/wbuuHK3yzUkcfDL7Qyk0gN/Workshop---Do-figma-MCP-ao-Cursor-AI-v.3--Community-?node-id=42-3096&t=3nTraaYYHzZZZiNl-4

---

## 🎨 Mapeamento de Componentes Visuais (Dashboard)

### Hierarquia de Componentes Identificados:

#### **Sidebar (Barra Lateral Esquerda)**
- **Cabeçalho:** Logo "Mycash+" + botão de colapso (`<`)
- **Controles Superiores:**
  - Campo de busca ("🔍 Pesquisar")
  - Ícone de filtro
  - Seletor de intervalo de datas ("01 Jan - 31 Jan 2026") + ícone calendário
- **Avatares de Usuários:** 3 avatares circulares + ícone "+" (adicionar)
- **Navegação Principal:**
  - "Home" (ativo - destaque verde)
  - "Cartões" (com ícone)
- **Perfil do Usuário (inferior):**
  - Avatar circular
  - Nome: "Lucas Marte"
  - Email: "lucasmarte@gmail.com"

#### **Área de Conteúdo Principal (Dashboard)**

**Linha 1: Categorias de Despesas (4 Cards)**
- ExpenseCategoryCard × 4
  - Aluguel: 25%, R$ 4.000,00
  - Alimentação: 15%, R$ 2.000,00
  - Mercado: 5%, R$ 1.500,00
  - Academia: 3%, R$ 120,00
- Componentes: Medidor circular de progresso, rótulo, valor monetário

**Linha 2: Resumo Financeiro (3 Cards)**
- FinancialSummaryCard × 3
  - Saldo total: R$ 2.000,00 (azul, negrito)
  - Receitas: R$ 12.000,00 (verde, ícone seta baixo)
  - Despesas: R$ 10.000,00 (vermelho, ícone seta cima)

**Linha 3: Fluxo Financeiro e Cards & Contas (2 Seções)**
- **FinancialFlowChart:**
  - Gráfico de área (receitas verde/amarelo, despesas vermelho/rosa)
  - Eixo X: meses (JAN-DEZ)
  - Eixo Y: valores (R$ 0 - R$ 17.500)
  - Legenda: • Receitas (verde) | • Despesas (vermelho)
- **CardsAndAccountsList:**
  - Título + ícones de ação
  - Lista de contas:
    - Nubank: R$ 120,00, Vence dia 10, **** 5897
    - Inter: R$ 2.300,00, Vence dia 21, **** 5897
    - Picpay: R$ 17.000,00, Vence dia 12, **** 5897

**Linha 4: Extrato Detalhado e Próximas Despesas (2 Seções)**
- **DetailedStatementTable:**
  - Barra de busca + dropdown filtro
  - Tabela com colunas: Membro, Datas, Descrição, Categorias, Conta/cartão, Parcelas, Valor
  - Exemplos de linhas (3 linhas visíveis)
  - Paginação: "Mostrando 1 a 5 de 17" + controles (← 1 2 3 4 5 →)
- **UpcomingExpensesList:**
  - Título + botão "+"
  - Lista de 5 despesas futuras (ex: "Conta de Luz", R$ 154,00, checkmark verde)

**Botão Global:** "+ Nova transação" (canto superior direito, verde, texto branco)

---

## 🎨 Mapeamento de Tokens (Variáveis)

### **Cores Semânticas (Identificadas):**
- `--color-primary`: Verde brilhante (navegação ativa, botões ação, receitas)
- `--color-secondary`: Azul (valor "Saldo total")
- `--color-danger`: Vermelho (indicadores negativos, despesas)
- `--color-success`: Verde (checkmarks, receitas)
- `--color-text-primary`: Preto (títulos, texto principal)
- `--color-text-secondary`: Cinza escuro (texto secundário, rótulos)
- `--color-background-primary`: Branco (fundo principal, cards)
- `--color-background-secondary`: Cinza muito claro (fundo sidebar)
- `--color-border`: Cinza claro (bordas cards, inputs)
- `--color-chart-income`: Verde/amarelo claro (área gráfico receitas)
- `--color-chart-expense`: Vermelho/rosa claro (área gráfico despesas)

### **Cores Primitivas (Inferidas - necessita confirmação do Figma):**
- `--gray-0`: Branco (#FFFFFF)
- `--gray-50`: Cinza muito claro (fundo sidebar)
- `--gray-100`: Cinza claro (ícones, texto secundário)
- `--gray-200`: Cinza médio claro (bordas)
- `--gray-900`: Preto (#000000 ou próximo)

### **Espaçamento Semântico (Inferido):**
- `--spacing-container-padding`: Padding interno de containers/cards
- `--spacing-card-gap`: Espaçamento entre cards
- `--spacing-item-gap`: Espaçamento entre itens de lista
- `--spacing-input-padding`: Padding interno de inputs

### **Espaçamento Primitivo (Baseado em grid 4px/8px):**
- `--spacing-xs`: 4px
- `--spacing-sm`: 8px
- `--spacing-md`: 16px
- `--spacing-lg`: 24px ou 32px
- `--spacing-xl`: 48px ou 64px

### **Tipografia Semântica (Inferida):**
- `--font-family-primary`: Sans-serif (Inter/Roboto provável)
- `--font-size-heading-lg`: Logo "Mycash+"
- `--font-size-heading-md`: Títulos de seção
- `--font-size-body-lg`: Valores monetários grandes
- `--font-size-body-md`: Texto principal, rótulos
- `--font-size-body-sm`: Texto secundário ("Vence dia 10")
- `--font-weight-bold`: Valores, títulos
- `--font-weight-regular`: Texto corpo

### **Shape (Forma) Semântica:**
- `--border-radius-card`: Cantos arredondados de cards
- `--border-radius-button`: Cantos arredondados de botões
- `--border-radius-avatar`: 50% (circular)
- `--border-radius-input`: Cantos arredondados de inputs

### **Shape Primitivo:**
- `--border-radius-sm`: 4px
- `--border-radius-md`: 8px
- `--border-radius-lg`: 12px ou 16px
- `--border-radius-full`: 50%

---

## 🧭 Estrutura de Navegação

### **Sidebar Desktop (≥1280px):**
- **Estado Expandido (padrão):**
  - Exibe texto completo + ícones
  - Logo "Mycash+" visível
  - Links de navegação com texto ("Home", "Cartões")
- **Estado Colapsado:**
  - Largura reduzida
  - Apenas ícones visíveis
  - Logo pode ser simplificado
  - Toggle via botão `<` ao lado do logo

### **Header Mobile (<1280px):**
- **Não renderiza sidebar**
- **Header superior contém:**
  - Botão menu (hambúrguer) → abre drawer
  - Botão "+ Nova transação"
  - Possivelmente logo/título
- **Drawer de navegação:**
  - Overlay escuro
  - Painel lateral com menu completo
  - Fecha ao clicar fora ou em item

### **Transições:**
- Navegação entre páginas via sidebar/header mobile
- Transição suave entre estados expandido/colapsado da sidebar
- Animações de abertura/fechamento do drawer

---

## 📁 Arquitetura Proposta

### **Estrutura de Pastas:**
```
src/
├── assets/                    # Imagens, ícones, fontes
│   ├── images/
│   └── icons/
├── components/                # Componentes React
│   ├── common/                # Componentes genéricos reutilizáveis
│   │   ├── Card/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Avatar/
│   │   └── Badge/
│   ├── layout/                # Componentes de layout
│   │   ├── MainLayout/
│   │   ├── Sidebar/
│   │   ├── HeaderMobile/
│   │   └── Drawer/
│   ├── dashboard/             # Componentes específicos do Dashboard
│   │   ├── ExpenseCategoryCard/
│   │   ├── FinancialSummaryCard/
│   │   ├── FinancialFlowChart/
│   │   ├── CardsAndAccountsList/
│   │   ├── DetailedStatementTable/
│   │   └── UpcomingExpensesList/
│   └── navigation/            # Componentes de navegação
│       ├── NavLink/
│       └── Pagination/
├── contexts/                  # Contextos React (estado global se necessário)
├── hooks/                     # Hooks customizados
│   ├── useSidebar.ts
│   └── useResponsive.ts
├── pages/                     # Páginas de nível superior
│   ├── Dashboard/
│   ├── Cards/
│   ├── Transactions/
│   └── Profile/
├── services/                  # Chamadas de API (Supabase)
├── styles/                    # Estilos globais e tokens
│   ├── base.css              # Resets, estilos base
│   ├── variables.css         # Design tokens (CSS variables)
│   └── typography.css        # Estilos tipográficos
├── utils/                     # Funções utilitárias
│   ├── formatters.ts         # Formatação de moeda, datas
│   └── helpers.ts
├── App.tsx                    # Componente principal
└── main.tsx                   # Ponto de entrada
```

### **Hierarquia de Componentes:**

```
App.tsx
└── MainLayout
    ├── Sidebar (desktop ≥1280px)
    │   ├── MycashLogo
    │   ├── SearchBar
    │   ├── DateRangeSelector
    │   ├── UserAvatars
    │   ├── NavigationLinks
    │   └── UserProfile
    └── Main (área de conteúdo)
        ├── HeaderMobile (mobile <1280px)
        │   ├── MenuButton
        │   └── NewTransactionButton
        ├── Drawer (mobile <1280px)
        └── [Páginas]
            └── Dashboard
                ├── ExpenseCategoriesSection
                │   └── ExpenseCategoryCard × 4
                ├── FinancialSummarySection
                │   └── FinancialSummaryCard × 3
                ├── FinancialFlowSection
                │   └── FinancialFlowChart
                ├── CardsAndAccountsSection
                │   └── CardsAndAccountsList
                │       └── AccountCard × 3
                ├── DetailedStatementSection
                │   └── DetailedStatementTable
                └── UpcomingExpensesSection
                    └── UpcomingExpensesList
                        └── UpcomingExpenseItem × 5
```

### **Estratégia de Componentização:**

1. **Atomic Design:**
   - Átomos: Button, Input, Avatar, Badge
   - Moléculas: SearchBar, NavLink, Card
   - Organismos: ExpenseCategoryCard, FinancialSummaryCard
   - Templates: Sections (ExpenseCategoriesSection, etc)
   - Páginas: Dashboard, Cards, Transactions, Profile

2. **Reusabilidade:**
   - Componente `Card` base usado por todos os cards
   - Componente `Button` com variantes
   - Componentes de layout (Sidebar, HeaderMobile) reutilizáveis

3. **Separação de Responsabilidades:**
   - Componentes de apresentação (presentational) sem estado
   - Hooks para lógica reutilizável (useSidebar, useResponsive)
   - Services para chamadas de API
   - Utils para formatação

4. **Design Tokens:**
   - Todos os valores visuais via CSS variables
   - Tokens semânticos priorizados sobre primitivos
   - Conversões documentadas quando necessário

5. **Responsividade:**
   - Mobile-first approach
   - Sidebar renderizada condicionalmente (apenas desktop)
   - HeaderMobile renderizado condicionalmente (apenas mobile)
   - Grids responsivos (auto-fit/auto-fill)

---

## 📝 Notas Técnicas

### **Stack Confirmada:**
- React 18+ com TypeScript
- Vite (build tool)
- Tailwind CSS (utility-first)
- Supabase (backend - integração futura)

### **Breakpoints:**
- Mobile (base): < 768px
- Tablet: ≥ 768px e < 1280px
- Desktop: ≥ 1280px e < 1920px
- Wide/4K: ≥ 1920px

### **Regras Críticas:**
- Layout 100% fluido (width: 100%, max-width quando necessário)
- Sem overflow horizontal
- Sidebar NÃO existe em mobile/tablet (renderização condicional)
- HeaderMobile NÃO existe em desktop (renderização condicional)
- Hierarquia de variáveis: Semântica → Primitiva → Conversão (NUNCA hardcoded)

---

## 🔄 Conversões Pendentes (Serão Documentadas Durante Implementação)

Conversões de valores hardcoded para tokens serão documentadas durante a implementação de cada prompt.

---

## 📚 Próximos Passos

⏭️ **PROMPT 1:** Estrutura Base do Projeto

**Comandos disponíveis:**
- "Próximo" → Avançar para PROMPT 1
- "Revisar [arquivo]" → Revisar arquivo específico
- "Status" → Ver progresso geral
