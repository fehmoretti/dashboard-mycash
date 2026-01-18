# 🎯 Sequência de Prompts - Dashboard mycash+

## PROMPT 0: Análise e Planejamento Inicial ✅
**Status:** Em execução

### Objetivos:
1. Acessar design do Figma e mapear componentes visuais
2. Identificar todas as variables semânticas e primitivas
3. Analisar estrutura de navegação (sidebar, header mobile)
4. Apresentar resumo da arquitetura proposta

---

## PROMPT 1: Estrutura Base do Projeto
**Objetivo:** Criar estrutura inicial do projeto React + TypeScript + Vite + Tailwind

### Tarefas:
- [ ] Inicializar projeto Vite com React + TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Criar estrutura de pastas (src/components, src/pages, src/styles)
- [ ] Configurar arquivo de variáveis CSS (tokens)
- [ ] Criar arquivo base.css com resets
- [ ] Configurar tailwind.config.js com breakpoints
- [ ] Criar arquivo DOCUMENTATION.md inicial
- [ ] npm run build (validar setup)

---

## PROMPT 2: Design Tokens e Sistema de Variáveis
**Objetivo:** Implementar todos os tokens de design (cores, espaçamento, tipografia, shape)

### Tarefas:
- [ ] Criar arquivo src/styles/variables.css
- [ ] Mapear e definir tokens semânticos de cor
- [ ] Mapear e definir tokens primitivos de cor (escala de cinza, etc)
- [ ] Definir tokens de espaçamento (xs, sm, md, lg, xl)
- [ ] Definir tokens de tipografia (font-size, font-weight, line-height)
- [ ] Definir tokens de shape (border-radius)
- [ ] Integrar tokens com Tailwind via CSS variables
- [ ] Documentar todas as variáveis
- [ ] npm run build (validar)

---

## PROMPT 3: Layout Base e Sidebar Desktop
**Objetivo:** Implementar layout principal com sidebar desktop (estados expandido/colapsado)

### Tarefas:
- [ ] Criar componente MainLayout
- [ ] Criar componente Sidebar
- [ ] Implementar estado expandido da sidebar (com texto)
- [ ] Implementar estado colapsado da sidebar (apenas ícones)
- [ ] Implementar toggle de expansão/colapso
- [ ] Adicionar logo Mycash+
- [ ] Adicionar navegação (Home, Cartões)
- [ ] Implementar área de conteúdo principal (main)
- [ ] Garantir responsividade (sidebar só desktop ≥1280px)
- [ ] npm run build (validar)

---

## PROMPT 4: Header Mobile e Navegação Responsiva
**Objetivo:** Implementar header mobile para telas <1280px e drawer de navegação

### Tarefas:
- [ ] Criar componente HeaderMobile
- [ ] Implementar botão de menu (hambúrguer)
- [ ] Criar componente Drawer/NavigationMenu
- [ ] Implementar overlay para drawer
- [ ] Adicionar botão "+ Nova transação" no header mobile
- [ ] Garantir que sidebar NÃO renderize em mobile
- [ ] Garantir que header mobile NÃO renderize em desktop
- [ ] Implementar transições suaves
- [ ] npm run build (validar)

---

## PROMPT 5: Componentes Comuns Base (Card, Button, Input, Avatar)
**Objetivo:** Criar componentes reutilizáveis atômicos do design system

### Tarefas:
- [ ] Criar componente Card (com variantes)
- [ ] Criar componente Button (primary, secondary, variants)
- [ ] Criar componente Input (search, date picker)
- [ ] Criar componente Avatar
- [ ] Criar componente Badge/Icon
- [ ] Garantir responsividade em todos os componentes
- [ ] Documentar props e variantes
- [ ] npm run build (validar)

---

## PROMPT 6: Componentes Dashboard - Linha 1 (Cards de Categorias)
**Objetivo:** Implementar cards de despesas por categoria com medidor circular

### Tarefas:
- [ ] Criar componente ExpenseCategoryCard
- [ ] Implementar medidor circular de progresso (25%, 15%, 5%, 3%)
- [ ] Adicionar ícones de categoria
- [ ] Exibir valores monetários formatados
- [ ] Criar seção ExpenseCategoriesSection
- [ ] Implementar grid responsivo (4 colunas desktop, 2 tablet, 1 mobile)
- [ ] npm run build (validar)

---

## PROMPT 7: Componentes Dashboard - Linha 2 (Resumo Financeiro)
**Objetivo:** Implementar cards de resumo financeiro (Saldo total, Receitas, Despesas)

### Tarefas:
- [ ] Criar componente FinancialSummaryCard
- [ ] Implementar card "Saldo total" (azul)
- [ ] Implementar card "Receitas" (verde)
- [ ] Implementar card "Despesas" (vermelho)
- [ ] Adicionar ícones apropriados
- [ ] Criar seção FinancialSummarySection
- [ ] Implementar grid responsivo (3 colunas desktop, 2 tablet, 1 mobile)
- [ ] npm run build (validar)

---

## PROMPT 8: Componente Gráfico de Fluxo Financeiro
**Objetivo:** Implementar gráfico de área mostrando receitas e despesas ao longo dos meses

### Tarefas:
- [ ] Instalar biblioteca de gráficos (Recharts ou Chart.js)
- [ ] Criar componente FinancialFlowChart
- [ ] Implementar gráfico de área (area chart)
- [ ] Adicionar eixos (meses JAN-DEZ, valores R$ 0-17.500)
- [ ] Adicionar legendas (Receitas verde, Despesas vermelho)
- [ ] Criar seção FinancialFlowSection
- [ ] Garantir responsividade do gráfico
- [ ] npm run build (validar)

---

## PROMPT 9: Componente Cards & Contas
**Objetivo:** Implementar lista de cartões e contas bancárias

### Tarefas:
- [ ] Criar componente AccountCard
- [ ] Adicionar logos de bancos (Nubank, Inter, Picpay)
- [ ] Exibir valores, datas de vencimento e últimos 4 dígitos
- [ ] Criar componente CardsAndAccountsList
- [ ] Adicionar botões de ação (+ adicionar, navegação)
- [ ] Criar seção CardsAndAccountsSection
- [ ] npm run build (validar)

---

## PROMPT 10: Componente Tabela de Extrato Detalhado
**Objetivo:** Implementar tabela de extrato com busca, filtro e paginação

### Tarefas:
- [ ] Criar componente DetailedStatementTable
- [ ] Implementar colunas (Membro, Datas, Descrição, Categorias, Conta/cartão, Parcelas, Valor)
- [ ] Adicionar barra de busca
- [ ] Implementar dropdown de filtro (Despesas, Receitas, etc)
- [ ] Adicionar paginação ("Mostrando 1 a 5 de 17")
- [ ] Implementar controles de navegação (← 1 2 3 4 5 →)
- [ ] Criar seção DetailedStatementSection
- [ ] Garantir responsividade (mobile: layout empilhado)
- [ ] npm run build (validar)

---

## PROMPT 11: Componente Lista de Próximas Despesas
**Objetivo:** Implementar lista de despesas futuras com checkmarks

### Tarefas:
- [ ] Criar componente UpcomingExpenseItem
- [ ] Implementar layout de item (descrição, valor, data vencimento, cartão)
- [ ] Adicionar ícone de checkmark verde
- [ ] Criar componente UpcomingExpensesList
- [ ] Adicionar botão "+ Adicionar despesa"
- [ ] Criar seção UpcomingExpensesSection
- [ ] npm run build (validar)

---

## PROMPT 12: Integração - Página Dashboard Completa
**Objetivo:** Integrar todos os componentes na página Dashboard

### Tarefas:
- [ ] Criar página Dashboard.tsx
- [ ] Integrar todas as seções (linhas 1-4)
- [ ] Adicionar botão "+ Nova transação" global
- [ ] Implementar layout em grid responsivo
- [ ] Garantir espaçamentos corretos entre seções
- [ ] Adicionar container principal com max-width
- [ ] Implementar roteamento (React Router)
- [ ] npm run build (validar)

---

## PROMPT 13: Página Cartões
**Objetivo:** Criar página de gestão de cartões (estrutura base)

### Tarefas:
- [ ] Criar página Cards.tsx
- [ ] Implementar layout base da página
- [ ] Adicionar navegação via sidebar
- [ ] Garantir integração com MainLayout
- [ ] npm run build (validar)

---

## PROMPT 14: Página Transações
**Objetivo:** Criar página de gestão de transações (estrutura base)

### Tarefas:
- [ ] Criar página Transactions.tsx
- [ ] Implementar layout base da página
- [ ] Adicionar navegação via sidebar
- [ ] Garantir integração com MainLayout
- [ ] npm run build (validar)

---

## PROMPT 15: Página Perfil
**Objetivo:** Criar página de perfil do usuário (estrutura base)

### Tarefas:
- [ ] Criar página Profile.tsx
- [ ] Implementar layout base da página
- [ ] Adicionar navegação via sidebar
- [ ] Garantir integração com MainLayout
- [ ] npm run build (validar)

---

## PROMPT 16: Polimento e Ajustes Finais
**Objetivo:** Ajustes finais de UX, performance e responsividade

### Tarefas:
- [ ] Revisar todos os breakpoints
- [ ] Validar em 375px, 768px, 1280px, 1920px
- [ ] Garantir que não há overflow horizontal
- [ ] Otimizar performance (lazy loading, memoização se necessário)
- [ ] Ajustar espaçamentos e alinhamentos
- [ ] Revisar hierarquia de tokens utilizados
- [ ] Documentar conversões finais
- [ ] npm run build (validar)

---

## 📝 Notas Importantes

- **Ciclo Obrigatório:** Reler rules → Consultar Figma → Executar → Build → Aprovar → Documentar → Commit
- **Hierarquia de Variáveis:** Semântica → Primitiva → Conversão (NUNCA hardcoded)
- **Responsividade:** Mobile-first, breakpoints em 768px (tablet) e 1280px (desktop)
- **Sidebar:** Apenas desktop ≥1280px, colapsada/expandida
- **Header Mobile:** Apenas <1280px
- **Build:** Validar após CADA prompt com `npm run build`
